"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useDashStore } from "@/lib/store";
import { useState, useEffect } from "react";

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await fetch("/api/users/wishlist");
      if (res.ok) {
        const data = await res.json();
        setItems(data.wishlistProducts || []);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();

    const handleUpdate = () => fetchWishlist();
    window.addEventListener("wishlistUpdated", handleUpdate);
    return () => window.removeEventListener("wishlistUpdated", handleUpdate);
  }, []);

  const removeFromWishlist = async (productId: string) => {
    try {
      // Optimistic update
      setItems(items.filter((item) => item._id !== productId));
      
      const res = await fetch("/api/users/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        const data = await res.json();
        window.dispatchEvent(new CustomEvent("wishlistUpdated", { detail: data.wishlist }));
      } else {
        // Revert on failure
        fetchWishlist();
      }
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
      fetchWishlist();
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your wishlist...</p>
          </div>
        ) : items?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-card border border-border overflow-hidden flex flex-col group relative"
              >
                <div className="relative aspect-[4/5] bg-[#F8F9FA] overflow-hidden flex items-center justify-center">
                  <Image
                    src={item.images?.[0] || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="absolute top-3 right-3 z-30 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                <div className="p-4 flex flex-col flex-1 items-center text-center">
                  <h3 className="font-semibold text-sm mb-1 text-text-main group-hover:text-[#5B7763] transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs font-semibold mb-4 text-text-main">
                    ₵{(item.price || 0).toLocaleString()}
                  </p>
                  <Link href={`/product/${item.slug || item._id}`} className="mt-auto w-full">
                    <Button
                      variant="outline"
                      className="w-full text-xs h-9 uppercase tracking-widest border-border hover:bg-[#5B7763] hover:text-white transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 mr-2" />
                      View Product
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground mb-6">
              Add items to your wishlist to save them for later
            </p>
            <Link href="/shop">
              <Button className="bg-primary hover:bg-primary/90">
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
