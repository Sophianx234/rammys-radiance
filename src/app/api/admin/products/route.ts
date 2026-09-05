export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/connectDB";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";
import slugify from "slugify";
import  "@/models/Category";
import { Product } from "@/models/Product";
import { sendMailToAllUsers } from "@/lib/mail";
import { newProductAnnouncementEmail } from "@/lib/email-templates";
import { Category } from "@/models/Category";
import DOMPurify from "isomorphic-dompurify";
import { logActivity } from "@/lib/logger";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find().populate('category').sort({ createdAt: -1 }).lean();
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

    // Sanitize basic text fields
    const name = DOMPurify.sanitize(formData.get("name") as string || "");
    const description = DOMPurify.sanitize(formData.get("description") as string || "");
    const category = DOMPurify.sanitize(formData.get("category") as string || "");
    let slug = DOMPurify.sanitize(formData.get("slug") as string || "");

    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const isFeatured = formData.get("isFeatured") === "true";
    const rating = Number(formData.get("rating") || 0);
    const reviewsCount = Number(formData.get("reviewsCount") || 0);
    const discountPrice = formData.has("discountPrice") ? Number(formData.get("discountPrice")) : undefined;
    const discountBadge = formData.get("discountBadge") ? DOMPurify.sanitize(formData.get("discountBadge") as string) : undefined;

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

    // ----- FEATURES (Sanitize array elements) -----
    const rawFeatures = formData.getAll("features[]") as string[];
    const features = rawFeatures.map(f => DOMPurify.sanitize(f));

    // ----- VARIANTS -----
    const variants: { name: string; options: string[] }[] = [];
    const variantIndexes = new Set<number>();

    for (const key of formData.keys()) {
      const match = key.match(/variants\[(\d+)\]\[name\]/);
      if (match) variantIndexes.add(Number(match[1]));
    }

    variantIndexes.forEach((i) => {
      const variantName = DOMPurify.sanitize(formData.get(`variants[${i}][name]`) as string || "");
      const rawOptions = formData.getAll(`variants[${i}][options][]`) as string[];
      const options = rawOptions.map(opt => DOMPurify.sanitize(opt));

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

    // Logging the creation action securely
    const token = req.cookies.get("token")?.value;
    if (token) {
       try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
         await logActivity("Created Product", `Created product: ${newProduct.name}`, newProduct._id.toString());
       } catch (e) {
          console.error("Failed to decode token for logging");
       }
    }

    const productCategory = await Category.findById(newProduct.category);
    if(productCategory){
       const html = newProductAnnouncementEmail({
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price,
          image: uploadedImages[0], 
          url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${newProduct.slug}`,
          category: productCategory.name,
          features: newProduct.features || [],
        });

        await sendMailToAllUsers({
          subject: `New Product Added: ${newProduct.name}`,
          html,
          text: `${newProduct.name} - ${newProduct.description}`,
        });
    }

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
