"use client";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Award,
  Heart,
  LucideDiamond,
  LucideFeather,
  LucideSparkles,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaFeatherAlt, FaHeart, FaLeaf } from "react-icons/fa";

const values = [
  {
    icon: <LucideDiamond className="text-rose-400 w-8 h-8" />,
    title: "Luxury Ingredients",
    desc: "Each product is made with premium, ethically sourced ingredients for flawless, lasting results.",
  },
  {
    icon: <LucideFeather className="text-emerald-500 w-8 h-8" />,
    title: "Glamorous",
    desc: "We combine elegance and responsibility, creating beauty with minimal waste and maximum impact.",
  },
  {
    icon: <LucideSparkles className="text-amber-400 w-8 h-8" />,
    title: "Glow & Confidence",
    desc: "Our curated cosmetics enhance your natural radiance and inspire confidence in every look you create.",
  },
];

const team = [
  {
    name: "Rammy Johnson",
    role: "Founder & Creative Director",
    image: "/imgs/f-2.jpg",
  },
  {
    name: "Chioma Adeyemi",
    role: "Head of Product Curation",
    image: "/imgs/f-3.jpg",
  },
  {
    name: "Amara Okonkwo",
    role: "Sustainability & Beauty Expert",
    image: "/imgs/f-4.jpg",
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-secondary border-b border-border py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-primary text-sm font-semibold uppercase tracking-widest">
                  Our Story
                </p>

                <h1 className="text-4xl md:text-5xl font-serif font-bold">
                  The Journey of Rammy's Closet
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Rammy's Closet began as a small dream to bring beauty that feels
                personal, luxurious, and ethical to everyone. What started as a
                passion for handpicking the finest cosmetics grew into a curated
                collection that celebrates individuality and self-expression.
              </p>
              <p className="text-muted-foreground">
                Every product we offer has a story sourced thoughtfully, crafted
                with care, and chosen to inspire confidence. Our team of beauty
                enthusiasts works tirelessly to ensure each item reflects the
                quality, elegance, and sustainability that define Rammy's
                Closet.
              </p>
            </div>
            <div className="h-64 md:h-96 bg-primary/10 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src="/imgs/f-2.jpg"
                alt="About Rammys Radiance"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-rose-50 py-28 md:py-36">
        {/* Soft background accents */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-rose-100/40 rounded-full blur-3xl -translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-100/30 rounded-full blur-3xl translate-x-20 translate-y-20" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-20 space-y-4">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="uppercase tracking-[0.25em] text-primary text-sm"
            >
              What We Believe In
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-serif font-bold text-gray-900"
            >
              Our Values
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              The soul of Rammys Radiance is built on love, care, and conscious
              creation.
            </motion.p>
          </div>

          {/* Value Items */}
          <div className="flex flex-col md:flex-row items-start md:items-stretch justify-between gap-12">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="flex-1 text-center justify-center md:text-left space-y-6"
              >
                <div className="flex justify-center md:justify-center">
                  <div className="p-5 bg-white shadow-md  rounded-full border border-gray-100">
                    {v.icon}
                  </div>
                </div>
                <h3 className="text-3xl text-center font-serif font-semibold text-gray-900">
                  {v.title}
                </h3>
                <p className="text-lg text-center text-gray-600 leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-secondary border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              Meet Our Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Passionate beauty experts dedicated to bringing you the best
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-16">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative group"
              >
                {/* Image */}
                <div className="overflow-hidden rounded-3xl shadow-lg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-[420px] object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Text */}
                <div className="absolute bottom-8 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <h3 className="text-2xl font-serif font-semibold tracking-tight">
                    {member.name}
                  </h3>
                  <p className="text-sm tracking-wider uppercase text-gray-200">
                    {member.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}

      <section className="relative py-32 bg-black overflow-hidden">
        {/* Background Images */}
        <img
          src="/imgs/c-2.jpg"
          alt="Luxury Cosmetic Background"
          className="absolute top-0 left-0 w-1/3 h-full object-cover opacity-30 z-0"
        />
        <img
          src="/imgs/c-1.jpg"
          alt="Luxury Cosmetic Background"
          className="absolute bottom-0 right-0 w-1/3 h-full object-cover opacity-30 z-0"
        />

        {/* Soft Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 z-5" />

        {/* Main Content */}
        <div className="relative max-w-4xl mx-auto px-6 text-center z-10 space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight tracking-wider"
          >
            Unleash Your Inner Glow
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
          >
            Discover our curated collection of luxurious cosmetics, designed to
            empower confidence, elegance, and creativity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/shop">
              <Button className="bg-primary text-black px-14 py-5 rounded-full text-lg font-semibold shadow-2xl transition-transform duration-300 hover:scale-105">
                Shop Collection
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Floating Accent Images */}
        <motion.img
          src="/imgs/f-1.jpg"
          alt="Luxury Product Accent"
          initial={{ opacity: 0, x: -150, y: -80, rotate: -15 }}
          whileInView={{ opacity: 1, x: -40, y: -20, rotate: -5 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute top-0 left-0 w-28 md:w-36 opacity-90 z-0 rounded-3xl shadow-2xl"
          animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "loop" }}
        />
        <motion.img
          src="/imgs/f-2.jpg"
          alt="Luxury Product Accent"
          initial={{ opacity: 0, x: 150, y: 100, rotate: 20 }}
          whileInView={{ opacity: 1, x: 50, y: 20, rotate: 5 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-0 right-0 w-28 md:w-36 opacity-90 z-0 rounded-3xl shadow-2xl"
          animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "loop",
            delay: 1,
          }}
        />

        {/* Sparkle Accents */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-4 h-4 bg-white rounded-full opacity-60 blur-sm"
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "loop" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-white rounded-full opacity-50 blur-sm"
          animate={{ scale: [1, 2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "loop",
            delay: 1,
          }}
        />
      </section>
    </main>
  );
}
