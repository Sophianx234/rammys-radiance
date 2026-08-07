"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, ListFilter, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AdminProductsFilter({ categories }: { categories: any[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const sortBy = searchParams.get("sortBy") || "latest";

  const updateURL = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all") params.set(key, value);
      else params.delete(key);
    });
    // Reset page on filter
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-white border border-border/40 p-5">
      <div className="flex flex-col lg:flex-row items-center gap-4 w-full">
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" strokeWidth={1.5} />
          <Input
            type="text"
            placeholder="Search by product name, SKU, or description..."
            value={search}
            onChange={(e) => updateURL({ search: e.target.value })}
            className="w-full bg-secondary/20 border-border/40 text-[12px] pl-9 h-10 placeholder:text-text-muted text-[#222222] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] transition-colors"
          />
        </div>

        <Select onValueChange={(val) => updateURL({ category: val })} value={selectedCategory}>
          <SelectTrigger className="w-full lg:w-[220px] bg-secondary/20 border-border/40 text-[12px] text-[#222222] h-10 rounded-none focus:ring-0 focus:border-[#5B7763]">
            <div className="flex items-center gap-2 text-text-muted">
              <ListFilter className="w-3.5 h-3.5" strokeWidth={1.5} />
              <SelectValue placeholder="All Categories" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-none border-border/40">
            <SelectItem value="all" className="text-[12px]">All Categories</SelectItem>
            {categories.map((cat: any) => (
              <SelectItem key={cat._id} value={cat.slug} className="text-[12px]">
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => updateURL({ sortBy: val })} value={sortBy}>
          <SelectTrigger className="w-full lg:w-[200px] bg-secondary/20 border-border/40 text-[12px] text-[#222222] h-10 rounded-none focus:ring-0 focus:border-[#5B7763]">
            <div className="flex items-center gap-2 text-text-muted">
              <ChevronDown className="w-3.5 h-3.5" strokeWidth={1.5} />
              <SelectValue placeholder="Sort By" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-none border-border/40">
            <SelectItem value="latest" className="text-[12px]">Latest</SelectItem>
            <SelectItem value="price-asc" className="text-[12px]">Price: Low to High</SelectItem>
            <SelectItem value="price-desc" className="text-[12px]">Price: High to Low</SelectItem>
            <SelectItem value="best-selling" className="text-[12px]">Best Selling</SelectItem>
            <SelectItem value="top-rated" className="text-[12px]">Top Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
