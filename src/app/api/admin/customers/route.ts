export const dynamic = "force-dynamic";
// app/api/admin/customers/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/User";
import { Order } from "@/models/Order";


export async function GET() {
  try {
    await connectToDatabase();

    // Fetch all users (excluding password)
    const users = await User.find().select("-password").lean();

    // Fetch all orders grouped by userId
    const orderCounts = await Order.aggregate([
      {
        $group: {
          _id: "$user",   // field in Order model representing the user
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert aggregation result to a quick lookup map
    const orderMap = new Map(
      orderCounts.map((o) => [String(o._id), o.count])
    );

    // Attach ordersCount to each user
    const customers = users.map((user) => ({
      ...user,
      orders: orderMap.get(String(user._id)) || 0
    }));

    return NextResponse.json({ customers }, { status: 200 });

  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}


