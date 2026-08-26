import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { Order } from "@/models/Order";
import "@/models/Product"; // Ensure product is registered

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");
    const email = searchParams.get("email");

    if (!reference || !email) {
      return NextResponse.json(
        { success: false, error: "Reference number and email are required." },
        { status: 400 }
      );
    }

    // Find the order that matches BOTH the reference and the exact email
    const order = await Order.findOne({
      paymentReference: reference,
      $or: [
        { "customer.email": email.toLowerCase() },
      ]
    }).populate("items.product");

    if (!order) {
      return NextResponse.json(
        { success: false, error: "No matching order found for this email and reference number." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Tracking error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while tracking the order." },
      { status: 500 }
    );
  }
}
