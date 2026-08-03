"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductImageSlider({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="flex flex-col gap-4 h-full w-full">

      {/* Main Image Slider */}
      <div className="relative w-full h-[420px] md:h-full bg-secondary rounded-xl overflow-hidden">

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute top-1/2 left-4 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={next}
          className="absolute top-1/2 right-4 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
        >
          <ChevronRight size={22} />
        </button>

        {/* Image */}
        <div className="relative w-full h-full">
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={images[index]}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-hidden over pb-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`relative w-20 h-20 rounded-md overflow-hidden border ${
              i === index ? "border-primary" : "border-border"
            }`}
          >
            <img
              src={img}
              className="w-full h-full object-cover hover:opacity-80 transition"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
