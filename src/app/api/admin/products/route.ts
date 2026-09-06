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

    // Extract data
    const rawData = {
      name: formData.get("name") as string || "",
      description: formData.get("description") as string || "",
      category: formData.get("category") as string || "",
      slug: formData.get("slug") as string || "",
      price: formData.get("price"),
      stock: formData.get("stock"),
      isFeatured: formData.get("isFeatured") === "true",
      rating: formData.get("rating") || 0,
      reviewsCount: formData.get("reviewsCount") || 0,
      discountPrice: formData.has("discountPrice") ? formData.get("discountPrice") : undefined,
      discountBadge: formData.get("discountBadge") as string || "",
    };

    // Validate with Zod
    const { productSchema } = await import("@/lib/validations");
    const validatedData = productSchema.safeParse(rawData);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors[0].message },
        { status: 400 }
      );
    }

    let { name, description, category, slug, price, stock, isFeatured, rating, reviewsCount, discountPrice, discountBadge } = validatedData.data;

    // Sanitize basic text fields
    name = DOMPurify.sanitize(name);
    description = DOMPurify.sanitize(description);
    category = DOMPurify.sanitize(category);
    slug = slug ? DOMPurify.sanitize(slug) : "";
    discountBadge = discountBadge ? DOMPurify.sanitize(discountBadge) : undefined;

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
    if (imageFiles.length > 5) {
      return NextResponse.json(
        { error: "Maximum of 5 images allowed per product" },
        { status: 400 }
      );
    }

    const uploadedImages: string[] = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadBufferToCloudinary(
        buffer,
        `img_${i + 1}`,
        `products/${slug}`
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
