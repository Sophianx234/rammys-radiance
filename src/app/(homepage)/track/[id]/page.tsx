'use server'
import Header from "@/components/header";
import Footer from "@/components/footer";
import TrackOrderCard from "@/components/track-order-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";



export default async function TrackOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/user/${id}`, {
    cache: "no-store",
  });

  const data = await res.json();
  console.log("Fetched order:", data);
  const order = data.order;
  console.log("Order timeline details:", );
  // Filter timeline events
const filteredTimeline = order.timeline.filter(
  (event) => !(event.title.toLowerCase() === "cancelled" && event.status === "upcoming")
);


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
