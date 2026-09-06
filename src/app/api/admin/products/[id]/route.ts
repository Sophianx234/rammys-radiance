export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/connectDB";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { uploadBufferToCloudinary, deleteFolderFromCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();

    const { id } = await params;
    let product;

    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      product = await Product.findById(id).populate("category").lean();
    } else {
      product = await Product.findOne({ slug: id }).populate("category").lean();
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching product:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const product = await Product.findById(id);
    if (product) {
      try {
        await deleteFolderFromCloudinary(`rammysradiance/products/${product.slug}`);
      } catch (e) {
        console.warn("Failed to delete product folder from Cloudinary:", e);
      }
    }

    await Product.findByIdAndDelete(id);

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const formData = await req.formData();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // ---------- BASIC FIELDS ----------
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const category = formData.get("category") as string;
    const isFeatured = formData.get("isFeatured") === "true";

    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ---------- FEATURES ----------
    const features = formData.getAll("features[]") as string[];

    // ---------- VARIANTS ----------
    const variants: { name: string; options: string[] }[] = [];
    const variantIndexes = new Set<number>();

    // detect indexes
    for (const key of formData.keys()) {
      const m = key.match(/variants\[(\d+)\]\[name\]/);
      if (m) variantIndexes.add(Number(m[1]));
    }

    // build objects
    variantIndexes.forEach((i) => {
      const vName = formData.get(`variants[${i}][name]`) as string;
      const vOptions = formData.getAll(
        `variants[${i}][options][]`
      ) as string[];

      if (vName && vOptions.length > 0) {
        variants.push({
          name: vName,
          options: vOptions,
        });
      }
    });

    // ---------- IMAGES (Limit to 5) ----------
    const existingImages = formData.getAll("existingImages[]") as string[];
    const newImageFiles = formData.getAll("newImages") as File[];
    
    if (existingImages.length + newImageFiles.length === 0) {
      return NextResponse.json({ error: "Product must have at least one image." }, { status: 400 });
    }
    if (existingImages.length + newImageFiles.length > 5) {
      return NextResponse.json({ error: "Maximum of 5 images allowed per product." }, { status: 400 });
    }

    // --- GARBAGE COLLECTION ---
    // If an image URL was in the DB but is no longer in the submitted existingImages[], delete it from Cloudinary
    const removedImages = product.images.filter((oldUrl: string) => !existingImages.includes(oldUrl));
    for (const url of removedImages) {
      const match = url.match(/rammysradiance\/products\/[^\/]+\/(img_\d+|[^\.]+)/);
      if (match) {
        try {
          await deleteFromCloudinary(match[0]);
        } catch (e) {
          console.warn("Failed to delete orphaned image:", match[0], e);
        }
      }
    }

    // Determine starting index for new images to avoid overwriting existing ones
    let maxIdx = 0;
    existingImages.forEach((url: string) => {
      const m = url.match(/img_(\d+)/);
      if (m && Number(m[1]) > maxIdx) maxIdx = Number(m[1]);
    });

    const uploadedNewImages: string[] = [];
    for (let i = 0; i < newImageFiles.length; i++) {
      const file = newImageFiles[i];
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResult = await uploadBufferToCloudinary(
        buffer,
        `img_${maxIdx + i + 1}`,
        `products/${product.slug}`
      );
      uploadedNewImages.push(uploadResult.secure_url);
    }

    const finalImages = [...existingImages, ...uploadedNewImages];

    // ---------- UPDATE PRODUCT ----------
    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        stock,
        inStock: stock > 0,
        category,
        features,
        variants,
        isFeatured,
        images: finalImages,
      },
      { new: true }
    );

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    console.error("Product update error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update product" },
      { status: 500 }
    );
  }
}
