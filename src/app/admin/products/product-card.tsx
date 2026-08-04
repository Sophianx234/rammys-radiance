"use client";

import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Edit,
  Eye,
  MessageCircle,
  Pencil,
  Star,
  Tag,
  Trash2
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import ImageSlider from "./image-slider";

export function ProductCard({ product, index }) {
  const [open, setOpen] = useState(false);

  const stockClass =
    product.stock > 10
      ? "text-[#5B7763]"
      : product.stock > 0
      ? "text-orange-500"
      : "text-red-500";

  const router = useRouter();

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Delete Product?",
      text: `Are you sure you want to delete "${product.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#222222",
      cancelButtonColor: "#737373",
      confirmButtonText: "Yes, delete it",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      Swal.fire({
        title: "Deleted!",
        text: "The product has been removed.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      router.refresh(); 
    } catch (err) {
      Swal.fire("Error", "Could not delete product", "error");
    }
  };

  return (
    <>
      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="h-full"
      >
        <div className="bg-white rounded-none pb-5 border border-border/40 hover:border-[#5B7763]/40 transition-all duration-300 shadow-none overflow-hidden h-full flex flex-col group cursor-default">
          
          {/* IMAGE */}
          <div className="relative w-full h-64 bg-secondary/50 overflow-hidden">
            <Image
              src={product.images[0] || "/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Overlay Buttons */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity justify-end flex pt-3 pr-3 gap-2">
              <div className="flex flex-col gap-2">
                <button
                  className="w-8 h-8 bg-white flex items-center justify-center border border-border/40 text-text-muted hover:text-[#5B7763] hover:border-[#5B7763] transition-colors shadow-sm"
                  title="View Details"
                  onClick={() => setOpen(true)}
                >
                  <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
                <button
                  className="w-8 h-8 bg-white flex items-center justify-center border border-border/40 text-text-muted hover:text-[#5B7763] hover:border-[#5B7763] transition-colors shadow-sm"
                  title="Edit Product"
                  onClick={() => router.push(`products/edit/${product._id}`)}
                >
                  <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
                <button
                  className="w-8 h-8 bg-white flex items-center justify-center border border-border/40 text-text-muted hover:text-red-600 hover:border-red-600 transition-colors shadow-sm"
                  onClick={handleDelete}
                  title="Delete Product"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {product.isFeatured && (
              <div className="absolute top-3 left-3 bg-[#5B7763] text-white uppercase tracking-widest font-bold text-[9px] px-3 py-1 flex items-center shadow-sm">
                <Star className="w-2.5 h-2.5 mr-1.5 fill-white" /> Featured
              </div>
            )}
          </div>

          {/* CONTENT */}
          <CardContent className="p-5 flex flex-col justify-between flex-grow">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center text-[9px] uppercase tracking-widest font-bold text-text-muted">
                  <Tag className="w-3 h-3 mr-1.5" strokeWidth={1.5} />{" "}
                  {product.category?.name || "Uncategorized"}
                </div>

                {product.rating > 0 && (
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold">
                    <span className="text-[#222222]">
                      {product.rating.toFixed(1)}
                    </span>
                    <Star className="w-3 h-3 text-[#5B7763] fill-[#5B7763]" />
                    <span className="text-text-muted flex items-center gap-1 ml-1">
                      ({product.reviewsCount})
                    </span>
                  </div>
                )}
              </div>

              <h3 className="text-[14px] font-bold text-[#222222] tracking-wide leading-snug line-clamp-2">
                {product.name}
              </h3>

              <p className="text-[12px] text-text-muted line-clamp-2 min-h-[36px] leading-relaxed">
                {product.description || "No description available."}
              </p>

              <p className="text-[16px] font-bold text-[#5B7763] mt-2">
                ₵{(product.price / 100).toFixed(2)}
              </p>
            </div>

            <div className="pt-4 mt-auto border-t border-border/40 flex items-center justify-between text-[11px] uppercase tracking-wider font-bold">
              <span className="text-text-muted">
                Stock:
                <span className={`ml-2 ${stockClass}`}>
                  {product.stock}
                </span>
              </span>
              <div
                className={`px-2.5 py-1 ${
                  product.inStock
                    ? "bg-[#5B7763]/10 text-[#5B7763]"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </div>
            </div>
          </CardContent>
        </div>
      </motion.div>

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-xl max-h-[90vh] overflow-y-auto bg-white border-border/40 text-[#222222] rounded-none shadow-2xl p-0 custom-scrollbar"
        >
          <div className="p-6 pb-2 border-b border-border/40">
            <DialogHeader>
              <DialogTitle className="text-[18px] uppercase tracking-widest font-bold">{product.name}</DialogTitle>
              <DialogDescription className="text-[12px] text-text-muted uppercase tracking-wider font-medium">
                Product Details
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6">
            <ImageSlider images={product.images} />

            <p className="text-[13px] text-text-muted leading-relaxed">{product.description}</p>

            <div className="flex justify-between text-[12px] uppercase tracking-wider font-bold border-t border-border/40 pt-4">
              <p><span className="text-text-muted mr-2">Category:</span> {product.category?.name || "Uncategorized"}</p>
              <p><span className="text-text-muted mr-2">Price:</span> ₵{(product.price / 100).toFixed(2)}</p>
            </div>

            <div className="flex justify-between text-[12px] uppercase tracking-wider font-bold border-t border-border/40 pt-4">
              <p><span className="text-text-muted mr-2">Stock:</span> {product.stock}</p>
              <p><span className="text-text-muted mr-2">Rating:</span> ⭐ {product.rating} ({product.reviewsCount})</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
