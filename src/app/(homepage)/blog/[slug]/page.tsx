import BlogPostClient, { articles } from "./blog-post-client";
import { Metadata } from "next";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const article = articles.find(a => a.slug === slug) || articles[0];

  const plainTextDescription = article.content.replace(/<[^>]+>/g, '').slice(0, 150) + "...";

  return {
    title: article.title,
    description: plainTextDescription,
    alternates: {
      canonical: `https://rammysradiance.com/blog/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: plainTextDescription,
      url: `https://rammysradiance.com/blog/${article.slug}`,
      images: [{ url: article.image }],
      type: "article",
      publishedTime: new Date(article.date).toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: plainTextDescription,
      images: [article.image],
    }
  };
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const article = articles.find(a => a.slug === slug) || articles[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    image: [article.image],
    datePublished: new Date(article.date).toISOString(),
    author: {
      "@type": "Organization",
      name: "Rammy's Radiance"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient />
    </>
  );
}
