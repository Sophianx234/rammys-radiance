"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";

export default function Bestsellers() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        // Fetch highest rated or featured products to simulate best sellers
        const res = await fetch('/api/products?sortBy=rating&limit=4');
        const data = await res.json();
        if (data.success) {
          setProducts(data.data.products);
        }
      } catch (error) {
        console.error('Error fetching best sellers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  if (loading) {
    return (
      <section className="relative bg-[#fdfbf7] py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Header Skeleton */}
          <div className="mb-12 space-y-4">
            <div className="h-12 w-1/3 mx-auto bg-gray-200 rounded-none animate-pulse" />
            <div className="h-6 w-2/3 mx-auto bg-gray-200 rounded-none animate-pulse" />
          </div>

          {/* Product Grid Skeleton */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col w-full text-center">
                {/* Image Skeleton */}
                <div className="aspect-[4/5] bg-gray-200 animate-pulse mb-5 rounded-none" />
                
                {/* Details Skeleton */}
                <div className="flex flex-col items-center space-y-2.5">
                  <div className="h-3 w-16 bg-gray-200 animate-pulse rounded-none" />
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded-none" />
                  <div className="h-3 w-20 bg-gray-200 animate-pulse rounded-none" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length > 0) {
    return (
      <section className="relative bg-[#fdfbf7] py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-3"
          >
            <h2 className="text-3xl md:text-4xl font-medium text-text-main tracking-widest font-bold">
              Bestsellers
            </h2>
            <p className="text-text-muted text-sm md:text-base">
              Discover our most loved beauty essentials, crafted for elegance.
            </p>
          </motion.div>

          {/* Product Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {products.map((product) => (
              <ProductCard product={product} key={product._id} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return null;
}
