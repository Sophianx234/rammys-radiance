"use client";
import { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { useDashStore } from "@/lib/store";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useDashStore();
  const router = useRouter();
  
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/users/wishlist");
        if (res.ok) {
          const data = await res.json();
          setIsFavorite(data.wishlist.some((id: any) => id.toString() === product._id.toString()));
        }
      } catch (err) {}
    };

    if (user) fetchStatus();

    const handleWishlistChange = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setIsFavorite(e.detail.some((id: any) => id.toString() === product._id.toString()));
      } else {
        fetchStatus();
      }
    };
    
    window.addEventListener("wishlistUpdated", handleWishlistChange);
    window.addEventListener("wishlistFetched", handleWishlistChange);
    
    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistChange);
      window.removeEventListener("wishlistFetched", handleWishlistChange);
    };
  }, [product._id, user]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    // Optimistic UI update
    setIsFavorite(!isFavorite);

    try {
      const res = await fetch("/api/users/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });

      if (!res.ok) {
        // Revert on failure
        console.error("Wishlist API failed:", res.status, await res.text());
        setIsFavorite(isFavorite);
        return;
      }
      
      const data = await res.json();
      setIsFavorite(data.isFavorite);
      
      // Notify header and others to refetch from server
      window.dispatchEvent(new CustomEvent("wishlistUpdated", { detail: data.wishlist }));
      
    } catch (err) {
      console.error("Wishlist failed:", err);
      // Revert on failure
      setIsFavorite(isFavorite);
    }
  };

  const priceDisplay = `₵${(product.price).toLocaleString()}`;
  const discountPriceDisplay = product.discountPrice ? `₵${(product.discountPrice).toLocaleString()}` : undefined;

  return (
    <div className="group flex flex-col w-full relative">
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-[#F8F9FA] mb-5 overflow-hidden flex items-center justify-center">
        {product.discountBadge && (
          <div className="absolute top-3 left-3 z-20 bg-[#5B7763] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
            {product.discountBadge}
          </div>
        )}
        
        {/* Wishlist Button - Not wrapped by Link to prevent navigation cancellation */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 z-30 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white transition-colors"
        >
          <Heart
            size={16}
            className={`transition-colors ${isFavorite ? "fill-[#5B7763] text-[#5B7763]" : "text-gray-500 hover:text-[#5B7763]"}`}
          />
        </button>

        <Link href={`/product/${product.slug || product._id}`} className="absolute inset-0 z-10 w-full h-full cursor-pointer">
          <div className="relative w-full h-full transition-transform duration-700">
            <Image
              src={product.images?.[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>
        </Link>
      </div>

      {/* Details - Wrapped in its own Link */}
      <Link href={`/product/${product.slug || product._id}`} className="flex flex-col items-center text-center space-y-1.5 cursor-pointer z-10 block">
        <div className="flex items-center justify-center space-x-1.5 text-xs font-semibold text-text-main">
          {discountPriceDisplay ? (
            <>
              <span className="line-through text-text-muted font-normal">{priceDisplay}</span>
              <span>{discountPriceDisplay}</span>
            </>
          ) : (
            <span>{priceDisplay}</span>
          )}
        </div>
        
        <div className="text-sm font-semibold text-text-main group-hover:text-[#5B7763] transition-colors">
          {product.name}
        </div>
        
        {/* Stars */}
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? "text-[#5B7763]" : "text-gray-200"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-[10px] text-text-muted ml-1 font-medium">({product.reviewsCount || 0})</span>
        </div>

        {/* Stock Quantity */}
        <div className="text-[11px] font-bold tracking-wider  mt-1">
          {product.stock > 0 ? (
            <span className="text-[#5B7763]">{product.stock} in stock</span>
          ) : (
            <span className="text-red-500">Out of stock</span>
          )}
        </div>
      </Link>
    </div>
  );
}
