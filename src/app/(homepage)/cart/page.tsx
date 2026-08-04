"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDashStore } from "@/lib/store";
import { Ring2 } from 'ldrs/react'
import 'ldrs/react/Ring2.css'
import {GridLoader, RiseLoader} from 'react-spinners'

export default function CartPage() {
  const { cart, removeItem, updateQuantity, cartTotal, clearCart } =
    useDashStore();
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

    removeItem(productId); // Zustand update
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

    clearCart(); // Zustand update
  } catch (error) {
    console.error("Clear cart error:", error);
  }
};


if (!isLoaded) {
  return (
    <div className="h-dvh flex items-center justify-center">
      <GridLoader size={24} color="#ffaf9f" />
    </div>
  );
}

  const subtotal = cartTotal();
  const delivery = cart.length > 0 ? 500 : 0;
  const tax = Math.round(subtotal * 0.1);
  const finalTotal = subtotal + delivery + tax;

  return (
    <main>
      {/* Page Header */}
      <section className="bg-secondary border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold">
            Shopping Cart
          </h1>
        </div>
      </section>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag
              size={48}
              className="mx-auto text-muted-foreground mb-4"
            />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Start shopping to add items to your cart
            </p>
            <Link href="/shop">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h2 className="text-lg font-semibold">Items ({cart.length})</h2>
                <button
                  onClick={handleClearCart}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              {cart.map((item) => (
                <Card
                  key={item.id}
                  className="bg-card border-border p-4 flex gap-4"
                >
                  <div className="w-24 h-24 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-primary font-semibold mt-1">
                        ₵{item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="px-3 py-1 hover:bg-secondary transition-colors"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 border-l border-r border-border">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="px-3 py-1 hover:bg-secondary transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveCartItem(item._id)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      ₵{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-secondary border-border p-6 sticky top-20 space-y-4">
                <h2 className="text-xl font-semibold">Order Summary</h2>

                <div className="space-y-3 py-4 border-y border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₵{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">delivery</span>
                    <span>₵{delivery.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>₵{tax.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ₵{finalTotal.toLocaleString()}
                  </span>
                </div>

                <Link href="/checkout" className="block w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3">
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link href="/shop" className="block">
                  <Button variant="outline" className="w-full bg-transparent">
                    Continue Shopping
                  </Button>
                </Link>

                {/* Trust Badges */}
                <div className="space-y-2 pt-4 border-t border-border text-xs text-muted-foreground">
                  <p>✓ Secure checkout</p>
                  <p>✓ Free returns within 30 days</p>
                  <p>✓ Same-day dispatch</p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
