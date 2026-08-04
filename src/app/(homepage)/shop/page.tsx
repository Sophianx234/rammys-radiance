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
    <main>
      {/* Page Header */}
      <section className="bg-secondary border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold">
            Shop Our Collection
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover our curated selection of premium cosmetics
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setPage(1);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === null
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setPage(1);
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat.slug
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{cat.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {cat.productCount}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Price Range</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Under ₵50", value: "0-50" },
                    { label: "₵100 - ₵200", value: "100-200" },
                    { label: "₵350+", value: "350-999999" },
                  ].map((range) => (
                    <button
                      key={range.value}
                      onClick={() => handlePriceFilter(range.value)}
                      className={`w-full text-left p-2 rounded transition-colors ${
                        priceRange === range.value
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary text-muted-foreground"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategory || priceRange) && (
                <Button onClick={clearFilters} variant="outline" className="w-full">
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <p className="text-sm text-muted-foreground">
                {loading ? "Loading..." : `Showing ${products.length} products`}
              </p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="appearance-none bg-card border border-border rounded-lg px-4 py-2 pr-10 text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                />
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <GridLoader className="h-8 w-8  text-primary" />
              </div>
            ) : (
              <>
                {/* Products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (p) => (
                          <Button
                            key={p}
                            variant={page === p ? "default" : "outline"}
                            onClick={() => setPage(p)}
                            size="sm"
                          >
                            {p}
                          </Button>
                        )
                      )}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
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