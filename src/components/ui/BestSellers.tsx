import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/data";

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
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {products.map((product: any) => (
            <ProductCard product={product} key={product._id} />
          ))}
        </div>
      </div>
    </section>
  );
}
