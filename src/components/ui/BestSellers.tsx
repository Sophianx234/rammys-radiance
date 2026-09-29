import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/data";
import Link from "next/link";

export default async function Bestsellers() {
  const { products } = await getProducts({ sortBy: "rating", limit: 4 });

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-[#fdfbf7] py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Header (Always Visible instantly) */}
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-medium text-text-main tracking-widest font-bold">
            Bestsellers
          </h2>
          <p className="text-text-muted text-sm md:text-base">
            Discover our most loved beauty essentials, crafted for elegance.
          </p>
        </div>

        {/* Product Grid */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 max-w-6xl mx-auto">
          {products.map((product: any) => (
            <div key={product._id} className="w-[calc(50%-12px)] md:w-[calc(33.333%-27px)] lg:w-[calc(25%-30px)]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="flex justify-center ">
        
        <Link href='/shop' className="mx-auto inline-block mt-4 bg-text-main text-surface px-10 py-4 font-semibold text-sm transition-[background-color,transform] duration-200 ease-out hover:bg-text-muted active:scale-[0.97]">
                  See All Products
                </Link>
                </div>
      </div>
    </section>
  );
}
