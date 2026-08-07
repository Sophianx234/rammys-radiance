"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

export function ShopSort() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const sortBy = searchParams.get("sortBy") || "featured";

  const updateURL = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", sortValue);
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative group">
      <select
        value={sortBy}
        onChange={(e) => updateURL(e.target.value)}
        className="appearance-none bg-transparent border-none text-[11px] font-bold uppercase tracking-[0.15em] text-[#222222] pr-6 cursor-pointer focus:outline-none"
      >
        <option value="featured">Sort by: Featured</option>
        <option value="price-low">Sort by: Price (Low to High)</option>
        <option value="price-high">Sort by: Price (High to Low)</option>
        <option value="rating">Sort by: Top Rated</option>
        <option value="newest">Sort by: New Arrivals</option>
      </select>
      <ChevronDown
        size={14}
        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted group-hover:text-black transition-colors"
      />
    </div>
  );
}
