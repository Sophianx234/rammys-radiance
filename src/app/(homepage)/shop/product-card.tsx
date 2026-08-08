// components/ProductCard.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star, MessageCircle } from "lucide-react"; // added icons
import Link from "next/link";
import { useDashStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { IProduct } from "@/models/Product";
import { Badge } from "@/components/ui/badge";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: {
    name: string;
    slug: string;
  };
  rating: number;
  reviewsCount: number;
  images: string[];
}

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useDashStore();
  const [isFavorite, setIsFavorite] = useState(
    user?.wishlist?.some((id: string) => id.toString() === product._id) ?? false
  );
  const router = useRouter();

  console.log('product card rendered', product.isFeatured);
  
  const toggleFavorite = async (id: string) => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    setIsFavorite((!isFavorite));
    try {
      const res = await fetch("/api/users/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });

      if (!res.ok) return;

      const data = await res.json();
      setIsFavorite(data.isFavorite);
    } catch (err) {
      console.error("Wishlist failed:", err);
    }
  };

  return (
    <div
      key={product._id}
      className="bg-card border border-border rounded-md overflow-hidden transition-all group hover:border-primary"
    >
      <div className="relative overflow-hidden bg-secondary h-64">
        {product.isFeatured&&<Badge className="absolute z-20 top-3 left-3 bg-primary text-black text-xs px-3 py-1 shadow-md">
                <Star className="w-3 h-3 mr-1 " /> Featured
              </Badge>}
        <img
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={() => toggleFavorite(product._id)}
          className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur rounded-full hover:bg-background transition-colors"
        >
          <Heart
            size={18}
            className={isFavorite ? "fill-primary text-primary" : ""}
          />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {product.category.name}
        </p>
        <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>

        {/* Rating & Reviews with Icons */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1 text-primary font-semibold">
            <Star size={14} />
            {product.rating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MessageCircle size={14} />
            {product.reviewsCount}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-primary font-semibold">
            ₵{product.price.toLocaleString()}
          </span>
          <Link href={`/product/${product._id}`}>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              View
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
