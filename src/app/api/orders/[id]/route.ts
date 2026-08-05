import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { Order } from "@/models/Order";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const deleted = await Order.findOneAndDelete({
      paymentReference: id,
    });

    if (!deleted)
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, deleted });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
