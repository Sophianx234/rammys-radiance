import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { GridLoader } from "react-spinners";
import { ProductTableRow } from "./product-table-row";
import { AdminProductsFilter } from "./client-filters";
import { getCategories, getProducts } from "@/lib/data";

export default async function ProductsTab(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex-1 space-y-8 pb-10 max-w-7xl mx-auto">
      {/* ---------- HEADER ---------- */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h2 className="text-[18px] uppercase tracking-widest font-bold text-[#222222]">Products</h2>
          <p className="text-[12px] text-text-muted mt-1 uppercase tracking-wider font-medium">
            Manage your store inventory and collections
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products/add-category" className="bg-secondary/50 text-[#222222] border border-border/40 px-5 py-2.5 text-[11px] uppercase tracking-wider font-bold hover:bg-secondary transition-colors flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" /> New Category
          </Link>
          <Link href="/admin/products/add" className="bg-black text-white px-5 py-2.5 text-[11px] uppercase tracking-wider font-bold hover:bg-opacity-90 transition-colors flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" /> Add New Product
          </Link>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <Suspense fallback={<div className="bg-white border border-border/40 p-5 h-20 animate-pulse" />}>
        <FiltersSection />
      </Suspense>

      {/* Product Table */}
      <Suspense fallback={
        <div className="h-[40vh] flex justify-center items-center">
          <GridLoader size={18} color="#5B7763" />
        </div>
      }>
        <ProductsTableSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function FiltersSection() {
  const categories = await getCategories();
  return <AdminProductsFilter categories={categories} />;
}

async function ProductsTableSection({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
  const sortBy = typeof searchParams.sortBy === 'string' ? searchParams.sortBy : "latest";
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  // We set limit to 100 for admin view instead of 12 for shop
  const { products } = await getProducts({
    page,
    limit: 100,
    sortBy,
    category,
    search
  });

  if (products.length === 0) {
    return (
      <div className="text-center p-16 bg-white border border-border/40 mt-8 flex flex-col items-center justify-center gap-4">
        <p className="text-text-muted text-[12px]">No products found matching your criteria.</p>
        <Link 
          href='/admin/products/add' 
          className="bg-black text-white px-5 py-2.5 text-[11px] uppercase tracking-wider font-bold hover:bg-opacity-90 transition-colors"
        >
          Add First Product
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border/40 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border/40">
            <TableHead className="text-[10px] uppercase tracking-wider font-bold text-text-muted h-12">Product</TableHead>
            <TableHead className="text-[10px] uppercase tracking-wider font-bold text-text-muted h-12">Category</TableHead>
            <TableHead className="text-[10px] uppercase tracking-wider font-bold text-text-muted h-12">Price</TableHead>
            <TableHead className="text-[10px] uppercase tracking-wider font-bold text-text-muted h-12">Stock</TableHead>
            <TableHead className="text-[10px] uppercase tracking-wider font-bold text-text-muted h-12">Rating</TableHead>
            <TableHead className="text-[10px] uppercase tracking-wider font-bold text-text-muted h-12 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product: any) => (
            <ProductTableRow key={product._id} product={product} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
