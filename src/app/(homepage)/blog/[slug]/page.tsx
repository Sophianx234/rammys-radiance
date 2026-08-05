"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Share2 } from "lucide-react";
import { useParams } from "next/navigation";

// Reusing the static data just for the demo
const articles = [
  {
    id: 1,
    slug: "achieving-the-glow",
    title: "Achieving the Signature Radiance Glow",
    category: "Skincare Tips",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=2000",
    date: "August 12, 2026",
    content: `
      <p>True radiance isn’t just about the products you use; it’s about how and when you apply them. Our signature glow is a philosophy built on deep hydration and respecting the skin barrier.</p>
      
      <h3>Step 1: The Gentle Cleanse</h3>
      <p>Start your morning by gently removing overnight impurities. Avoid harsh foaming cleansers that strip your natural oils. Instead, opt for a milky or gel-based formula that leaves your skin feeling plump and hydrated.</p>
      
      <h3>Step 2: The Moisture Sandwich</h3>
      <p>Hydration is the secret to a glassy complexion. Apply your serums to slightly damp skin to trap moisture. Layer a hyaluronic acid serum followed immediately by a lightweight moisturizer to seal everything in.</p>

      <h3>Step 3: The Final Seal</h3>
      <p>Never skip sunscreen. Modern formulas not only protect your skin from photo-aging but also serve as incredible illuminating primers for your makeup. A generous layer gives you that unmistakable healthy sheen.</p>
      
      <p>Remember, consistency is far more important than intensity. Treat your skin with kindness, and it will reward you with a luminous, lit-from-within glow.</p>
    `
  },
  {
    id: 2,
    slug: "winter-routine",
    title: "The Ultimate Winter Hydration Routine",
    category: "Skincare Tips",
    image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=2000",
    date: "August 05, 2026",
    content: `
      <p>Cold weather demands a shift in your skincare approach. Learn which ingredients to prioritize when the temperature drops to protect your delicate skin barrier from harsh winds and indoor heating.</p>
      
      <h3>Thicker Emollients</h3>
      <p>Swap your summer gel moisturizer for a rich cream containing ceramides and squalane. These ingredients mimic your skin's natural oils and prevent transepidermal water loss.</p>
    `
  },
  {
    id: 3,
    slug: "ingredient-spotlight",
    title: "Ingredient Spotlight: Niacinamide",
    category: "Brand News",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=2000",
    date: "July 28, 2026",
    content: `
      <p>Why this powerhouse vitamin B3 derivative is the secret weapon in our newest serum collection. Niacinamide is one of the most versatile and well-tolerated active ingredients in dermatology.</p>
      <p>From reducing the appearance of enlarged pores to fading hyperpigmentation and strengthening the lipid barrier, Niacinamide does it all without the irritation associated with stronger actives.</p>
    `
  }
];

export default function BlogPost() {
  const params = useParams();
  const slug = params?.slug as string;
  
  // Find the article, or default to the first one if it's a random link
  const article = articles.find(a => a.slug === slug) || articles[0];

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Hero Image */}
      <div className="w-full h-[50vh] min-h-[400px] relative">
        <Image 
          src={article.image} 
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 lg:p-16">
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">{article.category}</span>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">{article.title}</h1>
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest text-white/80 mt-4">
              <span>{article.date}</span>
              <span>•</span>
              <span>3 Min Read</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 mt-12 flex flex-col lg:flex-row gap-12">
        
        {/* Social Share Sidebar */}
        <div className="hidden lg:flex flex-col gap-6 w-16 shrink-0 pt-2">
          <Link href="/blog" className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center text-text-muted hover:text-black hover:border-black transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <button className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center text-text-muted hover:text-black hover:border-black transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 prose prose-lg prose-headings:font-bold prose-headings:text-[#222222] prose-p:text-[#444] prose-p:leading-relaxed max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

      </div>
    </div>
  );
}
