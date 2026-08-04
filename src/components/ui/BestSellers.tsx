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
      <section className="relative bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Header Skeleton */}
          <div className="mb-12 space-y-4">
            <div className="h-12 w-1/3 mx-auto bg-gray-200 rounded-none animate-pulse" />
            <div className="h-6 w-2/3 mx-auto bg-gray-200 rounded-none animate-pulse" />
          </div>

          {/* Product Grid Skeleton */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-none p-4 flex flex-col gap-4 animate-pulse"
              >
                <div className="h-52 bg-gray-200 rounded-none" />
                <div className="h-6 w-3/4 bg-gray-200 rounded-none" />
                <div className="h-6 w-1/2 bg-gray-200 rounded-none" />
                <div className="h-10 w-full bg-gray-200 rounded-none" />
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
            className="mb-12"
          >
            <h2 className="text-4xl text-[#5B7763] md:text-5xl font-bold mb-4 uppercase tracking-widest">
              Bestsellers
            </h2>
            <p className="text-[#222222] mb-12 uppercase tracking-wider text-[12px] font-bold">
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
