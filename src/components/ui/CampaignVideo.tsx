"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CampaignVideo() {
  return (
    <section className="relative h-[600px] lg:h-[700px] w-full overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0 w-full h-full">
        {/* Replace with <video> tag when you have the actual video file */}
        <img
          src="/imgs/f-5.jpg"
          alt="Campaign Video Placeholder"
          className="w-full h-full object-cover object-center"
        />
        {/* Clean dark overlay to ensure white text pops beautifully */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-4 text-white/90"
        >
          The Glow Collection
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-6"
        >
          Radiance <br className="sm:hidden" />
          Redefined.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-base sm:text-lg text-white/80 mb-10 max-w-md mx-auto leading-relaxed"
        >
          Experience a new era of effortless confidence with our clinically proven, nature-inspired formulas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Link
            href="/shop"
            className="inline-flex items-center justify-center bg-black text-white px-10 py-4 text-[13px] font-semibold hover:bg-black hover:text-white transition-colors duration-300 shadow-sm"
          >
            Watch Campaign
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
