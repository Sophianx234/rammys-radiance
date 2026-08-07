import { cache } from "react";
import { connectToDatabase } from "@/lib/connectDB";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { User } from "@/models/User";

export const getDashboardStats = cache(async () => {
  await connectToDatabase();
  const LOW_STOCK_THRESHOLD = 5;
  const now = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(now.getMonth() - 1);
  const last24Hours = new Date();
  last24Hours.setHours(last24Hours.getHours() - 24);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    revenueAgg,
    revenueLastMonthAgg,
    totalOrders,
    ordersLast24,
    totalCustomers,
    newCustomersThisMonth,
    lowStockCount
  ] = await Promise.all([
    Order.aggregate([{ $match: { paymentStatus: "paid" } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
    Order.aggregate([{ $match: { paymentStatus: "paid", createdAt: { $gte: lastMonth } } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: last24Hours } }),
    User.countDocuments(),
    User.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Product.countDocuments({ stock: { $lte: LOW_STOCK_THRESHOLD } }),
  ]);

  const totalRevenue = revenueAgg[0]?.total || 0;
  const revenueLastMonth = revenueLastMonthAgg[0]?.total || 0;
  const revenueGrowth = revenueLastMonth === 0 ? 0 : ((totalRevenue - revenueLastMonth) / revenueLastMonth) * 100;

  return {
    totalRevenue,
    totalOrders,
    totalCustomers,
    lowStockCount,
    descriptions: {
      revenue: `${revenueGrowth.toFixed(1)}% growth since last month`,
      orders: `${ordersLast24} new orders in the last 24 hours`,
      customers: `${newCustomersThisMonth} new customers this month`,
      stock: lowStockCount > 0 ? `${lowStockCount} items need restocking` : "All items well stocked",
    },
  };
});

export const getRecentOrders = cache(async (status: string, search: string) => {
  await connectToDatabase();
  const query: any = {};
  if (status && status !== "all") query.orderStatus = status;
  if (search) {
    query.$or = [
      { _id: { $regex: search, $options: "i" } },
      { "customer.email": { $regex: search, $options: "i" } },
    ];
  }

  const orders = await Order.find(query).sort({ createdAt: -1 }).limit(20).populate("user", "name email profile");
  return orders.map((order: any) => {
    const user = order.user;
    let initials = "UN";
    if (user?.name) {
      initials = user.name.split(" ").map((p: string) => p[0]).join("").slice(0, 2).toUpperCase();
    }
    return {
      _id: order._id.toString(),
      customerName: user?.name || "Unknown User",
      customerEmail: user?.email || "N/A",
      avatar: user?.profile || null,
      initials,
      status: order.orderStatus,
      date: order.createdAt.toISOString(),
      totalAmount: order.totalAmount,
    };
  });
});

export const getSalesData = cache(async () => {
  await connectToDatabase();
  const start = new Date();
  start.setDate(start.getDate() - 6);
  const sales = await Order.aggregate([
    { $match: { createdAt: { $gte: start }, paymentStatus: "paid" } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, total: { $sum: "$totalAmount" } } },
    { $sort: { _id: 1 } },
  ]);

  const result = [];
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    const match = sales.find((x) => x._id === key);
    result.push({ name: days[d.getDay()], sales: match ? match.total : 0 });
  }
  return result;
});

export const getStockAlerts = cache(async () => {
  await connectToDatabase();
  const lowStock = await Product.find({ stock: { $lte: 10 } }).select("name price images stock").sort({ stock: 1 }).limit(10);
  return lowStock.map((p: any) => ({
    _id: p._id.toString(),
    name: p.name,
    price: p.price,
    stock: p.stock,
    images: p.images
  }));
});

export const getAllOrders = cache(async (params: { page: number, limit: number, search?: string, status?: string[], dateFilter?: string }) => {
  await connectToDatabase();
  
  const query: any = {};
  
  if (params.search) {
    query.$or = [
      { paymentReference: { $regex: params.search, $options: "i" } },
      { "customer.phone": { $regex: params.search, $options: "i" } },
    ];
  }
  
  if (params.status && params.status.length > 0) {
    query.orderStatus = { $in: params.status };
  }
  
  if (params.dateFilter && params.dateFilter !== "all") {
    const now = new Date();
    if (params.dateFilter === "today") {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      query.createdAt = { $gte: today };
    } else if (params.dateFilter === "week") {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      query.createdAt = { $gte: weekAgo };
    } else if (params.dateFilter === "month") {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      query.createdAt = { $gte: monthAgo };
    }
  }

  const orders = await Order.find(query)
    .populate("user", "-password")
    .populate("items.product")
    .sort({ createdAt: -1 })
    .skip((params.page - 1) * params.limit)
    .limit(params.limit)
    .lean();
    
  const totalOrders = await Order.countDocuments(query);
  
  // Serialize dates and objects
  const serializedOrders = orders.map((o: any) => ({
    ...o,
    _id: o._id.toString(),
    user: o.user ? { ...o.user, _id: o.user._id.toString() } : null,
    items: o.items.map((i: any) => ({
      ...i,
      _id: i._id?.toString(),
      product: i.product ? { ...i.product, _id: i.product._id.toString() } : null
    })),
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }));
  
  return {
    orders: serializedOrders,
    pagination: {
      total: totalOrders,
      page: params.page,
      totalPages: Math.ceil(totalOrders / params.limit)
    }
  };
});

export const getAllCustomers = cache(async (search?: string, role?: string) => {
  await connectToDatabase();
  
  const query: any = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (role && role !== "all") {
    query.role = role;
  }

  const users = await User.find(query).select("-password").lean();

  const orderCounts = await Order.aggregate([
    { $group: { _id: "$user", count: { $sum: 1 } } }
  ]);

  const orderMap = new Map(orderCounts.map((o) => [String(o._id), o.count]));

  return users.map((user: any) => ({
    ...user,
    _id: user._id.toString(),
    createdAt: user.createdAt?.toISOString() || null,
    orders: orderMap.get(String(user._id)) || 0
  }));
});
