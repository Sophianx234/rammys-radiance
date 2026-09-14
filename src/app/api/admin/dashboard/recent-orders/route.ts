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
      const customerName = user?.name || order.customer?.name || "Unknown User";
      const customerEmail = user?.email || order.customer?.email || "N/A";

      // Fallback initials
      let initials = "UN";
      if (customerName && customerName !== "Unknown User") {
        initials = customerName.split(" ").filter(Boolean).map((p: string) => p[0]).join("").slice(0, 2).toUpperCase();
      }

      return {
        _id: order._id.toString(),
        customerName,
        customerEmail,
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
