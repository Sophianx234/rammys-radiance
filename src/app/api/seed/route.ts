import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

const productsToSeed = [
  {
    slug: "shield-conditioner",
    name: "Shield Conditioner",
    price: 1500, // stored in cents or base units, I'll store as numbers
    description: "Our nourishing Shield Conditioner repairs and protects your hair.",
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600"],
    discountBadge: "-17%",
    categoryName: "Hair Care",
    isFeatured: true,
  },
  {
    slug: "perfecting-facial-oil",
    name: "Perfecting Facial Oil",
    price: 2000,
    description: "A lightweight, perfecting facial oil that hydrates and balances skin.",
    images: ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=600"],
    categoryName: "Skincare",
    isFeatured: true,
  },
  {
    slug: "enriched-hand-body-wash",
    name: "Enriched Hand & Body Wash",
    price: 2500,
    discountPrice: 2300,
    description: "Gently cleanse and enrich your skin with our hand and body wash.",
    images: ["https://images.unsplash.com/photo-1615397323281-b6aeb63a9496?auto=format&fit=crop&q=80&w=600"],
    discountBadge: "-8%",
    categoryName: "Body Care",
    isFeatured: true,
  },
  {
    slug: "shield-shampoo",
    name: "Shield Shampoo",
    price: 4500,
    description: "Revitalize your scalp and cleanse your hair thoroughly.",
    images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=600"],
    categoryName: "Hair Care",
    isFeatured: true,
  },
  {
    slug: "radiant-skin-serum",
    name: "Radiant Skin Serum",
    price: 3000,
    description: "Boost your skin's radiance with our highly concentrated serum.",
    images: ["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600"],
    discountBadge: "-10%",
    categoryName: "Skincare",
    isFeatured: true,
  },
  {
    slug: "daily-moisture-cream",
    name: "Daily Moisture Cream",
    price: 1800,
    description: "Lock in hydration all day long.",
    images: ["https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600"],
    categoryName: "Skincare",
    isFeatured: true,
  },
  {
    slug: "botanical-toner",
    name: "Botanical Toner",
    price: 2200,
    discountPrice: 1900,
    description: "Soothe and prep your skin with botanical extracts.",
    images: ["https://images.unsplash.com/photo-1556228720-192a6af4e865?auto=format&fit=crop&q=80&w=600"],
    discountBadge: "-15%",
    categoryName: "Skincare",
    isFeatured: true,
  },
  {
    slug: "night-recovery-oil",
    name: "Night Recovery Oil",
    price: 3500,
    description: "Wake up to renewed skin with our overnight recovery oil.",
    images: ["https://images.unsplash.com/photo-1608248593842-83210d7a0419?auto=format&fit=crop&q=80&w=600"],
    categoryName: "Skincare",
    isFeatured: true,
  },
  // Adding the best sellers
  {
    slug: "luxury-lipstick-crimson",
    name: "Luxury Lipstick - Crimson",
    price: 2500,
    description: "A bold crimson lipstick with a flawless matte finish.",
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600"], // Use unsplash placeholders
    categoryName: "Makeup",
    isFeatured: false,
  },
  {
    slug: "silk-eye-shadow-palette",
    name: "Silk Eye Shadow Palette",
    price: 3500,
    description: "A versatile palette with silky smooth eyeshadows.",
    images: ["https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600"],
    categoryName: "Makeup",
    isFeatured: false,
  },
  {
    slug: "foundation-porcelain",
    name: "Foundation - Porcelain",
    price: 2800,
    description: "Flawless coverage foundation for porcelain skin tones.",
    images: ["https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600"],
    categoryName: "Makeup",
    isFeatured: false,
  },
  {
    slug: "shimmer-setting-powder",
    name: "Shimmer Setting Powder",
    price: 1800,
    description: "Set your makeup with a hint of shimmer.",
    images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600"],
    categoryName: "Makeup",
    isFeatured: false,
  }
];

export async function GET() {
  try {
    await connectToDatabase();
    console.log("Connected to DB, starting seed...");

    const createdProducts = [];
    
    for (const prod of productsToSeed) {
      // Find or create category
      let category = await Category.findOne({ name: prod.categoryName });
      if (!category) {
        category = await Category.create({
          name: prod.categoryName,
          slug: prod.categoryName.toLowerCase().replace(" ", "-"),
          description: "Default description",
          image: "https://via.placeholder.com/150",
          status: "active"
        });
      }

      // Check if product exists
      const exists = await Product.findOne({ slug: prod.slug });
      if (!exists) {
        const newProd = await Product.create({
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          category: category._id,
          price: prod.price,
          discountPrice: prod.discountPrice,
          discountBadge: prod.discountBadge,
          images: prod.images,
          stock: 50,
          inStock: true,
          isFeatured: prod.isFeatured,
          features: ["Paraben free", "Cruelty free"],
          rating: 5,
          reviewsCount: 12
        });
        createdProducts.push(newProd);
      }
    }

    return NextResponse.json({ success: true, created: createdProducts.length, createdProducts });
  } catch (error: any) {
    console.error("Seeding failed", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
