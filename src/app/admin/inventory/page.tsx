import { Suspense } from "react";
import { GridLoader } from "react-spinners";
import { getProducts } from "@/lib/data";
import { InventoryClient } from "./inventory-client";

export default function InventoryPage() {
  return (
    <Suspense fallback={
      <div className="flex inset-0 h-dvh items-center justify-center">
        <GridLoader size={24} color="#ffaf9f" />
      </div>
    }>
      <InventoryData />
    </Suspense>
  );
}

async function InventoryData() {
  // Fetch up to 1000 products for inventory management
  const { products } = await getProducts({ limit: 1000 });

  return <InventoryClient products={products} />;
}