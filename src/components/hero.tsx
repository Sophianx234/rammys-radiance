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
   imagePosition: "right",
  },
  {
    id: 5,
    subtitle: "BEST SELLERS",
    title: "Your Daily\nSkincare Ritual",
    description: "Elevate your routine with our award-winning\nhydration collection.",
    image: "/imgs/products/prod-4.jpeg",
    imagePosition: "right",
  }, 
  {
    id: 1,
    subtitle: "ESSENTIAL ITEMS",
    title: "Beauty Inspired\nby Real Life",
    description: "Made using clean, non-toxic ingredients, our products\nare designed for everyone.",
    image: "/imgs/products/prod-1.jpeg",
    imagePosition: " right",
  },
  {
    id: 2,
    subtitle: "NEW ARRIVALS",
    title: "Glow From\nWithin",
    description: "Discover our new radiant serums, crafted with\nnature's finest botanicals.",
    image: "/imgs/products/prod-3.jpeg",
    imagePosition: "right",
  },
  {
    id: 3,
    subtitle: "BEST SELLERS",
    title: "Your Daily\nSkincare Ritual",
    description: "Elevate your routine with our award-winning\nhydration collection.",
    image: "/imgs/products/prod-2.jpeg",
    imagePosition: "right",
  }
];

export default function Hero() {
  const [[page, direction], setPage] = useState([0, 0]);

  const index = Math.abs(page % slides.length);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  // Autoplay is handled by the motion.div progress bar below

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "5%" : "-5%",
      scale: 1.02,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      scale: 1,
      opacity: 1,
      transition: { 
        x: { type: "spring", duration: 0.7, bounce: 0 },
        opacity: { duration: 0.5, ease: "easeOut" },
        scale: { duration: 0.7, ease: [0.23, 1, 0.32, 1] } 
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "5%" : "-5%",
      scale: 0.98,
      opacity: 0,
      transition: { 
        x: { type: "spring", duration: 0.7, bounce: 0 },
        opacity: { duration: 0.4, ease: "easeOut" },
        scale: { duration: 0.7, ease: [0.23, 1, 0.32, 1] }
      }
    })
  };

  const textVariants = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { 
        delay: custom * 0.08 + 0.2, 
        duration: 0.5, 
        ease: [0.23, 1, 0.32, 1] // Strong ease-out
      }
    })
  };

  return (
    <section 
      className="relative w-full  overflow-hidden bg-[#F4F4F4]"
      style={{ height: "calc(100dvh - var(--header-height, 120px))" }}
    >
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
              className="object-contain  max-lg:object-center md:object-[var(--hero-img-pos)]"
              style={{ "--hero-img-pos": slides[index].imagePosition } as React.CSSProperties}
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
                  className="inline-flex items-center justify-center bg-text-main text-surface px-10 py-4 font-semibold text-sm transition-[background-color,transform] duration-200 ease-out hover:bg-text-muted active:scale-[0.97]"
                >
                  Shop Now
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center items-center gap-2 z-20">
        {slides.map((_, idx) => {
          const isActive = index === idx;
          return (
            <button
              key={idx}
              onClick={() => {
                const newDirection = idx > index ? 1 : -1;
                setPage([page + (idx - index), newDirection]);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`relative h-2 rounded-full overflow-hidden transition-all duration-100 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                isActive ? "w-10 sm:w-14 bg-black/10" : "w-2 bg-black/15 hover:bg-black/25"
              }`}
            >
              {isActive && (
                <motion.div
                  key={page} // Reset animation when slide changes
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 6, ease: "linear" }}
                  onAnimationComplete={() => paginate(1)}
                  className="absolute top-0 left-0 h-full bg-[#5B7763] rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
