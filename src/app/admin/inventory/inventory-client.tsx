"use client";

import { useDashStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Star, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Layers,
  Calendar
} from "lucide-react";
import Image from "next/image";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' });
};

export function InventoryClient({ products }: { products: any[] }) {
  const { user } = useDashStore();

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">Product Inventory</CardTitle>
            <CardDescription>Manage your products, stock levels, and prices.</CardDescription>
          </div>
          <Button>Add New Product</Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-[300px]">Product Details</TableHead>
                <TableHead>Stock Status</TableHead>
                <TableHead>Attributes</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.length === 0 ? (
                 <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                      No products found.
                    </TableCell>
                 </TableRow>
              ) : (
                products.map((p) => (
                  <TableRow key={p._id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div className="relative h-12 w-12 min-w-[48px] rounded-lg overflow-hidden border bg-gray-100">
                          <Image
                            src={p.images?.[0] || "/placeholder.png"}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-sm leading-none truncate max-w-[200px]" title={p.name}>
                            {p.name}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            {p.category?.name || "Uncategorized"}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1 items-start">
                        <Badge
                          variant="outline"
                          className={`
                            ${p.stock === 0 ? "border-red-200 bg-red-50 text-red-700" : 
                              p.stock < 5 ? "border-amber-200 bg-amber-50 text-amber-700" : 
                              "border-green-200 bg-green-50 text-green-700"}
                          `}
                        >
                          {p.stock === 0 ? (
                             <span className="flex items-center gap-1"><XCircle className="w-3 h-3"/> Out of Stock</span>
                          ) : p.stock < 5 ? (
                             <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Low: {p.stock}</span>
                          ) : (
                             <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> In Stock: {p.stock}</span>
                          )}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-2">
                        {p.isFeatured && (
                          <div className="flex items-center gap-1 text-xs text-primary font-medium">
                             Featured
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                       <div className="flex items-center justify-center gap-1 text-sm">
                          <Star className="w-4 h-4  stroke-primary" />
                          <span className="font-medium">{p.rating || 0}</span>
                          <span className="text-xs text-gray-400">({p.reviewsCount || 0})</span>
                       </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {p.createdAt ? formatDate(p.createdAt) : "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <span className="font-bold text-sm">
                        {formatCurrency(p.price)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(p._id)}>
                            Copy ID
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit Product</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:text-red-600">
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
