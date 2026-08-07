"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export function AnimatedHeader() {
  return (
    <div className="w-full text-white py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[url('/imgs/products/prod-3.jpeg')] bg-cover bg-[center_50%]"></div>
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[32px] md:text-[52px] font-bold tracking-tight uppercase mb-4 text-white drop-shadow-md"
        >
          The Radiance Journal
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[13px] tracking-widest uppercase text-white/90 max-w-lg drop-shadow-md"
        >
          Insights, tutorials, and behind-the-scenes at Rammy's Radiance.
        </motion.p>
      </div>
    </div>
  );
}

export function AnimatedFeaturedArticle({ article }: { article: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-24 group block"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border/40 bg-white">
        <div className="relative aspect-square lg:aspect-auto lg:h-full overflow-hidden">
          <Image 
            src={article.image} 
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            priority
          />
        </div>
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#5B7763] mb-4">{article.category}</span>
          <h2 className="text-[28px] lg:text-[40px] font-bold leading-tight text-[#222222] mb-6">{article.title}</h2>
          <p className="text-[14px] leading-relaxed text-text-muted mb-8">{article.excerpt}</p>
          <div className="flex items-center justify-between mt-auto pt-8 border-t border-border/40">
            <span className="text-[11px] uppercase tracking-widest text-text-muted">{article.date}</span>
            <Link href={`/blog/${article.slug}`} className="text-[11px] font-bold uppercase tracking-widest text-[#222222] hover:text-[#5B7763] transition-colors">
              Read Article &rarr;
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function AnimatedArticleGridItem({ article, index }: { article: any, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
      className="group flex flex-col"
    >
      <Link href={`/blog/${article.slug}`} className="block overflow-hidden relative aspect-[4/3] mb-6 border border-border/40">
        <Image 
          src={article.image} 
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </Link>
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#5B7763] mb-3">{article.category}</span>
      <Link href={`/blog/${article.slug}`}>
        <h3 className="text-[18px] font-bold leading-tight text-[#222222] mb-3 group-hover:text-[#5B7763] transition-colors line-clamp-2">{article.title}</h3>
      </Link>
      <p className="text-[13px] leading-relaxed text-text-muted mb-6 line-clamp-3">{article.excerpt}</p>
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/40">
        <span className="text-[10px] uppercase tracking-widest text-text-muted">{article.date}</span>
        <Link href={`/blog/${article.slug}`} className="text-[10px] font-bold uppercase tracking-widest text-[#222222] hover:text-[#5B7763] transition-colors">
          Read
        </Link>
      </div>
    </motion.div>
  );
}
