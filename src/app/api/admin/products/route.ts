import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/connectDB";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";
import slugify from "slugify";
import  "@/models/Category";
import { Product } from "@/models/Product";
import { sendMail, sendMailToAllUsers } from "@/lib/mail";
import { User } from "@/models/User";
import { newProductAnnouncementEmail } from "@/lib/email-templates";
import { Category } from "@/models/Category";

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch all products, optionally sort by creation date descending
    const products = await Product.find().populate('category').sort({ createdAt: -1 })
      .lean(); // lean() converts to plain JS objects

    return NextResponse.json(products, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching products:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch products" },
      { status: 500 }
    );

  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();

    // ----- BASIC FIELDS -----
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const category = formData.get("category") as string;
    const isFeatured = formData.get("isFeatured") === "true";
    const rating = Number(formData.get("rating") || 0);
    const reviewsCount = Number(formData.get("reviewsCount") || 0);
    const discountPrice = formData.has("discountPrice") ? Number(formData.get("discountPrice")) : undefined;
    const discountBadge = formData.get("discountBadge") as string | undefined;
    let slug = formData.get("slug") as string;

    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ----- SLUG -----
    if (!slug) {
      slug = slugify(name, { lower: true }) + "-" + Date.now();
    } else {
      slug = slugify(slug, { lower: true });
    }

    // ----- FEATURES -----
    const features = formData.getAll("features[]") as string[];

    // ----- VARIANTS -----
    const variants: { name: string; options: string[] }[] = [];
    const variantIndexes = new Set<number>();

    // Detect variant indexes from keys like variants[0][name]
    for (const key of formData.keys()) {
      const match = key.match(/variants\[(\d+)\]\[name\]/);
      if (match) variantIndexes.add(Number(match[1]));
    }

    // Build variant objects
    variantIndexes.forEach((i) => {
      const variantName = formData.get(`variants[${i}][name]`) as string;
      const options = formData.getAll(`variants[${i}][options][]`) as string[];

      if (variantName && options.length > 0) {
        variants.push({
          name: variantName,
          options,
        });
      }
    });

    // ----- IMAGES -----
    const imageFiles = formData.getAll("images") as File[];
    if (!imageFiles.length) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    const uploadedImages: string[] = [];

    for (const file of imageFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadBufferToCloudinary(
        buffer,
        undefined,
        "products"
      );
      uploadedImages.push(result.secure_url);
    }

    // ----- SAVE PRODUCT -----
    const newProduct = await Product.create({
      name,
      slug,
      description,
      category,
      price,
      discountPrice,
      discountBadge,
      images: uploadedImages,
      features,
      stock,
      inStock: stock > 0,
      rating,
      reviewsCount,
      variants,
      isFeatured,
    });

    const productCategory = await Category.findById(newProduct.category)
    if(!productCategory){
      return NextResponse.json(
        { error: "cannot find product category" },
        { status: 500 }
      );
    }

   const html = newProductAnnouncementEmail({
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      image: uploadedImages[0], // first image as main product image
      url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${newProduct.slug}`,
      category: productCategory.name,
      features: newProduct.features || [],
    });

    await sendMailToAllUsers({
      subject: `New Product Added: ${newProduct.name}`,
      html,
      text: `${newProduct.name} - ${newProduct.description}`,
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err: any) {
    console.error("Product creation error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

