// app/shop/page.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ChevronDown, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useDashStore } from "@/lib/store";
import { ProductCard } from "@/components/product-card";
import { GridLoader } from "react-spinners";

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
  inStock: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  productCount: number;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const {user} = useDashStore()
  const [totalPages, setTotalPages] = useState(1);

  // Fetch categories on mount


  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, priceRange, page]);

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched categories:", data);
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }
  fetchCategories()},[])

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        sortBy,
        page: page.toString(),
        limit: "12",
      });

      if (selectedCategory) {
        params.append("category", selectedCategory);
      }

      if (priceRange) {
        const [min, max] = priceRange.split("-");
        if (min) params.append("minPrice", min);
        if (max) params.append("maxPrice", max);
      }

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.data.products);
        setTotalPages(data.data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
  const fetchWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist");
      const data = await res.json();
      if (data.success) {
        setFavorites(data.data.map((p: Product) => p._id));
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  }
fetchWishlist()
},[]);

  

  const handlePriceFilter = (range: string) => {
    setPriceRange(range === priceRange ? null : range);
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setPriceRange(null);
    setSortBy("featured");
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans pb-24">
      {/* Page Header */}
      <section className="pt-20 pb-16 text-center border-b border-border/40 bg-white">
        <h1 className="text-3xl md:text-5xl font-sans font-medium text-[#222222] tracking-tight mb-4">
          SHOP ALL
        </h1>
        <p className="text-[13px] text-text-muted max-w-xl mx-auto px-4 uppercase tracking-[0.2em] font-medium">
          Elevate your daily ritual with our curated essentials
        </p>
      </section>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Sidebar */}
          <aside className="lg:w-[240px] shrink-0">
            <div className="sticky top-28 space-y-12">
              {/* Categories */}
              <div>
                <h3 className="text-[11px] font-bold text-[#222222] uppercase tracking-[0.2em] mb-6 pb-4 border-b border-border/40">
                  Categories
                </h3>
                <div className="space-y-4">
                  <button
                    onClick={() => { setSelectedCategory(null); setPage(1); }}
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
                      onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
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

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort & Count */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 pb-6 border-b border-border/40 gap-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted">
                {loading ? "Loading..." : `${products.length} Products Found`}
              </p>
              
              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
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
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="h-[40vh] flex justify-center items-center">
                <GridLoader size={18} color="#5B7763" />
              </div>
            ) : (
              <>
                {/* Products */}
                {products.length === 0 ? (
                  <div className="h-[40vh] flex flex-col justify-center items-center text-center">
                    <p className="text-[14px] text-text-muted mb-6">No products match your current filters.</p>
                    <button 
                      onClick={clearFilters} 
                      className="bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-3 hover:bg-[#5B7763] transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product as any} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-20 pt-10 border-t border-border/40">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-10 h-10 flex items-center justify-center border border-border/60 text-text-muted hover:border-black hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      &larr;
                    </button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-10 h-10 flex items-center justify-center text-[12px] font-bold transition-colors ${
                            page === p 
                              ? "bg-black text-white" 
                              : "border border-border/60 text-text-muted hover:border-black hover:text-black"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="w-10 h-10 flex items-center justify-center border border-border/60 text-text-muted hover:border-black hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      &rarr;
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}