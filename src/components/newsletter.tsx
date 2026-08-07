"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import ScaleLoader from "react-spinners/ScaleLoader";
import Image from "next/image";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

export default function Newsletter() {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, null);

  return (
    <section className="bg-[#E7EAE5] overflow-hidden">
      <div className="grid md:grid-cols-2">
        
        {/* Left Content */}
        <motion.div
          className="flex flex-col justify-center px-8 py-20 md:py-32 md:px-16 lg:px-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-black/60 mb-4">
            Join the Inner Circle
          </p>

          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-black mb-6 leading-[1.1]">
            Exclusive Beauty <br /> Awaits.
          </h2>

          <p className="text-sm text-black/70 max-w-md mb-12 leading-relaxed">
            Subscribe for curated trends, product drops, and insider beauty tips from industry experts designed to inspire your elegance.
          </p>

          <form action={formAction} className="flex flex-col gap-8 w-full max-w-md">
            <div className="relative w-full">
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
                className="w-full bg-transparent border-b border-black/30 pb-3 text-sm focus:outline-none focus:border-black text-black placeholder-black/40 transition-colors rounded-none"
              />
            </div>

            <Button
              type="submit"
              disabled={pending}
              className="bg-black hover:bg-black/80 text-white w-full sm:w-auto self-start px-12 h-[50px] rounded-none text-xs font-semibold uppercase tracking-widest transition-colors"
            >
              {pending ? <ScaleLoader height={14} width={2} color="#fff" /> : "Subscribe"}
            </Button>
          </form>

          {state?.text && (
            <p className={`mt-6 text-[13px] font-medium ${state.type === "success" ? "text-[#5B7763]" : "text-red-500"}`}>
              {state.text}
            </p>
          )}

          <p className="text-[11px] text-black/40 mt-8 uppercase tracking-wider">
            No spam. Just pure beauty inspiration.
          </p>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="relative h-[450px] md:h-auto overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <Image
            src="/imgs/products/cta-1.jpeg"
            alt="Luxury beauty products"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-full object-cover object-right "
          />
        </motion.div>

      </div>
    </section>
  );
}
