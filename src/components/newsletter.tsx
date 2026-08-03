"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import ScaleLoader from "react-spinners/ScaleLoader";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<null | { type: "success" | "error"; text: string }>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Subscription failed");
      }
      
      const data = await response.json();
      setMessage(data);
      setEmail("");
    } catch (err) {
      setMessage({ type: "error", text: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

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

          <form onSubmit={handleSubscribe} className="flex flex-col gap-8 w-full max-w-md">
            <div className="relative w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full bg-transparent border-b border-black/30 pb-3 text-sm focus:outline-none focus:border-black text-black placeholder-black/40 transition-colors rounded-none"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-black hover:bg-black/80 text-white w-full sm:w-auto self-start px-12 h-[50px] rounded-none text-xs font-semibold uppercase tracking-widest transition-colors"
            >
              {loading ? <ScaleLoader height={14} width={2} color="#fff" /> : "Subscribe"}
            </Button>
          </form>

          {message?.type && (
            <p className={`mt-6 text-[13px] font-medium ${message.type === "success" ? "text-[#5B7763]" : "text-red-500"}`}>
              {message.text}
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
          <img
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1200"
            alt="Luxury beauty products"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>

      </div>
    </section>
  );
}
