"use client";

import { useState, useEffect, useCallback, use } from "react";
import { z } from "zod";
import Swal from "sweetalert2";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { ArrowLeft, UploadCloud, X, Save } from "lucide-react";
import Link from "next/link";
import { GridLoader } from "react-spinners";

// Validation schema
const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").optional(),
  description: z.string().min(10, "Description is too short"),
  price: z.number().positive("Price must be positive"),
  discountPrice: z.number().min(0).optional(),
  discountBadge: z.string().optional(),
  stock: z.number().min(0, "Stock cannot be negative"),
  rating: z.number().min(0).max(5).optional(),
  reviewsCount: z.number().min(0).optional(),
  features: z.array(z.string()).optional(),
  category: z.string().min(1, "Category is required"),
  variants: z
    .array(z.object({ name: z.string(), options: z.array(z.string().min(1)) }))
    .optional(),
  isFeatured: z.boolean().optional(),
});

interface ICategoryOption {
  _id: string;
  name: string;
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [categories, setCategories] = useState<ICategoryOption[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  // Separate state for images
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [product, setProduct] = useState({
    name: "",
    slug: "",
    description: "",
    price: 1,
    discountPrice: 0,
    discountBadge: "",
    stock: 1,
    rating: 0,
    reviewsCount: 0,
    features: [] as string[],
    category: "",
    variants: [] as { name: string; options: string[] }[],
    isFeatured: false,
  });

  const MAX_IMAGES = 5;

  const [newFeature, setNewFeature] = useState("");
  const [variantName, setVariantName] = useState("");
  const [variantOptions, setVariantOptions] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetch("/api/admin/categories");
        if (!catRes.ok) throw new Error("Failed to fetch categories");
        setCategories(await catRes.json());

        const prodRes = await fetch(`/api/admin/products/${id}`);
        if (!prodRes.ok) throw new Error("Product not found");
        const data = await prodRes.json();

        setProduct({
          name: data.name || "",
          slug: data.slug || "",
          description: data.description || "",
          price: data.price || 0,
          discountPrice: data.discountPrice || 0,
          discountBadge: data.discountBadge || "",
          stock: data.stock || 0,
          rating: data.rating || 0,
          reviewsCount: data.reviewsCount || 0,
          features: data.features || [],
          category: data.category?._id || data.category || "",
          variants: data.variants || [],
          isFeatured: data.isFeatured || false,
        });

        if (data.slug) {
          setIsSlugManuallyEdited(true); // Don't auto-override existing slug on edit
        }

        setExistingImages(data.images || []);
      } catch (e) {
        console.error(e);
        Swal.fire("Error", "Failed loading product.", "error");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [id]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const total = existingImages.length + newImages.length;
      if (total >= MAX_IMAGES) {
        Swal.fire({
          title: "LIMIT REACHED",
          text: "Maximum of 5 images allowed.",
          icon: "warning",
          toast: true,
          position: "bottom-right",
          showConfirmButton: false,
          timer: 3000,
          customClass: {
            popup: "rounded-none border border-border/40 bg-white",
            title: "text-[12px] uppercase tracking-wider font-bold text-[#222222]",
          }
        });
        return;
      }
      const allowedSlots = MAX_IMAGES - total;
      const filesToAdd = acceptedFiles.slice(0, allowedSlots);
      const previewURLs = filesToAdd.map((f) => URL.createObjectURL(f));

      setNewImages((prev) => [...prev, ...filesToAdd]);
      setNewPreviews((prev) => [...prev, ...previewURLs]);
    },
    [existingImages, newImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const removeNewImage = (idx: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((x) => x !== url));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setProduct((p) => ({
        ...p,
        features: [...p.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const handleAddVariant = () => {
    if (variantName.trim() && variantOptions.trim()) {
      setProduct((p) => ({
        ...p,
        variants: [
          ...p.variants,
          {
            name: variantName.trim(),
            options: variantOptions
              .split(",")
              .map((o) => o.trim())
              .filter(Boolean),
          },
        ],
      }));
      setVariantName("");
      setVariantOptions("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (existingImages.length + newImages.length === 0) {
      return setErrors({ images: "At least 1 image is required." });
    }

    try {
      const validated = productSchema.parse({
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
      });

      setLoading(true);

      const form = new FormData();
      form.append("name", validated.name);
      if (validated.slug) form.append("slug", validated.slug);
      form.append("description", validated.description);
      form.append("price", String(validated.price));
      if (validated.discountPrice) form.append("discountPrice", String(validated.discountPrice));
      if (validated.discountBadge) form.append("discountBadge", validated.discountBadge);
      form.append("stock", String(validated.stock));
      form.append("category", validated.category);
      form.append("rating", String(validated.rating || 0));
      form.append("reviewsCount", String(validated.reviewsCount || 0));
      form.append("isFeatured", String(validated.isFeatured ?? false));

      validated.features?.forEach((f) => form.append("features[]", f));

      validated.variants?.forEach((v, idx) => {
        form.append(`variants[${idx}][name]`, v.name);
        v.options.forEach((opt) =>
          form.append(`variants[${idx}][options][]`, opt)
        );
      });

      existingImages.forEach((url) => form.append("existingImages[]", url));
      newImages.forEach((file) => form.append("newImages", file));

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        body: form,
      });

      if (!res.ok) throw new Error("Failed to update product");

      Swal.fire({
        title: "SUCCESS",
        text: "Product updated successfully.",
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

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) fieldErrors[e.path[0] as string] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        Swal.fire({
          title: "ERROR",
          text: err.message,
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

  if (loadingData) {
    return (
      <div className="absolute sm:relative flex inset-0 sm:h-dvh items-center justify-center">
        <GridLoader size={18} color="#5B7763" />
      </div>
    );
  }

  const mergedImages = [
    ...existingImages.map((url) => ({ type: "existing", url })),
    ...newPreviews.map((url, idx) => ({ type: "new", url, idx })),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 space-y-8 pb-20 max-w-5xl mx-auto"
    >
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="w-9 h-9 flex items-center justify-center border border-border/40 text-text-muted hover:text-[#222222] hover:bg-secondary/50 transition-colors bg-white">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          </Link>
          <div>
            <h2 className="text-[18px] uppercase tracking-widest font-bold text-[#222222]">Edit Product</h2>
            <p className="text-[12px] text-text-muted mt-1 tracking-wider font-medium">
              Update existing product details
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white px-6 py-3 text-[11px] uppercase tracking-wider font-bold hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Save className="w-3.5 h-3.5" /> {loading ? "Updating..." : "Update Product"}
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* LEFT COLUMN - MAIN DETAILS */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* GENERAL INFORMATION */}
          <div className="bg-white border border-border/40 p-6 md:p-8">
            <h3 className="text-[14px] uppercase tracking-widest font-bold text-[#222222] mb-6 border-b border-border/40 pb-4">General Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-2">Product Name</label>
                <Input
                  type="text"
                  value={product.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setProduct((prev) => ({
                      ...prev,
                      name: newName,
                      slug: isSlugManuallyEdited ? prev.slug : newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                    }));
                  }}
                  placeholder="e.g. Shield Conditioner"
                  className="bg-secondary/20 border-border/40 text-[13px] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] text-[#222222] h-12"
                />
                {errors.name && <p className="text-red-600 text-[10px] uppercase tracking-wider font-bold mt-1.5">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-2">URL Slug</label>
                <Input
                  type="text"
                  value={product.slug}
                  onChange={(e) => {
                    setIsSlugManuallyEdited(true);
                    setProduct({ ...product, slug: e.target.value.toLowerCase().replace(/[^a-z0-9\-]+/g, '-') });
                  }}
                  placeholder="e.g. shield-conditioner"
                  className="bg-secondary/20 border-border/40 text-[13px] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] text-[#222222] h-12"
                />
                <p className="text-[10px] text-text-muted mt-2 tracking-wider font-medium">Auto-generated from name.</p>
                {errors.slug && <p className="text-red-600 text-[10px] uppercase tracking-wider font-bold mt-1.5">{errors.slug}</p>}
              </div>

              <div>
                 <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-2">Category</label>
                 <Select value={product.category} onValueChange={(val) => setProduct({ ...product, category: val })}>
                   <SelectTrigger className="w-full bg-secondary/20 border-border/40 text-[13px] text-[#222222] h-12 rounded-none focus:ring-0 focus:border-[#5B7763]">
                     <SelectValue placeholder="Select a category" />
                   </SelectTrigger>
                   <SelectContent className="rounded-none border-border/40">
                     {categories.map((c) => (
                       <SelectItem key={c._id} value={c._id} className="text-[13px]">
                         {c.name}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
                 <p className="text-[10px] text-text-muted mt-2 tracking-wider font-medium">Appears above the product title.</p>
                 {errors.category && <p className="text-red-600 text-[10px] uppercase tracking-wider font-bold mt-1.5">{errors.category}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-2">Price (₵)</label>
                    <Input
                      type="number"
                      min={0}
                      value={product.price}
                      onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                      className="bg-secondary/20 border-border/40 text-[13px] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] text-[#5B7763] font-bold h-12"
                    />
                    <p className="text-[10px] text-text-muted mt-2 tracking-wider font-medium">The selling price.</p>
                    {errors.price && <p className="text-red-600 text-[10px] uppercase tracking-wider font-bold mt-1.5">{errors.price}</p>}
                 </div>
                 
                 <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-2">Old Price (₵)</label>
                    <Input
                      type="number"
                      min={0}
                      value={product.discountPrice || ""}
                      onChange={(e) => setProduct({ ...product, discountPrice: e.target.value ? Number(e.target.value) : 0 })}
                      className="bg-secondary/20 border-border/40 text-[13px] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] text-text-muted h-12"
                      placeholder="Optional"
                    />
                    <p className="text-[10px] text-text-muted mt-2 tracking-wider font-medium">Crossed out price.</p>
                    {errors.discountPrice && <p className="text-red-600 text-[10px] uppercase tracking-wider font-bold mt-1.5">{errors.discountPrice}</p>}
                 </div>
              </div>
              
              <div className="md:col-span-2">
                 <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-2">Discount Badge Text</label>
                 <Input
                   type="text"
                   value={product.discountBadge}
                   onChange={(e) => setProduct({ ...product, discountBadge: e.target.value })}
                   className="bg-secondary/20 border-border/40 text-[13px] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] text-[#222222] h-12"
                   placeholder="e.g. SALE or -20%"
                 />
                 <p className="text-[10px] text-text-muted mt-2 tracking-wider font-medium">Appears as a badge on the top left of the product image.</p>
                 {errors.discountBadge && <p className="text-red-600 text-[10px] uppercase tracking-wider font-bold mt-1.5">{errors.discountBadge}</p>}
              </div>
            </div>
          </div>

          {/* PRODUCT DETAILS */}
          <div className="bg-white border border-border/40 p-6 md:p-8">
            <h3 className="text-[14px] uppercase tracking-widest font-bold text-[#222222] mb-6 border-b border-border/40 pb-4">Product Details</h3>
            
            <div className="space-y-8">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-2">Main Description</label>
                <Textarea
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  placeholder="Experience a new era of effortless confidence..."
                  className="bg-secondary/20 border-border/40 text-[13px] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] text-[#222222] min-h-[140px] resize-y p-4"
                />
                <p className="text-[10px] text-text-muted mt-2 tracking-wider font-medium">This text is displayed right below the price and rating.</p>
                {errors.description && <p className="text-red-600 text-[10px] uppercase tracking-wider font-bold mt-1.5">{errors.description}</p>}
              </div>

              <div className="pt-6 border-t border-border/40">
                <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-2">Key Features (Bullet Points)</label>
                <p className="text-[10px] text-text-muted mb-4 tracking-wider font-medium">These appear as bullet points in the "Key Features" accordion.</p>
                
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="e.g. Formulated for all skin types..."
                    className="bg-secondary/20 border-border/40 text-[13px] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] text-[#222222] h-12 flex-1"
                  />
                  <button type="button" onClick={handleAddFeature} className="bg-secondary/50 text-[#222222] border border-border/40 px-8 text-[11px] uppercase tracking-wider font-bold hover:bg-secondary transition-colors h-12 shrink-0">
                    Add Feature
                  </button>
                </div>

                {product.features.length > 0 ? (
                  <ul className="space-y-2 bg-secondary/10 p-4 border border-border/40">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 justify-between group">
                        <div className="flex items-start gap-3">
                           <span className="w-1 h-1 rounded-full bg-[#5B7763] mt-2 shrink-0" />
                           <span className="text-[13px] text-text-muted leading-relaxed">{f}</span>
                        </div>
                        <button type="button" onClick={() => setProduct(p => ({ ...p, features: p.features.filter((_, idx) => idx !== i) }))} className="text-text-muted hover:text-red-600 transition-colors p-1">
                          <X className="w-3.5 h-3.5" strokeWidth={2} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="bg-secondary/10 p-4 border border-border/40 text-[12px] text-text-muted italic">
                    No features added yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MEDIA */}
          <div className="bg-white border border-border/40 p-6 md:p-8">
             <h3 className="text-[14px] uppercase tracking-widest font-bold text-[#222222] mb-6 border-b border-border/40 pb-4">Product Images</h3>
             <p className="text-[10px] text-text-muted mb-4 tracking-wider font-medium">These images appear in the sticky slider on the left side of the product page.</p>

             {mergedImages.length < MAX_IMAGES ? (
               <div
                {...getRootProps()}
                className={`p-12 border-2 border-dashed rounded-none text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-[#5B7763] bg-[#5B7763]/5" : "border-border/40 hover:border-[#5B7763]/50 bg-secondary/10"
                }`}
               >
                 <input {...getInputProps()} />
                 <UploadCloud className="w-10 h-10 text-text-muted mx-auto mb-4" strokeWidth={1.5} />
                 <p className="text-[13px] text-[#222222] font-bold uppercase tracking-wider">Drag & drop images here</p>
                 <p className="text-[11px] uppercase tracking-wider text-text-muted mt-2">or click to browse (max {MAX_IMAGES} images)</p>
               </div>
             ) : (
               <div className="p-4 border border-border/40 bg-secondary/10 text-center">
                 <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Maximum of {MAX_IMAGES} images reached.</p>
               </div>
             )}
             
             {errors.images && <p className="text-red-600 text-[10px] uppercase tracking-wider font-bold mt-2">{errors.images}</p>}

             {mergedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                 {mergedImages.map((img, idx) => (
                  <div key={idx} className="relative group aspect-[4/5] border border-border/40 bg-secondary">
                    <img src={img.url} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        img.type === "existing"
                          ? removeExistingImage(img.url)
                          : removeNewImage(img.idx!)
                      }
                      className="absolute top-2 right-2 w-8 h-8 bg-white border border-border/40 flex items-center justify-center text-text-muted hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    >
                      <X className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    {img.type === "new" && (
                      <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-0.5 text-[9px] uppercase tracking-widest font-bold border border-border/40">
                        New
                      </div>
                    )}
                  </div>
                ))}
              </div>
             )}
          </div>
        </div>

        {/* RIGHT COLUMN - INVENTORY & VISIBILITY */}
        <div className="space-y-8">
          
          {/* INVENTORY & VARIANTS */}
          <div className="bg-white border border-border/40 p-6 md:p-8">
             <h3 className="text-[14px] uppercase tracking-widest font-bold text-[#222222] mb-6 border-b border-border/40 pb-4">Inventory & Options</h3>
             
             <div className="space-y-6">
               <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-2">Available Stock</label>
                  <Input
                    type="number"
                    min={0}
                    value={product.stock}
                    onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
                    className="bg-secondary/20 border-border/40 text-[13px] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] text-[#222222] h-12"
                  />
                  <p className="text-[10px] text-text-muted mt-2 tracking-wider font-medium">Determines the "In Stock" or "Out of Stock" status.</p>
                  {errors.stock && <p className="text-red-600 text-[10px] uppercase tracking-wider font-bold mt-1.5">{errors.stock}</p>}
               </div>
               
               <div className="pt-6 border-t border-border/40">
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-2">Product Variants</label>
                  <p className="text-[10px] text-text-muted mb-4 tracking-wider font-medium">Add options like Size (e.g. 50ml, 100ml) or Color.</p>
                  
                  <div className="flex flex-col gap-3 mb-5">
                    <Input
                      value={variantName}
                      onChange={(e) => setVariantName(e.target.value)}
                      placeholder="Variant (e.g. Size)"
                      className="bg-secondary/20 border-border/40 text-[12px] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] text-[#222222] h-10 w-full"
                    />
                    <Input
                      value={variantOptions}
                      onChange={(e) => setVariantOptions(e.target.value)}
                      placeholder="Options (comma separated)"
                      className="bg-secondary/20 border-border/40 text-[12px] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] text-[#222222] h-10 w-full"
                    />
                    <button type="button" onClick={handleAddVariant} className="bg-secondary/50 text-[#222222] border border-border/40 w-full py-2.5 text-[11px] uppercase tracking-wider font-bold hover:bg-secondary transition-colors">
                      Add Variant
                    </button>
                  </div>

                   {product.variants.length > 0 ? (
                    <div className="space-y-2">
                      {product.variants.map((v, i) => (
                        <div key={i} className="bg-secondary/10 border border-border/40 p-3 flex justify-between items-start gap-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-bold text-[#222222] uppercase tracking-wider">{v.name}</span>
                            <span className="text-[11px] text-text-muted">{v.options.join(", ")}</span>
                          </div>
                          <button type="button" onClick={() => setProduct(p => ({ ...p, variants: p.variants.filter((_, idx) => idx !== i) }))} className="text-text-muted hover:text-red-600 transition-colors p-1">
                            <X className="w-3.5 h-3.5" strokeWidth={2} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-secondary/10 p-3 border border-border/40 text-[11px] text-text-muted italic">
                      No variants added.
                    </div>
                  )}
               </div>
             </div>
          </div>

          {/* VISIBILITY & SOCIAL PROOF */}
          <div className="bg-white border border-border/40 p-6 md:p-8">
             <h3 className="text-[14px] uppercase tracking-widest font-bold text-[#222222] mb-6 border-b border-border/40 pb-4">Visibility & Social Proof</h3>
             
             <div className="space-y-6">
               <div className="flex items-start gap-4 p-4 border border-border/40 bg-secondary/10">
                 <Checkbox
                   id="isFeatured"
                   checked={product.isFeatured}
                   onCheckedChange={(checked) => setProduct({ ...product, isFeatured: Boolean(checked) })}
                   className="rounded-none border-border/40 data-[state=checked]:bg-[#5B7763] data-[state=checked]:border-[#5B7763] mt-0.5 w-5 h-5 bg-white"
                 />
                 <div className="grid gap-2 leading-none">
                    <label
                      htmlFor="isFeatured"
                      className="text-[12px] font-bold text-[#222222] uppercase tracking-wider leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Featured Product
                    </label>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      Select to highlight this product on the storefront homepage cards.
                    </p>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4 pt-2">
                 <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-2">Base Rating</label>
                    <Input
                      type="number"
                      min={0}
                      max={5}
                      step={0.1}
                      value={product.rating}
                      onChange={(e) => setProduct({ ...product, rating: Number(e.target.value) })}
                      className="bg-secondary/20 border-border/40 text-[13px] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] text-[#222222] h-12"
                    />
                    <p className="text-[10px] text-text-muted mt-2 tracking-wider font-medium">Shown on cards (0-5).</p>
                    {errors.rating && <p className="text-red-600 text-[10px] uppercase tracking-wider font-bold mt-1.5">{errors.rating}</p>}
                 </div>
                 <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-2">Review Count</label>
                    <Input
                      type="number"
                      min={0}
                      value={product.reviewsCount}
                      onChange={(e) => setProduct({ ...product, reviewsCount: Number(e.target.value) })}
                      className="bg-secondary/20 border-border/40 text-[13px] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] text-[#222222] h-12"
                    />
                    <p className="text-[10px] text-text-muted mt-2 tracking-wider font-medium">Initial review number.</p>
                    {errors.reviewsCount && <p className="text-red-600 text-[10px] uppercase tracking-wider font-bold mt-1.5">{errors.reviewsCount}</p>}
                 </div>
               </div>
             </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
