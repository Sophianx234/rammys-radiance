export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";

export async function GET() {
  try {
    await connectToDatabase();

    // Aggregation: count how many times a product appears in orders
    const bestSellers = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },       // highest sold first
      { $limit: 8 },                      // send top 8
    ]);

    // Extract product IDs
    const productIds = bestSellers.map((item) => item._id);

    // Fetch full product details in correct order
    const products = await Product.find({ _id: { $in: productIds } })
      .lean();

    // Map aggregation result to include totalSold
    const orderedProducts = productIds.map((id) =>
      products.find((p) => p._id.toString() === id.toString())
    );

    return NextResponse.json({
      success: true,
      data: orderedProducts,
    });
  } catch (error) {
    console.log("BESTSELLER ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch best sellers" },
      { status: 500 }
    );
  }
}

