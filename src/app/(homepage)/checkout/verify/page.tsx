"use client"
import { useDashStore } from "@/lib/store";
import { CheckCircle2, Package, MapPin, CalendarClock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GridLoader } from "react-spinners";

export default function VerifyPage() {
  const { user, clearCart } = useDashStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlReference = urlParams.get("reference");
      const urlTotal = urlParams.get("totalAmount");
      const urlItems = urlParams.get("items");
      
      const pendingOrder = localStorage.getItem("pendingOrder");

      if (!pendingOrder && !urlReference) {
        setIsProcessing(false);
        setError("No pending order found. Please return to checkout.");
        return;
      }

      if (pendingOrder) {
        const orderData = JSON.parse(pendingOrder as string);
        try {
          const verifyResponse = await fetch(`/api/paystack/verify?reference=${orderData.reference}`);
          const verifyData = await verifyResponse.json();

          if (verifyResponse.ok && verifyData.status === "success") {
            const order = await fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(orderData),
            });
            if (order.ok) {
              const result = await order.json();
              setOrderNumber(result?.order?.paymentReference || orderData.reference);
              setPlacedOrder(result.order);
            }

            clearCart();
            localStorage.removeItem("pendingOrder");
          } else {
            setError("Payment verification failed. Please contact support.");
          }
        } catch (e) {
          setError("An error occurred during verification.");
        } finally {
          setIsProcessing(false);
        }
      } else if (urlReference) {
        // Page was refreshed. Try to just verify Paystack transaction again to confirm,
        // and reconstruct the display from URL params
        try {
          const verifyResponse = await fetch(`/api/paystack/verify?reference=${urlReference}`);
          const verifyData = await verifyResponse.json();

          if (verifyResponse.ok && verifyData.status === "success") {
             setOrderNumber(urlReference);
             setPlacedOrder({
               items: Array.from({ length: Number(urlItems) || 1 }),
               totalAmount: Number(urlTotal) || verifyData.data?.amount / 100 || 0
             });
          } else {
            setError("Payment verification failed. Please contact support.");
          }
        } catch (e) {
          setError("An error occurred during verification.");
        } finally {
          setIsProcessing(false);
        }
      }
    };

    verifyPayment();
  }, []);

  const getNextFriday = () => {
    const date = new Date();
    const day = date.getDay();
    const daysUntilFriday = (5 + 7 - day) % 7;
    const offset = daysUntilFriday === 0 ? 7 : daysUntilFriday;
    date.setDate(date.getDate() + offset);
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (isProcessing) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center font-sans pb-24">
        <GridLoader size={18} color="#5B7763" />
        <h2 className="mt-8 text-[13px] font-bold uppercase tracking-[0.2em] text-[#222222]">
          Verifying Secure Payment
        </h2>
        <p className="mt-2 text-[11px] uppercase tracking-wider text-text-muted">
          Please do not close this window
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center font-sans pb-24 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <span className="text-red-500 text-2xl">!</span>
        </div>
        <h2 className="text-2xl font-medium text-[#222222] mb-3">Verification Error</h2>
        <p className="text-[13px] text-text-muted mb-8 max-w-md">{error}</p>
        <Link href="/checkout" className="bg-black text-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#5B7763] transition-colors">
          Return to Checkout
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans pb-24">
      <section className="pt-20 pb-16 text-center border-b border-border/40 bg-white">
        <div className="flex justify-center mb-6">
          <CheckCircle2 strokeWidth={1} className="w-16 h-16 text-[#5B7763]" />
        </div>
        <h1 className="text-3xl md:text-5xl font-sans font-medium text-[#222222] tracking-tight mb-4">
          ORDER CONFIRMED
        </h1>
        <p className="text-[13px] text-text-muted max-w-xl mx-auto px-4 uppercase tracking-[0.2em] font-medium">
          Thank you for your purchase
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white border border-border/40 p-8 lg:p-12 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)] relative overflow-hidden">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-zinc-50 to-transparent pointer-events-none" />

          <div className="mb-10 text-center">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em] mb-2">
              Reference Number
            </p>
            <p className="font-mono text-xl tracking-wider text-[#222222] bg-zinc-50 py-3 px-6 inline-block border border-border/40">
              {orderNumber}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-b border-border/40 py-8 mb-10">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Package className="w-4 h-4 text-[#5B7763] mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold text-[#222222] uppercase tracking-wider mb-1">Order Details</p>
                  <p className="text-[13px] text-text-muted">{placedOrder?.items?.length || 0} items</p>
                  <p className="text-[13px] text-[#222222] font-medium mt-1">₵{placedOrder?.totalAmount?.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#5B7763] mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold text-[#222222] uppercase tracking-wider mb-1">Customer</p>
                  <p className="text-[13px] text-text-muted">{user?.email}</p>
                  <p className="text-[13px] text-text-muted">{user?.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Notice */}
          <div className="bg-zinc-50 border border-[#5B7763]/20 p-6 flex items-start gap-4 mb-10">
            <div className="w-10 h-10 bg-white flex items-center justify-center shrink-0 shadow-sm border border-border/40">
              <CalendarClock strokeWidth={1.5} className="w-5 h-5 text-[#5B7763]" />
            </div>
            <div>
              <h3 className="text-[12px] font-bold text-[#222222] uppercase tracking-widest mb-1">
                Scheduled Delivery
              </h3>
              <p className="text-[13px] text-text-muted leading-relaxed">
                As part of our premium fulfillment service, all orders are carefully dispatched exclusively on Fridays. Your items will be delivered on <strong className="text-[#222222] font-medium">{getNextFriday()}</strong>.
              </p>
            </div>
          </div>

          <div className="text-center space-y-6">
            <p className="text-[12px] text-text-muted">
              A detailed confirmation email has been sent to your inbox.
            </p>
            <Link 
              href="/orders" 
              className="inline-flex items-center justify-center bg-black text-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#5B7763] transition-colors w-full sm:w-auto"
            >
              Track Your Order
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
