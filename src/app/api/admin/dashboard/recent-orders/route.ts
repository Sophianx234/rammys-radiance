export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { Order } from "@/models/Order";
import { User } from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search") || "";

    // Build query
    const query: any = {};

    // Filter by status
    if (status !== "all") {
      query.orderStatus = status;
    }

    // Search by name, email, ID
    if (search) {
      query.$or = [
        { _id: { $regex: search, $options: "i" } },
        { "customer.email": { $regex: search, $options: "i" } },
      ];
    }

    // Get orders + populate user
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("user", "name email profile");

    // Format response for your card
    const formatted = orders.map((order: any) => {
      const user = order.user;

      // Fallback initials
      let initials = "UN";
      if (user?.name) {
        const parts = user.name.split(" ");
        initials = parts.map((p) => p[0]).join("").slice(0, 2).toUpperCase();
      }

      return {
        _id: order._id.toString(),
        customerName: user?.name || "Unknown User",
        customerEmail: user?.email || "N/A",
        avatar: user?.profile || null,
        initials,

        status: order.orderStatus,
        date: order.createdAt,
        totalAmount: order.totalAmount,
      };
    });

    return NextResponse.json({
      orders: formatted,
    });
  } catch (error) {
    console.error("RECENT ORDERS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent orders" },
      { status: 500 }
    );
  }
}

