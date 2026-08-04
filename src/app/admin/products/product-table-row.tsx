"use client";

import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useState } from "react";
import { useDashStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableRow, TableCell } from "@/components/ui/table";
import { Eye, Pencil, Star, Trash2, MoreVertical } from "lucide-react";
import Image from "next/image";
import ImageSlider from "./image-slider";

export function ProductTableRow({ product }: { product: any }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user } = useDashStore();
  
  const stockClass =
    product.stock > 10
      ? "text-[#5B7763]"
      : product.stock > 0
      ? "text-orange-500"
      : "text-red-600";

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
      <TableRow className="border-border/40 hover:bg-secondary/20 transition-colors group">
        <TableCell className="py-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary border border-border/40 flex-shrink-0 relative overflow-hidden">
              <Image
                src={product.images?.[0] || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#222222] line-clamp-1 leading-snug">{product.name}</p>
              {product.isFeatured && (
                <span className="text-[9px] uppercase tracking-widest font-bold text-[#5B7763] mt-1 inline-flex items-center">
                  <Star className="w-2 h-2 mr-1 fill-[#5B7763]" /> Featured
                </span>
              )}
            </div>
          </div>
        </TableCell>

        <TableCell className="text-[12px] text-text-muted font-medium">
          {product.category?.name || "Uncategorized"}
        </TableCell>

        <TableCell className="text-[13px] font-bold text-[#5B7763]">
          ₵{(product.price / 100).toFixed(2)}
        </TableCell>

        <TableCell>
          <div className="flex flex-col gap-1.5">
             <span className={`text-[11px] font-bold ${stockClass}`}>{product.stock} in stock</span>
             <div className={`px-2 py-0.5 w-fit text-[9px] uppercase tracking-widest font-bold border ${product.inStock ? "border-[#5B7763]/20 bg-[#5B7763]/5 text-[#5B7763]" : "border-red-600/20 bg-red-50 text-red-600"}`}>
               {product.inStock ? "In Stock" : "Out of Stock"}
             </div>
          </div>
        </TableCell>

        <TableCell>
          {product.rating > 0 ? (
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-bold">
              <span className="text-[#222222]">{product.rating.toFixed(1)}</span>
              <Star className="w-3 h-3 text-[#5B7763] fill-[#5B7763]" />
              <span className="text-text-muted">({product.reviewsCount})</span>
            </div>
          ) : (
            <span className="text-[10px] uppercase tracking-wider text-text-muted">No reviews</span>
          )}
        </TableCell>

        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-8 h-8 flex items-center justify-center hover:bg-secondary/50 transition-colors outline-none focus:outline-none text-text-muted hover:text-[#222222] ml-auto">
              <MoreVertical className="w-4 h-4" strokeWidth={1.5} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-white border border-border/40 rounded-none shadow-xl p-1">
              <DropdownMenuItem 
                onClick={() => setOpen(true)}
                className="flex items-center gap-3 px-3 py-2 text-[12px] font-medium text-text-muted hover:text-[#222222] hover:bg-secondary/50 rounded-none cursor-pointer focus:bg-secondary/50 focus:text-[#222222]"
              >
                <Eye className="w-3.5 h-3.5" strokeWidth={1.5} /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => router.push(`products/edit/${product._id}`)}
                className="flex items-center gap-3 px-3 py-2 text-[12px] font-medium text-text-muted hover:text-[#222222] hover:bg-secondary/50 rounded-none cursor-pointer focus:bg-secondary/50 focus:text-[#222222]"
              >
                <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} /> Edit Product
              </DropdownMenuItem>
              <div className="border-t border-border/40 my-1" />
              {user?.role === "admin" && (
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="flex items-center gap-3 px-3 py-2 text-[12px] font-medium text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50 focus:text-red-700 rounded-none cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /> Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

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
