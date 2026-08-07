"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, UploadCloud, X, Save } from "lucide-react";
import Link from "next/link";

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
});

type CategoryForm = z.infer<typeof categorySchema> & { image?: string; imageFile?: File | null };

export default function AddCategoryPage() {
  const [category, setCategory] = useState<CategoryForm>({
    name: "",
    slug: "",
    description: "",
    image: "",
    imageFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const slug = isSlugManuallyEdited 
      ? category.slug 
      : value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    setCategory({ ...category, name: value, slug });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    setCategory({ ...category, slug: e.target.value.toLowerCase().replace(/[^a-z0-9\-]+/g, '-') });
  };

  // Dropzone setup
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    const previewUrl = URL.createObjectURL(file);
    setCategory((prev) => ({ ...prev, image: previewUrl, imageFile: file }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = categorySchema.parse(category);
      setLoading(true);

      const formData = new FormData();
      formData.append("name", validated.name);
      formData.append("slug", validated.slug);
      if (validated.description) formData.append("description", validated.description);
      if (category.imageFile) formData.append("image", category.imageFile);

      const res = await fetch("/api/admin/categories", { method: "POST", body: formData });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to save category");
      }

      Swal.fire({
        title: "SUCCESS",
        text: "Category added successfully.",
        icon: "success",
        toast: true,
        position: "bottom-right",
        showConfirmButton: false,
        timer: 2500,
        customClass: {
          popup: "rounded-none border border-border/40 bg-white",
          title: "text-[12px] uppercase tracking-wider font-bold text-[#222222]",
        }
      });

      setCategory({ name: "", slug: "", description: "", image: "", imageFile: null });
      setIsSlugManuallyEdited(false);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        Swal.fire({
           title: "ERROR",
           text: err.errors[0]?.message || "Invalid input",
           icon: "error",
           toast: true,
           position: "bottom-right",
           showConfirmButton: false,
           timer: 3000,
           customClass: {
              popup: "rounded-none border border-border/40 bg-white",
              title: "text-[12px] uppercase tracking-wider font-bold text-[#222222]",
           }
        });
      } else {
        Swal.fire({
           title: "ERROR",
           text: err.message || "Something went wrong",
           icon: "error",
           toast: true,
           position: "bottom-right",
           showConfirmButton: false,
           timer: 3000,
           customClass: {
              popup: "rounded-none border border-border/40 bg-white",
              title: "text-[12px] uppercase tracking-wider font-bold text-[#222222]",
           }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 space-y-8 pb-20 max-w-4xl mx-auto"
    >
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="w-9 h-9 flex items-center justify-center border border-border/40 text-text-muted hover:text-[#222222] hover:bg-secondary/50 transition-colors bg-white">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          </Link>
          <div>
            <h2 className="text-[18px] uppercase tracking-widest font-bold text-[#222222]">Add New Category</h2>
            <p className="text-[12px] text-text-muted mt-1 uppercase tracking-wider font-medium">
              Organize your products into categories
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white px-6 py-3 text-[11px] uppercase tracking-wider font-bold hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Save className="w-3.5 h-3.5" /> {loading ? "Saving..." : "Save Category"}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* GENERAL INFORMATION */}
        <div className="bg-white border border-border/40 p-6 md:p-8 space-y-8 h-fit">
          <h3 className="text-[14px] uppercase tracking-widest font-bold text-[#222222] border-b border-border/40 pb-4">General Information</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-2">Category Name</label>
              <Input
                type="text"
                placeholder="e.g. Lipsticks"
                value={category.name}
                onChange={handleNameChange}
                className="bg-secondary/20 border-border/40 text-[13px] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] text-[#222222] h-12"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-2">URL Slug</label>
              <Input
                type="text"
                placeholder="e.g. lipsticks"
                value={category.slug}
                onChange={handleSlugChange}
                className="bg-secondary/20 border-border/40 text-[13px] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] text-text-muted h-12"
              />
              <p className="text-[10px] text-text-muted mt-2 tracking-wider font-medium">Auto-generated from name.</p>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-2">Description</label>
              <Textarea
                placeholder="Describe this category (optional)"
                value={category.description}
                onChange={(e) => setCategory({ ...category, description: e.target.value })}
                className="bg-secondary/20 border-border/40 text-[13px] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] text-[#222222] min-h-[140px] resize-y p-4"
              />
            </div>
          </div>
        </div>

        {/* MEDIA */}
        <div className="bg-white border border-border/40 p-6 md:p-8 h-fit">
           <h3 className="text-[14px] uppercase tracking-widest font-bold text-[#222222] mb-6 border-b border-border/40 pb-4">Category Image</h3>
           
           <div
            {...getRootProps()}
            className={`p-12 border-2 border-dashed rounded-none text-center cursor-pointer transition-colors ${
              isDragActive ? "border-[#5B7763] bg-[#5B7763]/5" : "border-border/40 hover:border-[#5B7763]/50 bg-secondary/10"
            }`}
           >
             <input {...getInputProps()} />
             <UploadCloud className="w-10 h-10 text-text-muted mx-auto mb-4" strokeWidth={1.5} />
             <p className="text-[13px] text-[#222222] font-bold uppercase tracking-wider">Drag & drop image here</p>
             <p className="text-[11px] uppercase tracking-wider text-text-muted mt-2">or click to browse (max 1 image)</p>
           </div>

           {category.image && (
            <div className="relative mt-6 aspect-[4/5] border border-border/40 bg-secondary group">
              <img src={category.image} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setCategory((p) => ({ ...p, image: "", imageFile: null }))}
                className="absolute top-2 right-2 w-8 h-8 bg-white border border-border/40 flex items-center justify-center text-text-muted hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
           )}
        </div>

      </div>
    </motion.div>
  );
}
