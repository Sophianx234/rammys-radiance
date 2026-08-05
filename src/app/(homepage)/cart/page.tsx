"use client";

import { ShoppingBag, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDashStore } from "@/lib/store";
import { GridLoader } from 'react-spinners';
import Image from "next/image";
import { ProductCard } from "@/components/product-card";

export default function CartPage() {
  const { cart, removeItem, updateQuantity, cartTotal, clearCart } =
    useDashStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);

  useEffect(() => {
    setIsLoaded(true);
    
    const fetchSuggested = async () => {
      try {
        const res = await fetch("/api/products?limit=4&sortBy=rating");
        if (res.ok) {
          const data = await res.json();
          setSuggestedProducts(data.products || data || []);
        }
      } catch (err) {
        console.error("Failed to fetch suggested products", err);
      }
    };
    
    fetchSuggested();
  }, []);

  const handleRemoveCartItem = async (productId: string) => {
    try {
      const res = await fetch(`/api/cart/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to remove item");
        return;
      }

      removeItem(productId);
    } catch (error) {
      console.error("Remove cart error:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      const res = await fetch("/api/cart/clear", {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to clear cart");
        return;
      }

      clearCart();
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-dvh flex items-center justify-center bg-[#F9F9F9]">
        <GridLoader size={18} color="#5B7763" />
      </div>
    );
  }

  const subtotal = cartTotal();
  const delivery = cart.length > 0 ? 50 : 0; 
  const finalTotal = subtotal + delivery;

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans pb-24">
      {/* Page Header */}
      <section className="pt-6 pb-12">
        {/* <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-sans font-bold text-[#222222]  tracking-wide">
            YOUR BAG
          </h1>
          {cart.length > 0 && (
            <p className=" text-text-muted mt-3 text-[13px] tracking-[0.2em] uppercase">
              {cart.reduce((acc, item: any) => acc + (item.quantity || 1), 0)} ITEMS
            </p>
          )}
        </div> */}
      </section>

      {/* Cart Content */}
      <div className="max-w-6xl mx-auto px-6">
        {cart.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center border-t border-border/40">
            <ShoppingBag
              size={42}
              strokeWidth={1}
              className="text-[#5B7763] mb-6"
            />
            <h2 className="text-xl font-sans font-semibold text-[#222222] mb-3">Your bag is empty</h2>
            <p className="text-text-muted text-[14px] mb-8 max-w-md">
              Discover our latest collections and find your new glowing essentials.
            </p>
            <Link 
              href="/shop"
              className="bg-[#5B7763] text-white text-[12px] font-bold uppercase tracking-[0.2em] px-10 py-4 hover:bg-black transition-colors duration-300"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-border/50">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em]">Product</span>
                <button
                  onClick={handleClearCart}
                  className="text-[11px] font-bold text-[#5B7763] hover:text-[#5B7763]/80 uppercase tracking-[0.15em] transition-colors"
                >
                  Clear Bag
                </button>
              </div>

              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-6 pb-6 border-b border-border/40 relative group"
                  >
                    {/* Product Image */}
                    <Link href={`/shop/${item._id}`} className="w-[100px] h-[120px] bg-secondary/30 relative overflow-hidden shrink-0 group-hover:opacity-90 transition-opacity">
                      <Image
                        src={item.images[0] || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start">
                        <div className="pr-4">
                          <h3 className="text-[14px] font-sans font-semibold text-[#222222] hover:text-[#5B7763] transition-colors">
                            <Link href={`/shop/${item._id}`}>{item.name}</Link>
                          </h3>
                          <p className="text-[13px] text-text-muted mt-1 font-medium">₵{item.price.toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveCartItem(item._id)}
                          className="text-text-muted hover:text-red-500 transition-colors p-1"
                        >
                          <X size={16} strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="flex items-end justify-between mt-4">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-border/60">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-text-muted hover:bg-[#5B7763] hover:text-white transition-colors"
                          >
                            −
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center text-[13px] font-medium text-[#222222]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, Math.min(item.stock || 1, item.quantity + 1))}
                            disabled={item.quantity >= (item.stock || 1)}
                            className="w-8 h-8 flex items-center justify-center text-text-muted hover:bg-[#5B7763] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-muted"
                          >
                            +
                          </button>
                        </div>
                        
                        {/* Subtotal */}
                        <p className="text-[14px] font-semibold text-[#222222]">
                          ₵{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-border/40 p-8 sticky top-28 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
                <h2 className="text-[13px] font-bold text-[#222222] uppercase tracking-[0.15em] mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 pb-6 border-b border-border/50">
                  <div className="flex justify-between text-[14px]">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-medium text-[#222222]">₵{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-text-muted">Estimated Delivery</span>
                    <span className="font-medium text-[#222222]">{delivery === 0 ? "Free" : `₵${delivery.toLocaleString()}`}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-6">
                  <span className="text-[14px] font-bold text-[#222222] uppercase tracking-wider">Total</span>
                  <span className="text-xl font-sans font-bold text-[#5B7763]">
                    ₵{finalTotal.toLocaleString()}
                  </span>
                </div>

                <Link href="/checkout" className="block w-full">
                  <button className="w-full bg-[#5B7763] text-white text-[12px] font-bold uppercase tracking-[0.2em] py-4 flex items-center justify-center gap-2 hover:bg-black transition-colors duration-300">
                    Checkout <ArrowRight size={14} />
                  </button>
                </Link>

                {/* Trust Badges */}
                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3 text-text-muted">
                    <div className="w-1 h-1 bg-[#5B7763] rounded-full" />
                    <p className="text-[12px]">Complimentary shipping on orders over ₵500</p>
                  </div>
                  <div className="flex items-center gap-3 text-text-muted">
                    <div className="w-1 h-1 bg-[#5B7763] rounded-full" />
                    <p className="text-[12px]">Secure checkout with Paystack</p>
                  </div>
                  <div className="flex items-center gap-3 text-text-muted">
                    <div className="w-1 h-1 bg-[#5B7763] rounded-full" />
                    <p className="text-[12px]">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Products */}
      {suggestedProducts && suggestedProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 mt-32 border-t border-border/40 pt-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-medium tracking-tight">You May Also Like</h2>
            <Link href="/shop" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5B7763] hover:text-black transition-colors flex items-center gap-2">
              Continue Shopping <span className="text-lg leading-none">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {suggestedProducts.map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
