"use client";

import { useSearchParams, useRouter } from "next/navigation";

export function ShopFilters({ categories }: { categories: any[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedCategory = searchParams.get("category");
  const priceRange = searchParams.get("priceRange");

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
    updateURL({ category: null, priceRange: null, sortBy: null, page: "1" });
  };

  return (
    <aside className="lg:w-[240px] shrink-0">
      <div className="sticky top-28 space-y-12">
        {/* Categories */}
        <div>
          <h3 className="text-[11px] font-bold text-[#222222] uppercase tracking-[0.2em] mb-6 pb-4 border-b border-border/40">
            Categories
          </h3>
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
            {categories.map((cat) => (
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
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-[11px] font-bold text-[#222222] uppercase tracking-[0.2em] mb-6 pb-4 border-b border-border/40">
            Price Filter
          </h3>
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
