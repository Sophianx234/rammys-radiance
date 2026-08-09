"use client";

import { ShoppingBag, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDashStore } from "@/lib/store";
import { GridLoader } from 'react-spinners';
import Image from "next/image";
import { ProductCard } from "@/components/product-card";

export function CartClient({ suggestedProducts }: { suggestedProducts: any[] }) {
  const { cart, removeItem, updateQuantity, cartTotal, clearCart, user } = useDashStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
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
    <>
      {/* Page Header */}
      <section className="pt-6 pb-12">
      </section>

      {/* Cart Content */}
      <div className="max-w-6xl mx-auto px-6">
        {cart.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center border-t border-border/40">
            <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8 text-text-muted" strokeWidth={1} />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#222222] mb-3 uppercase tracking-wider">
              Your bag is empty
            </h2>
            <p className="text-text-muted mb-8 text-[14px]">
              Discover our latest skincare and makeup essentials.
            </p>
            <Link
              href="/shop"
              className="bg-black text-white px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-colors inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left: Cart Items */}
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between pb-4 border-b border-black mb-6">
                <h2 className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#222222]">
                  Products ({cart.reduce((acc, item: any) => acc + (item.quantity || 1), 0)})
                </h2>
                <button
                  onClick={handleClearCart}
                  className="text-[11px] font-bold uppercase tracking-widest text-text-muted hover:text-black transition-colors"
                >
                  Clear Bag
                </button>
              </div>

              <div className="space-y-6">
                {cart.map((item: any) => (
                  <div
                    key={item._id}
                    className="flex gap-6 py-6 border-b border-border/40 relative group"
                  >
                    <Link href={`/product/${item.slug || item._id}`} className="shrink-0">
                      <div className="relative w-24 md:w-32 aspect-[4/5] bg-secondary/30">
                        <Image
                          src={item.images?.[0] || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>

                    <div className="flex flex-col flex-grow justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={`/product/${item.slug || item._id}`}>
                            <h3 className="text-[14px] md:text-base font-bold text-[#222222] mb-1 group-hover:text-[#5B7763] transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          {item.category?.name && (
                            <p className="text-[11px] uppercase tracking-wider text-text-muted">
                              {item.category.name}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveCartItem(item._id)}
                          className="p-2 text-text-muted hover:text-red-500 transition-colors bg-secondary/20 hover:bg-red-50 rounded-full"
                          aria-label="Remove item"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="flex items-end justify-between mt-6">
                        <div className="flex items-center border border-border/60">
                          <button
                            className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-black hover:bg-secondary/20 transition-colors"
                            onClick={() =>
                              updateQuantity(
                                item._id,
                                Math.max(1, (item.quantity || 1) - 1)
                              )
                            }
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-[13px] font-medium text-[#222222]">
                            {item.quantity || 1}
                          </span>
                          <button
                            className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-black hover:bg-secondary/20 transition-colors"
                            onClick={() =>
                              updateQuantity(
                                item._id,
                                Math.min(
                                  item.stock || 10,
                                  (item.quantity || 1) + 1
                                )
                              )
                            }
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-[15px] font-bold text-[#222222]">
                            ₵{(item.price * (item.quantity || 1)).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-secondary/10 p-8 border border-border/40 sticky top-28">
                <h2 className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#222222] mb-6 pb-4 border-b border-border/60">
                  Order Summary
                </h2>
                
                <div className="space-y-4 mb-6 text-[14px]">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-medium text-[#222222]">₵{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Estimated Delivery</span>
                    <span className="font-medium text-[#222222]">₵{delivery.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-5 border-t border-border/60 mb-8">
                  <span className="text-[14px] font-bold uppercase tracking-wider text-[#222222]">Total</span>
                  <span className="text-xl font-bold text-[#222222]">₵{finalTotal.toLocaleString()}</span>
                </div>

                <Link
                  href={user ? "/checkout" : `/login?redirect=/checkout&cart=${encodeURIComponent(JSON.stringify(cart.map(item => ({ productId: item._id, quantity: item.quantity }))))}`}
                  className="w-full flex items-center justify-center gap-3 bg-[#222222] text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em]  transition-colors"
                >
                  Checkout <ArrowRight size={16} />
                </Link>
                
                <div className="mt-6 text-center space-y-4">
                  <p className="text-[11px] text-text-muted uppercase tracking-wider">
                    Secure Checkout Guarantee
                  </p>
                  <p className="text-xs text-text-muted leading-relaxed">
                    By proceeding to checkout, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Products */}
      {suggestedProducts && suggestedProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 mt-16 border-t border-border/40 pt-20">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#222222] mb-2 tracking-tight">
                Complete Your Routine
              </h2>
              <p className="text-text-muted text-sm md:text-base">
                Pairs perfectly with your current selection
              </p>
            </div>
            <Link 
              href="/shop" 
              className="hidden md:inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#222222] hover:text-[#5B7763] transition-colors border-b border-[#222222] hover:border-[#5B7763] pb-1"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {suggestedProducts.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link 
              href="/shop" 
              className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#222222] hover:text-[#5B7763] transition-colors border-b border-[#222222] pb-1"
            >
              View All Products
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
