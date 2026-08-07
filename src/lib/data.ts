import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/connectDB";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { cache } from "react";

interface GetProductsOptions {
  category?: string;
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  discounted?: boolean;
}

export const getProducts = cache(async (options: GetProductsOptions = {}) => {
  await connectToDatabase();

  const {
    category,
    sortBy = "featured",
    minPrice,
    maxPrice,
    search,
    page = 1,
    limit = 12,
    discounted,
  } = options;

  const filter: any = { inStock: true };

  // Category filter
  if (category && category !== "all") {
    if (mongoose.isValidObjectId(category)) {
      filter.category = category;
    } else {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      } else {
        filter.category = new mongoose.Types.ObjectId();
      }
    }
  }

  // Price range filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = minPrice;
    if (maxPrice) filter.price.$lte = maxPrice;
  }

  // Discounted filter
  if (discounted) {
    filter.discountPrice = { $exists: true, $ne: null, $gt: 0 };
  }

  // Search filter
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Build sort query
  let sort: any = {};
  switch (sortBy) {
    case "price-low":
      sort = { price: 1 };
      break;
    case "price-high":
      sort = { price: -1 };
      break;
    case "rating":
      sort = { rating: -1 };
      break;
    case "newest":
      sort = { createdAt: -1 };
      break;
    default:
      sort = { isFeatured: -1, createdAt: -1 };
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  // Serialize ObjectIds for React Server Components
  const serializedProducts = products.map((product: any) => ({
    ...product,
    _id: product._id.toString(),
    category: product.category
      ? {
          ...product.category,
          _id: product.category._id.toString(),
        }
      : null,
    createdAt: product.createdAt?.toISOString(),
    updatedAt: product.updatedAt?.toISOString(),
  }));

  return {
    products: serializedProducts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
});

export const getCategories = cache(async () => {
  await connectToDatabase();
  
  const categories = await Category.find().lean();
  
  // Aggregate product counts per category
  const productCounts = await Product.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]);
  
  const countMap = new Map(productCounts.map(c => [c._id?.toString(), c.count]));
  
  return categories.map((cat: any) => ({
    ...cat,
    _id: cat._id.toString(),
    createdAt: cat.createdAt?.toISOString(),
    updatedAt: cat.updatedAt?.toISOString(),
    productCount: countMap.get(cat._id.toString()) || 0
  }));
});
