"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { GridLoader } from "react-spinners";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/products?limit=8");
        const data = await res.json();
        if (data.success) {
          setProducts(data.data.products);
        }
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-medium text-text-main tracking-widest font-bold">
            Our Featured Products
          </h2>
          <p className="text-text-muted text-sm md:text-base">
            Get the skin you want to feel
          </p>
        </div>

        {loading ? (
          <div className="relative px-2 sm:px-12">
            <div className="flex -ml-4 md:-ml-6 overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="pl-4 md:pl-6 min-w-0 flex-shrink-0 flex-grow-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="flex flex-col w-full">
                    {/* Image Skeleton */}
                    <div className="aspect-[4/5] bg-gray-200 animate-pulse mb-5 rounded-none" />
                    
                    {/* Details Skeleton */}
                    <div className="flex flex-col items-center space-y-2.5">
                      <div className="h-3 w-16 bg-gray-200 animate-pulse rounded-none" />
                      <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded-none" />
                      <div className="h-3 w-20 bg-gray-200 animate-pulse rounded-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative px-2 sm:px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4 md:-ml-6">
                {products.map((product) => (
                  <CarouselItem key={product._id} className="pl-4 md:pl-6 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <ProductCard product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <div className="hidden sm:block">
                <CarouselPrevious className="-left-12 h-10 w-10 border-border/60 text-text-muted hover:text-text-main hover:border-text-main transition-colors bg-surface" />
                <CarouselNext className="-right-12 h-10 w-10 border-border/60 text-text-muted hover:text-text-main hover:border-text-main transition-colors bg-surface" />
              </div>
            </Carousel>
          </div>
        )}

      </div>
    </section>
  );
}
