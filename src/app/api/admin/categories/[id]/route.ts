import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/connectDB";
import { Category } from "@/models/Category";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const params = await props.params;
    const { id } = params;

    const category = await Category.findById(id);
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    // Optional: we can delete from cloudinary here if we store public_id, but it's safe to skip for now to fix build.

    await Category.findByIdAndDelete(id);

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Category Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const params = await props.params;
    const { id } = params;

    const category = await Category.findById(id);
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    const formData = await req.formData();
    const name = formData.get("name") as string | null;
    const slug = formData.get("slug") as string | null;
    const description = formData.get("description") as string | null;
    const imageFile = formData.get("image") as File | null;

    if (name) category.name = name;
    if (slug) category.slug = slug;
    if (description !== null) category.description = description;

    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const result = await uploadBufferToCloudinary(buffer, undefined, "categories");
      category.image = result.secure_url;
    }

    await category.save();

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");

    return NextResponse.json({ message: "Category updated successfully", category });
  } catch (error: any) {
    console.error("PUT Category Error:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to update category" }, { status: 500 });
  }
}
