"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const testimonials = [
  {
    id: 1,
    name: "Sophia Laurent",
    role: "Professional Makeup Artist",
    quote: "I use a lot of different brands, but Rammy’s Radiance genuinely surprised me. The products blend so smoothly and look amazing on every skin tone I’ve tried them on.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200", 
  },
  {
    id: 2,
    name: "Ava Kim",
    role: "Beauty Lover",
    quote: "I love how lightweight everything feels. The lip products don’t crack, the shades are stunning, and the finish lasts way longer than I expected. It makes getting ready so much easier.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 3,
    name: "Isabella Moore",
    role: "Content Creator",
    quote: "I didn’t expect the packaging to feel this premium. The products look good on camera, but they feel even better in person. You can tell a lot of care went into how these were made.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 4,
    name: "Elena Rodriguez",
    role: "Skincare Enthusiast",
    quote: "Finding products that don't irritate my sensitive skin has always been a struggle. This collection is a revelation. My skin has never looked so clear, hydrated, and radiant.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 5,
    name: "Mia Thompson",
    role: "Esthetician",
    quote: "The ingredient lists are incredible. I confidently recommend these serums to my clients because I've seen the brightening results firsthand.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 6,
    name: "Chloe Evans",
    role: "Daily User",
    quote: "Finally, a routine that feels luxurious but doesn't take 40 minutes. My mornings are streamlined and I've never received so many compliments on my glow.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
  }
];

const AUTOPLAY_INTERVAL = 5; // seconds per slide

export default function Testimonials() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="py-24 bg-surface border-t border-border/40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-text-main/70">
            TESTIMONIALS
          </p>
          <h2 className="text-3xl md:text-4xl font-medium text-text-main tracking-tight">
            What Our Clients Love
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-8">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-4 md:pl-8 sm:basis-1/2 lg:basis-1/3">
                  <div className="flex flex-col text-center items-center group h-full">
                    {/* Stars */}
                    <div className="flex items-center gap-[2px] mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#5B7763] text-[#5B7763]" strokeWidth={1} />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-[15px] text-text-muted leading-relaxed mb-8 italic px-2">
                      "{testimonial.quote}"
                    </p>

                    {/* Author */}
                    <div className="mt-auto flex flex-col items-center">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden mb-4">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <p className="text-[13px] font-semibold text-text-main tracking-wide uppercase">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Indicators with Integrated Progress Bar */}
        <div className="flex justify-center items-center gap-2 mt-16">
          {Array.from({ length: count }).map((_, index) => {
            const isActive = index === current;
            return (
              <button 
                key={index}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`relative h-2 rounded-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  isActive ? "w-10 sm:w-14 bg-black/10" : "w-2 bg-black/15 hover:bg-black/25"
                }`}
              >
                {isActive && (
                  <motion.div
                    key={current} // Reset animation when slide changes
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: AUTOPLAY_INTERVAL, ease: "linear" }}
                    onAnimationComplete={() => {
                      if (api) api.scrollNext();
                    }}
                    className="absolute top-0 left-0 h-full bg-[#5B7763] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
