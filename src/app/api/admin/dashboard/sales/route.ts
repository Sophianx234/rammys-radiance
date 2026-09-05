export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { Order } from "@/models/Order";

export async function GET() {
  try {
    await connectToDatabase();

    // Get sales for the last 7 days
    const start = new Date();
    start.setDate(start.getDate() - 6); // include today

    const sales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format output for chart
    const result = [];
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));

      const key = d.toISOString().split("T")[0];
      const dayName = days[d.getDay()];

      const match = sales.find((x) => x._id === key);

      result.push({
        name: dayName,
        sales: match ? match.total : 0,
      });
    }

    return NextResponse.json({ salesData: result });
  } catch (error) {
    console.log("SALES API ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch sales data" }, { status: 500 });
  }
}

