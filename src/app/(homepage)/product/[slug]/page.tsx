import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductClient from "./product-client";

import { connectToDatabase } from "@/lib/connectDB";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import mongoose from "mongoose";

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  try {
    await connectToDatabase();
    const decodedSlug = decodeURIComponent(slug);
    let product;
    if (/^[0-9a-fA-F]{24}$/.test(decodedSlug)) {
      product = await Product.findById(decodedSlug).lean();
    } else {
      product = await Product.findOne({ slug: { $regex: new RegExp(`^${decodedSlug}$`, "i") } }).lean();
    }

    if (!product) return { title: "Product Not Found" };

    const title = product.name;
    const description = product.description?.slice(0, 150) || "Buy premium cosmetics and skincare at Rammy's Radiance.";
    const ogImage = product.images?.[0]?.url || product.image || "/og-image.jpg";

    return {
      title,
      description,
      alternates: {
        canonical: `https://rammysradiance.com/product/${product.slug || decodedSlug}`,
      },
      openGraph: {
        title,
        description,
        url: `https://rammysradiance.com/product/${product.slug || decodedSlug}`,
        images: [{ url: ogImage }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      }
    };
  } catch (err) {
    return { title: "Product" };
  }
}

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  
  let data = null;
  let similarProducts = [];

  try {
    await connectToDatabase();
    
    let product;
    const decodedSlug = decodeURIComponent(slug);
    
    if (/^[0-9a-fA-F]{24}$/.test(decodedSlug)) {
      product = await Product.findById(decodedSlug).populate("category").lean();
    } else {
      product = await Product.findOne({ slug: { $regex: new RegExp(`^${decodedSlug}$`, "i") } }).populate("category").lean();
    }
    
    if (product) {
      data = JSON.parse(JSON.stringify(product));
      
      const related = await Product.find({
        category: product.category?._id || product.category,
        _id: { $ne: product._id }
      }).limit(4).lean();
      
      similarProducts = JSON.parse(JSON.stringify(related));
    } else {
      console.error(`Product not found for slug: ${decodedSlug}`);
    }
  } catch (err) {
    console.error("Failed to fetch product from DB:", err);
  }

  if (!data) {
    return (
      <main className="py-32 text-center bg-white min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-medium tracking-widest uppercase text-black mb-4">Product Not Found</h1>
        <p className="text-text-muted text-[13px]">We couldn't find the product you're looking for.</p>
      </main>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.name,
    image: data.images?.map((img: any) => img.url) || [data.image],
    description: data.description,
    sku: data.sku || data._id,
    brand: {
      "@type": "Brand",
      name: "Rammy's Radiance"
    },
    offers: {
      "@type": "Offer",
      url: `https://rammysradiance.com/product/${data.slug || slug}`,
      priceCurrency: "NGN",
      price: data.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: data.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductClient key={data._id} product={data as any} similarProducts={similarProducts as any} />
    </>
  );
}
