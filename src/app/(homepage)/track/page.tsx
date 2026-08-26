"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Package, MapPin, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GridLoader } from "react-spinners";

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [reference, setReference] = useState(searchParams.get("reference") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (searchParams.get("reference") && searchParams.get("email")) {
      handleTrack(new Event('submit') as any);
    }
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference || !email) {
      setError("Please enter both Reference Number and Email Address.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track?reference=${reference}&email=${encodeURIComponent(email)}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setOrder(data.order);
      } else {
        setError(data.error || "Order not found. Please check your details.");
      }
    } catch (err) {
      setError("An error occurred while tracking your order.");
    } finally {
      setLoading(false);
    }
  };

  const statusMap: Record<string, { label: string; description: string; step: number }> = {
    "processing": { label: "Processing", description: "Your order is being prepared.", step: 1 },
    "packed": { label: "Packed", description: "Your items have been packed.", step: 2 },
    "ready_for_dispatch": { label: "Ready", description: "Awaiting pickup by courier.", step: 3 },
    "in_transit": { label: "In Transit", description: "Your order is on the way.", step: 4 },
    "delivered": { label: "Delivered", description: "Your order has arrived.", step: 5 },
  };

  const getStatusDisplay = (status: string) => {
    return statusMap[status] || { label: status.replace("_", " "), description: "Update pending", step: 1 };
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans pb-24">
      <section className="pt-24 pb-12 bg-white border-b border-border/40 text-center">
        <h1 className="text-3xl font-bold text-[#222222] tracking-tight mb-3">
          Track Your Order
        </h1>
        <p className="text-[13px] text-text-muted max-w-md mx-auto uppercase tracking-wider">
          Enter your order details below to see its current status.
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <form onSubmit={handleTrack} className="bg-white border border-border/40 p-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)] mb-12 flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-1">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Order Reference</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. ORD-12345"
              className="w-full bg-transparent border-b border-border/60 px-0 py-3 text-[14px] text-[#222222] focus:outline-none focus:border-[#5B7763] transition-colors"
              required
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="The email used at checkout"
              className="w-full bg-transparent border-b border-border/60 px-0 py-3 text-[14px] text-[#222222] focus:outline-none focus:border-[#5B7763] transition-colors"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="h-[45px] px-8 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#5B7763] transition-colors disabled:opacity-50"
            >
              {loading ? "SEARCHING..." : "TRACK"}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 text-center mb-12">
            <p className="text-red-500 text-[13px] font-medium">{error}</p>
          </div>
        )}

        {loading && !order && (
          <div className="flex justify-center py-12">
            <GridLoader size={18} color="#5B7763" />
          </div>
        )}

        {order && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white border border-border/40 p-8 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">Current Status</p>
                <h2 className="text-2xl font-bold text-[#5B7763] uppercase">
                  {getStatusDisplay(order.orderStatus).label}
                </h2>
                <p className="text-[13px] text-text-muted mt-1">{getStatusDisplay(order.orderStatus).description}</p>
              </div>
              <div className="hidden sm:flex flex-col items-end text-right">
                <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">Order Placed</p>
                <p className="text-[14px] font-medium text-[#222222]">
                  {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-border/40 p-8 space-y-6">
                <h3 className="text-[11px] font-bold text-[#222222] uppercase tracking-wider flex items-center gap-2 border-b border-border/40 pb-3">
                  <Package className="w-4 h-4 text-[#5B7763]" /> Order Items
                </h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                  {order.items?.map((item: any) => (
                    <div key={item._id} className="flex gap-4">
                      <div className="relative w-16 h-20 bg-secondary/30 shrink-0 border border-border/40">
                        {item.product?.images?.[0] ? (
                          <Image src={item.product.images[0]} alt="product" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-text-muted uppercase">No Img</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-bold text-[#222222]">{item.product?.name || "Product"}</p>
                        <p className="text-[11px] text-text-muted tracking-wider mt-1">QTY: {item.quantity}</p>
                        <p className="text-[12px] font-bold text-[#5B7763] mt-1">₵{item.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-border/40 flex justify-between">
                   <span className="text-[12px] font-bold uppercase tracking-wider text-[#222222]">Total</span>
                   <span className="text-[16px] font-bold text-[#222222]">₵{order.totalAmount?.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-white border border-border/40 p-8 space-y-6 h-fit">
                <h3 className="text-[11px] font-bold text-[#222222] uppercase tracking-wider flex items-center gap-2 border-b border-border/40 pb-3">
                  <MapPin className="w-4 h-4 text-[#5B7763]" /> Delivery Info
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted">Customer</p>
                    <p className="text-[13px] font-medium text-[#222222] mt-1">{order.customer?.name || "Guest"}</p>
                    <p className="text-[12px] text-text-muted">{order.customer?.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted">Address</p>
                    <p className="text-[13px] font-medium text-[#222222] mt-1">{order.deliveryAddress?.address}</p>
                    <p className="text-[12px] text-text-muted">{order.deliveryAddress?.city}, {order.deliveryAddress?.region}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
