import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/connectDB";
import { Category } from "@/models/Category";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";
import { connect } from "http2";


export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find().sort({ name: 1 });

    return NextResponse.json(categories);
  } catch (err) {
    return NextResponse.json(
      { message: "Error fetching categories" },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;

    // ✅ Check if category already exists
    const existing = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }

    // ✅ Handle image upload
    let image: string | undefined;
    const imageFile = formData.get("image") as File;
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const result = await uploadBufferToCloudinary(buffer, undefined, "categories");
      image = result.secure_url;
    }

    // ✅ Save category
    const newCategory = new Category({ name, slug, description, image });
    await newCategory.save();
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");

    return NextResponse.json(newCategory, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}
