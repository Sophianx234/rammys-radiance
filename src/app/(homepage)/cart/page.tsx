import { getProducts } from "@/lib/data";
import { CartClient } from "./cart-client";

export default async function CartPage() {
  const { products: suggestedProducts } = await getProducts({ limit: 4, sortBy: "rating" });

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans pb-24">
      <CartClient suggestedProducts={suggestedProducts} />
    </main>
  );
}
