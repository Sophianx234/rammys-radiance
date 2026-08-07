import { Suspense } from "react";
import Link from "next/link";
import { GridLoader } from "react-spinners";
import { getProducts, getCategories } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { ShopFilters } from "./shop-filters";
import { ShopSort } from "./shop-sort";
import { ShopPagination } from "./shop-pagination";

export default async function ShopPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans pb-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Sidebar */}
          <Suspense fallback={<div className="lg:w-[240px] shrink-0" />}>
            <SidebarContainer />
          </Suspense>

          {/* Products Grid Area */}
          <div className="flex-1">
            <Suspense fallback={
              <div className="h-[40vh] flex justify-center items-center">
                <GridLoader size={18} color="#5B7763" />
              </div>
            }>
              <ProductsContainer searchParams={searchParams} />
            </Suspense>
          </div>

        </div>
      </div>
    </main>
  );
}

async function SidebarContainer() {
  const categories = await getCategories();
  return <ShopFilters categories={categories} />;
}

async function ProductsContainer({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
  const sortBy = typeof searchParams.sortBy === 'string' ? searchParams.sortBy : "featured";
  const selectedCategory = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  
  let minPrice, maxPrice;
  const priceRange = typeof searchParams.priceRange === 'string' ? searchParams.priceRange : undefined;
  if (priceRange) {
    const [min, max] = priceRange.split("-");
    if (min) minPrice = parseFloat(min);
    if (max) maxPrice = parseFloat(max);
  }

  const { products, pagination } = await getProducts({
    page,
    sortBy,
    category: selectedCategory,
    minPrice,
    maxPrice,
    search: typeof searchParams.search === 'string' ? searchParams.search : undefined,
    discounted: searchParams.discounted === 'true'
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 pb-6 border-b border-border/40 gap-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted">
          {pagination.total} Products Found
        </p>
        <ShopSort />
      </div>

      {products.length === 0 ? (
        <div className="h-[40vh] flex flex-col justify-center items-center text-center">
          <p className="text-[14px] text-text-muted mb-6">No products match your current filters.</p>
          <Link 
            href="/shop"
            className="bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-3 hover:bg-[#5B7763] transition-colors inline-block"
          >
            Clear Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      <ShopPagination totalPages={pagination.pages} />
    </>
  );
}
