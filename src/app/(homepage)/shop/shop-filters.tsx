"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

export function ShopFilters({ categories }: { categories: any[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  const selectedCategory = searchParams.get("category");
  const priceRange = searchParams.get("priceRange");
  const searchQuery = searchParams.get("search");

  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handlePriceFilter = (range: string) => {
    updateURL({ priceRange: range === priceRange ? null : range, page: "1" });
  };

  const clearFilters = () => {
    updateURL({ category: null, priceRange: null, search: null, sortBy: null, page: "1" });
  };

  return (
    <aside className="lg:w-[240px] shrink-0">
      <div className="sticky top-28 space-y-12">
        {/* Search */}
        <div>
          <h3 className="text-[11px] font-bold text-[#222222] uppercase tracking-[0.2em] mb-4 pb-4 border-b border-border/40">
            Search
          </h3>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const search = formData.get("search") as string;
              if (search.trim()) {
                updateURL({ search: search.trim(), page: "1" });
              } else {
                updateURL({ search: null, page: "1" });
              }
            }}
            className="flex items-center border border-border/60 focus-within:border-black transition-colors rounded-none bg-white"
          >
            <input
              type="text"
              name="search"
              defaultValue={searchQuery || ""}
              placeholder="Search products..."
              className="w-full bg-transparent px-3 py-2.5 text-[13px] outline-none"
            />
            <button type="submit" className="px-3 text-text-muted hover:text-black transition-colors">
              <Search size={16} strokeWidth={1.5} />
            </button>
          </form>
        </div>

        {/* Categories */}
        <div>
          <button 
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className="w-full flex items-center justify-between text-[11px] font-bold text-[#222222] uppercase tracking-[0.2em] mb-6 pb-4 border-b border-border/40"
          >
            <span>Categories</span>
            {isCategoriesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {isCategoriesOpen && (
            <div className="space-y-4">
              <button
                onClick={() => updateURL({ category: null, page: "1" })}
                className={`block w-full text-left text-[13px] transition-colors ${
                  selectedCategory === null
                    ? "text-[#5B7763] font-bold"
                    : "text-text-muted hover:text-black font-medium"
                }`}
              >
                All Products
              </button>
              {categories.filter(cat => cat.productCount > 0).map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateURL({ category: cat.slug, page: "1" })}
                  className={`w-full text-left flex justify-between items-center transition-colors ${
                    selectedCategory === cat.slug
                      ? "text-[#5B7763]"
                      : "text-text-muted hover:text-black"
                  }`}
                >
                  <span className={`text-[13px] ${selectedCategory === cat.slug ? "font-bold" : "font-medium"}`}>
                    {cat.name}
                  </span>
                  <span className="text-[11px] opacity-60">
                    {cat.productCount}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div>
          <button 
            onClick={() => setIsPriceOpen(!isPriceOpen)}
            className="w-full flex items-center justify-between text-[11px] font-bold text-[#222222] uppercase tracking-[0.2em] mb-6 pb-4 border-b border-border/40"
          >
            <span>Price Filter</span>
            {isPriceOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {isPriceOpen && (
            <div className="space-y-4">
              {[
                { label: "Under ₵50", value: "0-50" },
                { label: "₵100 - ₵200", value: "100-200" },
                { label: "₵350+", value: "350-999999" },
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => handlePriceFilter(range.value)}
                  className={`block w-full text-left text-[13px] transition-colors ${
                    priceRange === range.value
                      ? "text-[#5B7763] font-bold"
                      : "text-text-muted hover:text-black font-medium"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear Filters */}
        {(selectedCategory || priceRange) && (
          <button 
            onClick={clearFilters} 
            className="w-full border border-border/60 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted hover:border-black hover:text-black transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </aside>
  );
}
