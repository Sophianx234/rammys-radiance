import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";

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

    await Product.findByIdAndDelete(id);

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

    // ---------- EXISTING IMAGES ----------
    const existingImages = formData.getAll("existingImages[]") as string[];

    // ---------- NEW IMAGE FILES ----------
    const newImageFiles = formData.getAll("newImages") as File[];

    const uploadedNewImages: string[] = [];

    // upload new images if provided
    for (const file of newImageFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResult = await uploadBufferToCloudinary(
        buffer,
        undefined,
        "products"
      );
      uploadedNewImages.push(uploadResult.secure_url);
    }

    // ---------- FINAL MERGED IMAGES ----------
    const finalImages = [...existingImages, ...uploadedNewImages];

    if (finalImages.length === 0) {
      return NextResponse.json(
        { error: "Product must have at least one image." },
        { status: 400 }
      );
    }

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

    if (!updated) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    console.error("Product update error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update product" },
      { status: 500 }
    );
  }
}
