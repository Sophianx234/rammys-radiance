import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductClient from "./product-client";

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  
  let data = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/products/${slug}`,
      { cache: "no-store" }
    );
    if (res.ok) {
      data = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch from API", err);
  }

  if (!data) {
    return (
      <main className="py-32 text-center bg-white min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-medium tracking-widest uppercase text-black mb-4">Product Not Found</h1>
        <p className="text-text-muted text-[13px]">We couldn't find the product you're looking for.</p>
      </main>
    );
  }

  return <ProductClient key={data._id} product={data as any} />;
}
