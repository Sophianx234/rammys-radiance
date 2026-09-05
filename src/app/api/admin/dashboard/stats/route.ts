export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/connectDB";

export async function GET() {
  try {
    await connectToDatabase();

    const LOW_STOCK_THRESHOLD = 5;

    // Dates
    const now = new Date();

    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);

    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Run everything in parallel
    const [
      revenueAgg,
      revenueLastMonthAgg,
      totalOrders,
      ordersLast24,
      totalCustomers,
      newCustomersThisMonth,
      lowStockCount
    ] = await Promise.all([
      // Total revenue
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),

      // Revenue last month
      Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
            createdAt: { $gte: lastMonth }
          },
        },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),

      Order.countDocuments(),

      // Orders last 24 hours
      Order.countDocuments({ createdAt: { $gte: last24Hours } }),

      User.countDocuments(),

      // New customers this month
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),

      Product.countDocuments({ stock: { $lte: LOW_STOCK_THRESHOLD } }),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;
    const revenueLastMonth = revenueLastMonthAgg[0]?.total || 0;

    // Calculate revenue growth
    const revenueGrowth =
      revenueLastMonth === 0
        ? 0
        : ((totalRevenue - revenueLastMonth) / revenueLastMonth) * 100;

    // Build descriptions to send to UI
    const descriptions = {
      revenue: `${revenueGrowth.toFixed(1)}% growth since last month`,
      orders: `${ordersLast24} new orders in the last 24 hours`,
      customers: `${newCustomersThisMonth} new customers this month`,
      stock:
        lowStockCount > 0
          ? `${lowStockCount} items need restocking`
          : "All items well stocked",
    };

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      lowStockCount,
      descriptions,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Stats fetch failed" },
      { status: 500 }
    );
  }
}

