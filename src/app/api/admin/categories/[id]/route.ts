import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { Category } from "@/models/Category";
import { UTApi } from "uploadthing/server";

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const params = await props.params;
    const { id } = params;

    const category = await Category.findById(id);
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    // Optional: Also delete the image from uploadthing if it exists
    if (category.image && category.image.includes("uploadthing")) {
      const utapi = new UTApi();
      const fileKey = category.image.split('/').pop();
      if (fileKey) await utapi.deleteFiles(fileKey);
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Category Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete category" }, { status: 500 });
  }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const params = await props.params;
    const { id } = params;

    const body = await req.json();
    const { name, slug, description, image } = body;

    const category = await Category.findById(id);
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    category.name = name || category.name;
    category.slug = slug || category.slug;
    category.description = description !== undefined ? description : category.description;
    category.image = image !== undefined ? image : category.image;

    await category.save();

    return NextResponse.json({ message: "Category updated successfully", category });
  } catch (error: any) {
    console.error("PUT Category Error:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to update category" }, { status: 500 });
  }
}
