"use client";

import { ProductCard } from "./product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const products = [
  {
    id: "1",
    name: "Shield Conditioner",
    price: "$10.00 - $20.00",
    priceRange: true,
    discountBadge: "-17%",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "2",
    name: "Perfecting Facial Oil",
    price: "$20.00",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "3",
    name: "Enriched Hand & Body Wash",
    price: "$25.00",
    discountPrice: "$23.00",
    discountBadge: "-8%",
    image: "https://images.unsplash.com/photo-1615397323281-b6aeb63a9496?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "4",
    name: "Shield Shampoo",
    price: "$45.00",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "5",
    name: "Radiant Skin Serum",
    price: "$30.00",
    discountBadge: "-10%",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "6",
    name: "Daily Moisture Cream",
    price: "$18.00",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "7",
    name: "Botanical Toner",
    price: "$22.00",
    discountPrice: "$19.00",
    discountBadge: "-15%",
    image: "https://images.unsplash.com/photo-1556228720-192a6af4e865?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "8",
    name: "Night Recovery Oil",
    price: "$35.00",
    image: "https://images.unsplash.com/photo-1608248593842-83210d7a0419?auto=format&fit=crop&q=80&w=600",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-medium text-text-main tracking-tight">
            Our Featured Products
          </h2>
          <p className="text-text-muted text-sm md:text-base">
            Get the skin you want to feel
          </p>
        </div>

        {/* Carousel */}
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
                <CarouselItem key={product.id} className="pl-4 md:pl-6 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <ProductCard {...product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="hidden sm:block">
              <CarouselPrevious className="-left-12 h-10 w-10 border-border/60 text-text-muted hover:text-text-main hover:border-text-main transition-colors bg-surface" />
              <CarouselNext className="-right-12 h-10 w-10 border-border/60 text-text-muted hover:text-text-main hover:border-text-main transition-colors bg-surface" />
            </div>
          </Carousel>
        </div>

      </div>
    </section>
  );
}
