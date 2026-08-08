'use server'
import Header from "@/components/header";
import Footer from "@/components/footer";
import TrackOrderCard from "@/components/track-order-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";



import { Order } from "@/models/Order";
import { connectToDatabase } from "@/lib/connectDB";

export default async function TrackOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let orderData = null;

  try {
    await connectToDatabase();
    const order = await Order.findById(id).populate("items.product", "name images price").lean();

    if (order) {
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

      const items = order.items.map((item: any) => ({
        name: item.product?.name || "Unknown Product",
        quantity: item.quantity,
        price: item.price,
        image: item.product?.images?.[0] || null,
      }));

      orderData = {
        id: order._id.toString(),
        orderNumber: order.paymentReference,
        total: order.totalAmount,
        createdAt: order.createdAt,
        status: order.orderStatus,
        timeline,
        items,
      };
    }
  } catch (e) {
    console.error("Failed to fetch order", e);
  }

  const order = orderData;

  const filteredTimeline = order ? order.timeline.filter(
    (event: any) => !(event.title.toLowerCase() === "cancelled" && event.status === "upcoming")
  ) : [];


  if (!order) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-medium text-[#222222] mb-3 uppercase tracking-widest">Order Not Found</h1>
        <p className="text-[13px] text-text-muted mb-8 max-w-md text-center">
          We couldn't find the order you're looking for.
        </p>
        <Link 
          href="/orders" 
          className="bg-black text-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#5B7763] transition-colors"
        >
          View All Orders
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans pb-24">
      

      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/orders"
          className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em] hover:text-[#5B7763] transition-colors inline-flex items-center gap-2 mb-8"
        >
          <span>←</span> Back to Orders
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Timeline Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white border border-border/40 p-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)]">
              <h2 className="text-[13px] font-bold text-[#222222] uppercase tracking-[0.15em] mb-8 pb-4 border-b border-border/50">
                Tracking History
              </h2>
              <div className="space-y-2">
                {filteredTimeline.map((event: any, index: number) => (
                  <TrackOrderCard
                    key={index}
                    {...event}
                    nextStatus={filteredTimeline[index + 1]?.status || null}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white border border-border/40 p-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)]">
              <h2 className="text-[13px] font-bold text-[#222222] uppercase tracking-[0.15em] mb-6 pb-4 border-b border-border/50">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-border/50">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-start justify-between">
                    <div>
                      <p className="text-[13px] font-bold text-[#222222] leading-snug">{item.name}</p>
                      <p className="text-[12px] text-text-muted mt-1 uppercase tracking-wider">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[13px] font-bold text-[#5B7763]">
                      ₵{(item.price).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em]">Total Amount</span>
                <span className="text-lg font-bold text-[#222222]">₵{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
