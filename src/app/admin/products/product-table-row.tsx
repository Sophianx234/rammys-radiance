"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import { useDashStore } from "@/lib/store";
import { useConfirm } from "@/components/ui/confirm-provider";
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
import { Eye, Pencil, Star, Trash2, MoreVertical, ChevronDown } from "lucide-react";
import Image from "next/image";
import ImageSlider from "./image-slider";

export function ProductTableRow({ product }: { product: any }) {
  const [open, setOpen] = useState(false);
  const [showCaret, setShowCaret] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const confirmModal = useConfirm();

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // Show caret if we haven't scrolled to the bottom (with a 2px buffer)
      setShowCaret(scrollHeight > clientHeight && scrollTop + clientHeight < scrollHeight - 2);
    }
  };

  useEffect(() => {
    if (open) {
      // Small timeout to allow DOM to render and calculate heights
      setTimeout(checkScroll, 100);
    }
  }, [open]);
  const router = useRouter();
  const { user } = useDashStore();
  
  const stockClass =
    product.stock > 10
      ? ""
      : product.stock > 0
      ? ""
      : "";

  const handleDelete = async () => {
    const isConfirmed = await confirmModal({
      title: "Delete Product?",
      description: `Are you sure you want to delete "${product.name}"?`,
      confirmText: "Yes, delete it",
      variant: "destructive"
    });

    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("The product has been removed.");

      router.refresh(); 
    } catch (err) {
      toast.error("Could not delete product");
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
             <div className={`px-2 py-0.5 w-fit text-[9px] uppercase tracking-widest font-bold border ${product.inStock ? "border-[#5B7763]/20 bg-[#5B7763]/5 " : "border-red-600/20 bg-red-50 text-red-600"}`}>
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
              <DropdownMenuItem 
                onClick={handleDelete}
                className="flex items-center gap-3 px-3 py-2 text-[12px] font-medium text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50 focus:text-red-700 rounded-none cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-xl max-h-[90vh] bg-white border-border/40 text-[#222222] rounded-none shadow-2xl p-0 flex flex-col overflow-hidden"
        >
          <div className="p-6 pb-2 border-b border-border/40 shrink-0">
            <DialogHeader>
              <DialogTitle className="text-[18px] uppercase tracking-widest font-bold">{product.name}</DialogTitle>
              <DialogDescription className="text-[12px] text-text-muted uppercase tracking-wider font-medium">
                Product Details
              </DialogDescription>
            </DialogHeader>
          </div>

          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="p-6 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
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

          {/* Scrolling Caret */}
          {showCaret && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none animate-bounce bg-white/80 p-1 rounded-full backdrop-blur-sm shadow-sm">
              <ChevronDown className="w-5 h-5 text-[#222222]" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
