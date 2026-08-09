"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDashStore } from "@/lib/store";
import { useConfirm } from "@/components/ui/confirm-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableRow, TableCell } from "@/components/ui/table";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import Image from "next/image";

export function CategoryTableRow({ category }: { category: any }) {
  const router = useRouter();
  const { user } = useDashStore();
  const confirmModal = useConfirm();

  const handleDelete = async () => {
    const isConfirmed = await confirmModal({
      title: "Delete Category?",
      description: `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
      confirmText: "Yes, delete it",
      variant: "destructive"
    });

    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/categories/${category._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete category");
      }

      toast.success("The category has been removed.");
      router.refresh(); 
    } catch (err: any) {
      toast.error(err.message || "Could not delete category");
    }
  };

  return (
    <TableRow className="border-border/40 hover:bg-secondary/20 transition-colors group">
      <TableCell className="py-3">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-secondary border border-border/40 flex-shrink-0 relative overflow-hidden">
            {category.image ? (
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted text-[10px] uppercase font-bold">
                No Img
              </div>
            )}
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#222222] line-clamp-1 leading-snug">{category.name}</p>
            <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">{category.slug}</p>
          </div>
        </div>
      </TableCell>

      <TableCell className="text-[12px] text-text-muted max-w-[200px] truncate">
        {category.description || "No description"}
      </TableCell>

      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-8 h-8 flex items-center justify-center hover:bg-secondary/50 transition-colors outline-none focus:outline-none text-text-muted hover:text-[#222222] ml-auto">
            <MoreVertical className="w-4 h-4" strokeWidth={1.5} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-white border border-border/40 rounded-none shadow-xl p-1">
            <DropdownMenuItem 
              onClick={() => router.push(`/admin/products/edit-category/${category._id}`)}
              className="flex items-center gap-3 px-3 py-2 text-[12px] font-medium text-text-muted hover:text-[#222222] hover:bg-secondary/50 rounded-none cursor-pointer focus:bg-secondary/50 focus:text-[#222222]"
            >
              <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} /> Edit Category
            </DropdownMenuItem>
            {user?.role === 'admin' && (
              <>
                <div className="border-t border-border/40 my-1" />
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="flex items-center gap-3 px-3 py-2 text-[12px] font-medium text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50 focus:text-red-700 rounded-none cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /> Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
