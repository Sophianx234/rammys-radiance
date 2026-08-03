"use client";

import Image from "next/image";
import { BarLoader } from "react-spinners";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center bg-surface gap-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image 
          src="/imgs/logo.jpeg" 
          alt="Rammy's Radiance" 
          width={200} 
          height={60} 
          className="object-contain"
          priority
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <BarLoader width={100} height={2} color="#5B7763" className="opacity-80" />
      </motion.div>
    </div>
  );
}
