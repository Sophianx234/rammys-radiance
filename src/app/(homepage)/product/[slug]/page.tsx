import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductClient from "./product-client";

import { connectToDatabase } from "@/lib/connectDB";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import mongoose from "mongoose";

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  
  let data = null;
  let similarProducts = [];

  try {
    await connectToDatabase();
    
    let product;
    if (/^[0-9a-fA-F]{24}$/.test(slug)) {
      product = await Product.findById(slug).populate("category").lean();
    } else {
      product = await Product.findOne({ slug }).populate("category").lean();
    }
    
    if (product) {
      data = JSON.parse(JSON.stringify(product));
      
      const related = await Product.find({
        category: product.category?._id || product.category,
        _id: { $ne: product._id }
      }).limit(4).lean();
      
      similarProducts = JSON.parse(JSON.stringify(related));
    }
  } catch (err) {
    console.error("Failed to fetch product from DB", err);
  }

  if (!data) {
    return (
      <main className="py-32 text-center bg-white min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-medium tracking-widest uppercase text-black mb-4">Product Not Found</h1>
        <p className="text-text-muted text-[13px]">We couldn't find the product you're looking for.</p>
      </main>
    );
  }

  return <ProductClient key={data._id} product={data as any} similarProducts={similarProducts as any} />;
}
