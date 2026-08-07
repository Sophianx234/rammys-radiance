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
    let timeline: any[] = [];
    
    if (order.orderStatus === "cancelled") {
      timeline = [
        { 
          title: "Order Placed", 
          iconKey: "processing",
          description: "Order received securely.", 
          status: "completed", 
          date: order.createdAt 
        },
        { 
          title: "Cancelled", 
          iconKey: "cancelled",
          description: "This order has been cancelled.", 
          status: "current", 
          date: order.updatedAt 
        }
      ];
    } else {
      const baseStages = [
        { key: "processing", label: "Processing Order", description: "We have received your order and are preparing it for our Friday fulfillment." },
        { key: "in_transit", label: "In Transit", description: "Your order has been securely dispatched and is currently on its way." },
        { key: "arrived", label: "Arrived at Hub", description: "Your package has arrived at our final delivery facility." },
        { key: "delivered", label: "Delivered", description: "Your package has been successfully delivered." },
      ];

      timeline = baseStages.map((stage) => {
        const isCurrent = stage.key === order.orderStatus;
        const stageIndex = baseStages.findIndex(s => s.key === stage.key);
        const currentIndex = baseStages.findIndex(s => s.key === order.orderStatus);
        
        const status = isCurrent ? "current" : (currentIndex > stageIndex ? "completed" : "upcoming");
        
        return {
          title: stage.label,
          iconKey: stage.key,
          status: status,
          description: stage.description,
          date: (status === "completed" || status === "current") ? order.updatedAt : undefined,
        };
      });
    }

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
