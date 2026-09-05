export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { Product } from "@/models/Product";

export async function GET() {
  try {
    await connectToDatabase();

    // Find products low in stock
    const lowStock = await Product.find({
      stock: { $lte: 10 },
    })
      .select("name price images stock")
      .sort({ stock: 1 })
      .limit(10);

    return NextResponse.json({ stockAlerts: lowStock });
  } catch (error) {
    console.log("STOCK ALERT ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch stock alerts" }, { status: 500 });
  }
}

