"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const slides = [
  {
   id: 4,
   subtitle: "BEST SELLERS",
   title: "Your Daily\nSkincare Ritual",
   description: "Elevate your routine with our award-winning\nhydration collection.",
   image: "/imgs/products/prod-5.jpeg",
 },
 
  {
    id: 5,
    subtitle: "BEST SELLERS",
    title: "Your Daily\nSkincare Ritual",
    description: "Elevate your routine with our award-winning\nhydration collection.",
    image: "/imgs/products/prod-4.jpeg",
  }, 
   {
    id: 1,
    subtitle: "ESSENTIAL ITEMS",
    title: "Beauty Inspired\nby Real Life",
    description: "Made using clean, non-toxic ingredients, our products\nare designed for everyone.",
    image: "/imgs/products/prod-1.jpeg",
  },
  {
    id: 2,
    subtitle: "NEW ARRIVALS",
    title: "Glow From\nWithin",
    description: "Discover our new radiant serums, crafted with\nnature's finest botanicals.",
    image: "/imgs/products/prod-3.jpeg",
  },
  {
    id: 3,
    subtitle: "BEST SELLERS",
    title: "Your Daily\nSkincare Ritual",
    description: "Elevate your routine with our award-winning\nhydration collection.",
    image: "/imgs/products/prod-2.jpeg",
  }
];

export default function Hero() {
  const [[page, direction], setPage] = useState([0, 0]);

  const index = Math.abs(page % slides.length);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => clearInterval(timer);
  }, [page]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "15%" : "-15%",
      scale: 1.05,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      scale: 1,
      opacity: 1,
      transition: { 
        x: { type: "spring", stiffness: 70, damping: 20, mass: 1 },
        opacity: { duration: 0.8, ease: "easeInOut" },
        scale: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "15%" : "-15%",
      scale: 0.95,
      opacity: 0,
      transition: { 
        x: { type: "spring", stiffness: 70, damping: 20, mass: 1 },
        opacity: { duration: 0.8, ease: "easeInOut" },
        scale: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
      }
    })
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { 
        delay: custom * 0.15 + 0.3, 
        duration: 0.9, 
        ease: [0.16, 1, 0.3, 1] 
      }
    })
  };

  return (
    <section className={`relative w-full h-[calc(100dvh-120px)] min-h-[500px] overflow-hidden bg-[#F4F4F4]`}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 flex items-center"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slides[index].image}
              alt="Hero Background"
              fill
              priority={index === 0}
              quality={90}
              className={`object-cover max-lg:object-center ${index > 2 ? 'md:!-[object-position:100%_top]' : 'md:![object-position:100%_bottom]'}`}
            />
            {/* Subtle Gradient to ensure text readability against any image */}
            <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/50 to-transparent md:w-2/3" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
            <div className="max-w-xl">
              <motion.p
                custom={1}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-text-main uppercase mb-6"
              >
                {slides[index].subtitle}
              </motion.p>

              <motion.h1
                custom={2}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-5xl sm:text-6xl lg:text-[72px] font-medium leading-[1.05] tracking-tight text-text-main mb-6 whitespace-pre-line"
              >
                {slides[index].title}
              </motion.h1>

              <motion.p
                custom={3}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-base sm:text-lg text-text-muted leading-relaxed mb-10 whitespace-pre-line"
              >
                {slides[index].description}
              </motion.p>

              <motion.div
                custom={4}
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center bg-text-main text-surface px-10 py-4 font-semibold text-sm transition-all duration-300 hover:bg-text-muted"
                >
                  Shop Now
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-3 z-20">
        {slides.map((_, idx) => {
          const isActive = index === idx;
          return (
            <button
              key={idx}
              onClick={() => {
                const newDirection = idx > index ? 1 : -1;
                setPage([page + (idx - index), newDirection]);
              }}
              className={`rounded-full transition-all duration-300 flex items-center justify-center ${
                isActive
                  ? "w-[14px] h-[14px] border border-[#5B7763] bg-transparent"
                  : "w-[6px] h-[6px] bg-text-main hover:scale-125"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          );
        })}
      </div>
    </section>
  );
}
