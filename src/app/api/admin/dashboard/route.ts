export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/connectDB";

export async function GET() {
  try {
    await connectToDatabase();

    // Define "Low Stock" threshold
    const LOW_STOCK_THRESHOLD = 5;

    // Calculate date for 7 days ago (for the chart)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Run all queries in parallel for performance
    const [
      totalRevenueResult,
      totalOrders,
      totalCustomers,
      lowStockCount,
      recentOrdersRaw,
      stockAlertsRaw,
      salesDataRaw
    ] = await Promise.all([
      // 1. Total Revenue (Only count 'paid' orders)
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),

      // 2. Total Orders
      Order.countDocuments(),

      // 3. Total Customers (Users with role 'customer')
      User.countDocuments(),

      // 4. Low Stock Count
      Product.countDocuments({ stock: { $lte: LOW_STOCK_THRESHOLD } }),

      // 5. Recent Orders (Fetch 5, populate User data)
      Order.find()
        .sort({ createdAt: -1 })
        .populate("user", "name email profile")
        .lean(),

      // 6. Inventory Alerts (Fetch specific items)
      Product.find({ stock: { $lte: LOW_STOCK_THRESHOLD } })
        .limit(5)
        .lean(),

      // 7. Sales Chart Data (Aggregation by Day)
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo },
            paymentStatus: "paid", // Only chart actual revenue
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            sales: { $sum: "$totalAmount" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // --- Data Transformation ---

    // Format Revenue
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // Format Recent Orders
    const recentOrders = recentOrdersRaw.map((order: any) => ({
      _id: order.paymentReference,
      // Handle cases where user might be deleted or null (guest checkout)
      customerName: order.user?.name || "Guest Customer", 
      customerEmail: order.user?.email || "N/A",
      avatar: order.user?.profile || "",
      totalAmount: order.totalAmount,
      status: order.orderStatus,
      date: order.createdAt,
    }));

    // Format Stock Alerts
    const stockAlerts = stockAlertsRaw.map((item: any) => ({
      _id: item._id,
      name: item.name,
      stock: item.stock,
      price: item.price,
      images: item.images
    }));

    // Format Sales Data (Fill in missing days with 0)
    const salesData = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i)); // Go back 6 days up to today
      const dateString = d.toISOString().split("T")[0]; // YYYY-MM-DD
      const dayName = dayNames[d.getDay()];

      // Find if we have sales for this specific date in our aggregation result
      const record = salesDataRaw.find((r: any) => r._id === dateString);

      salesData.push({
        name: dayName,
        sales: record ? record.sales : 0,
      });
    }

    // Return the combined JSON
    return NextResponse.json({
      stats: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        lowStockCount,
      },
      recentOrders,
      stockAlerts,
      salesData,
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
