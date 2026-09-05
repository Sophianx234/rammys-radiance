export const dynamic = "force-dynamic";
// app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Order } from "@/models/Order";
import { connectToDatabase } from "@/lib/connectDB";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  try {
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

