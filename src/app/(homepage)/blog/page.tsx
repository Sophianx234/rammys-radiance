"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const articles = [
  {
    id: 1,
    slug: "achieving-the-glow",
    title: "Achieving the Signature Radiance Glow",
    excerpt: "Discover the step-by-step morning routine our founder uses to maintain flawless, luminous skin throughout the day.",
    category: "Skincare Tips",
    categorySlug: "skincare-tips",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=1000",
    date: "August 12, 2026",
    isFeatured: true
  },
  {
    id: 2,
    slug: "winter-routine",
    title: "The Ultimate Winter Hydration Routine",
    excerpt: "Cold weather demands a shift in your skincare approach. Learn which ingredients to prioritize when the temperature drops.",
    category: "Skincare Tips",
    categorySlug: "skincare-tips",
    image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=1000",
    date: "August 05, 2026",
    isFeatured: false
  },
  {
    id: 3,
    slug: "ingredient-spotlight",
    title: "Ingredient Spotlight: Niacinamide",
    excerpt: "Why this powerhouse vitamin B3 derivative is the secret weapon in our newest serum collection.",
    category: "Brand News",
    categorySlug: "brand-news",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1000",
    date: "July 28, 2026",
    isFeatured: false
  },
  {
    id: 4,
    slug: "minimalist-makeup",
    title: "Mastering the 'No Makeup' Makeup Look",
    excerpt: "A 5-minute tutorial on enhancing your natural features using our lightweight tinted moisturizer and cream blush.",
    category: "Makeup Tutorials",
    categorySlug: "makeup-tutorials",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1000",
    date: "July 15, 2026",
    isFeatured: false
  },
  {
    id: 5,
    slug: "sustainability-pledge",
    title: "Our 2026 Sustainability Pledge",
    excerpt: "We are transitioning all of our glass packaging to 100% recycled materials. Read about our commitment to the planet.",
    category: "Brand News",
    categorySlug: "brand-news",
    image: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?auto=format&fit=crop&q=80&w=1000",
    date: "July 02, 2026",
    isFeatured: false
  }
];

const topics = [
  { name: "All Articles", slug: "all" },
  { name: "Skincare Tips", slug: "skincare-tips" },
  { name: "Makeup Tutorials", slug: "makeup-tutorials" },
  { name: "Brand News", slug: "brand-news" },
];

function BlogContent() {
  const searchParams = useSearchParams();
  const currentTopic = searchParams.get("topic") || "all";

  const filteredArticles = currentTopic === "all" 
    ? articles 
    : articles.filter(a => a.categorySlug === currentTopic);

  const featuredArticle = currentTopic === "all" ? articles.find(a => a.isFeatured) : filteredArticles[0];
  const gridArticles = currentTopic === "all" ? filteredArticles.filter(a => !a.isFeatured) : filteredArticles.slice(1);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header Banner */}
      <div className="w-full bg-[#E8EAE6] py-24 px-6 border-b border-border/40">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[32px] md:text-[52px] font-bold tracking-tight uppercase mb-4 text-[#222222]"
          >
            The Radiance Journal
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[13px] tracking-widest uppercase text-text-muted max-w-lg"
          >
            Insights, tutorials, and behind-the-scenes at Rammy's Radiance.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        {/* Topic Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 border-b border-border/40 pb-8">
          {topics.map(topic => (
            <Link 
              key={topic.slug}
              href={topic.slug === "all" ? "/blog" : `/blog?topic=${topic.slug}`}
              className={`px-6 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${currentTopic === topic.slug ? "bg-[#5B7763] text-white" : "text-text-muted hover:text-[#222222]"}`}
            >
              {topic.name}
            </Link>
          ))}
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-24 group block"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border/40 bg-white">
              <div className="relative aspect-square lg:aspect-auto lg:h-full overflow-hidden">
                <Image 
                  src={featuredArticle.image} 
                  alt={featuredArticle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
              <div className="p-8 lg:p-16 flex flex-col justify-center">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#5B7763] mb-4">{featuredArticle.category}</span>
                <h2 className="text-[28px] lg:text-[40px] font-bold leading-tight text-[#222222] mb-6">{featuredArticle.title}</h2>
                <p className="text-[14px] leading-relaxed text-text-muted mb-8">{featuredArticle.excerpt}</p>
                <div className="flex items-center justify-between mt-auto pt-8 border-t border-border/40">
                  <span className="text-[11px] uppercase tracking-widest text-text-muted">{featuredArticle.date}</span>
                  <Link href={`/blog/${featuredArticle.slug}`} className="text-[11px] font-bold uppercase tracking-widest text-[#222222] hover:text-[#5B7763] transition-colors">
                    Read Article &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid Articles */}
        {gridArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridArticles.map((article, idx) => (
              <motion.div 
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + (idx * 0.1) }}
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
            ))}
          </div>
        )}

        {filteredArticles.length === 0 && (
          <div className="text-center py-24">
            <p className="text-[14px] text-text-muted">No articles found for this topic.</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center">Loading...</div>}>
      <BlogContent />
    </Suspense>
  );
}
