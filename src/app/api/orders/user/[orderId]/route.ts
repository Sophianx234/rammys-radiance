// app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { connectToDatabase } from "@/lib/connectDB";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectToDatabase();

    const { orderId } = await params;

    const order = await Order.findById(orderId)
      .populate("items.product", "name images price")
      .lean();

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // ------------ GENERATE ORDER TIMELINE ------------
    const statusStages = [
      { key: "processing", label: " Processing Order" },
      { key: "ready_for_pickup", label: "Ready for Pickup" },
      { key: "packed", label: "Order Packed" },
      { key: "ready_for_dispatch", label: "Ready For Dispatch" },
      { key: "dispatched", label: "Dispatched" },
      { key: "in_transit", label: "In Transit" },
      { key: "arrived", label: "Arrived at Pickup Facility" },
      { key: "delivery_attempted", label: "Delivery Attempted" },
      { key: "delivered", label: "Delivered" },
      { key: "cancelled", label: "Cancelled" },
    ];

    const timeline = statusStages.map((stage) => ({
      title: stage.label,
      status: stage.key === order.orderStatus ? "current" 
        : statusStages.findIndex((s) => s.key === order.orderStatus) >
          statusStages.findIndex((s) => s.key === stage.key)
        ? "completed"
        : "upcoming",
      date:
        stage.key === order.orderStatus
          ? order.updatedAt
          : undefined,
    }));

    // ------------ TRANSFORM ITEMS FOR UI ------------
    const items = order.items.map((item: any) => ({
      name: item.product?.name || "Unknown Product",
      quantity: item.quantity,
      price: item.price,
      image: item.product?.images?.[0] || null,
    }));

    // ------------ UI FRIENDLY ORDER FORMAT ------------
    const formatted = {
      id: order._id.toString(),
      orderNumber: order.paymentReference,
      total: order.totalAmount,
      createdAt: order.createdAt,
      status: order.orderStatus,
      timeline,
      items,
    };

    return NextResponse.json({ success: true, order: formatted });
  } catch (err) {
    console.error("ORDER API ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
