import Link from "next/link";
import { AnimatedHeader, AnimatedFeaturedArticle, AnimatedArticleGridItem } from "./blog-animations";

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

export default async function BlogPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const currentTopic = typeof searchParams.topic === 'string' ? searchParams.topic : "all";

  const filteredArticles = currentTopic === "all" 
    ? articles 
    : articles.filter(a => a.categorySlug === currentTopic);

  const featuredArticle = currentTopic === "all" ? articles.find(a => a.isFeatured) : filteredArticles[0];
  const gridArticles = currentTopic === "all" ? filteredArticles.filter(a => !a.isFeatured) : filteredArticles.slice(1);

  return (
    <div className="min-h-screen bg-surface">
      <AnimatedHeader />

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
        {featuredArticle && <AnimatedFeaturedArticle article={featuredArticle} />}

        {/* Grid Articles */}
        {gridArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridArticles.map((article, idx) => (
              <AnimatedArticleGridItem key={article.id} article={article} index={idx} />
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
