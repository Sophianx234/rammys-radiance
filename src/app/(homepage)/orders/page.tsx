"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import OrderCard from "@/components/order-card"
import { useEffect, useState } from "react"
import { GridLoader } from "react-spinners"
import Link from "next/link"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/orders/user");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fdfbf7] flex justify-center items-center">
        <GridLoader size={24} color="#5B7763" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fdfbf7]">
      <Header />
      
      {/* Page Header */}
      <section className="bg-secondary/20 border-b border-border/40 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h1 className="text-[22px] uppercase tracking-widest font-bold text-[#222222]">
            My Orders
          </h1>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {orders.length > 0 ? (
          <div className="flex flex-col">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-border/40 shadow-sm rounded-none">
            <p className="text-text-muted text-[13px] uppercase tracking-wider font-bold mb-6">You have placed no orders yet.</p>
            <Link 
              href="/shop" 
              className="inline-block bg-[#5B7763] text-white px-8 py-3 text-[11px] uppercase tracking-widest font-bold hover:bg-[#5B7763]/90 transition-colors rounded-none"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
