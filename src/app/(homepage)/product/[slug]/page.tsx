import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductClient from "./product-client";

const FEATURED_FALLBACKS = [
  {
    _id: "1",
    slug: "shield-conditioner",
    name: "Shield Conditioner",
    price: 20.00,
    description: "A deeply nourishing shield conditioner that locks in moisture and protects your radiance all day. Formulated with rare botanicals.",
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600"],
    category: { name: "Haircare" },
    rating: 4.8,
    reviewsCount: 124,
    stock: 50,
    inStock: true,
    features: ["Locks in moisture", "Sulfate-free", "Protects against environmental damage"],
  },
  {
    _id: "2",
    slug: "perfecting-facial-oil",
    name: "Perfecting Facial Oil",
    price: 20.00,
    description: "Our signature perfecting facial oil. Lightweight, fast-absorbing, and designed to leave your skin feeling luxurious and radiant.",
    images: ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=600"],
    category: { name: "Skincare" },
    rating: 4.9,
    reviewsCount: 89,
    stock: 30,
    inStock: true,
    features: ["Fast-absorbing", "Non-comedogenic", "Rich in antioxidants"],
  },
  {
    _id: "3",
    slug: "enriched-hand-body-wash",
    name: "Enriched Hand & Body Wash",
    price: 25.00,
    description: "Elevate your daily routine with this enriched wash. Gently cleanses while hydrating the skin.",
    images: ["https://images.unsplash.com/photo-1615397323281-b6aeb63a9496?auto=format&fit=crop&q=80&w=600"],
    category: { name: "Body" },
    rating: 4.7,
    reviewsCount: 210,
    stock: 100,
    inStock: true,
    features: ["Gentle formula", "Hydrating", "Subtle botanical scent"],
  },
  {
    _id: "4",
    slug: "shield-shampoo",
    name: "Shield Shampoo",
    price: 45.00,
    description: "The ultimate shield shampoo to cleanse and fortify. A premium formulation for everyday luxury.",
    images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=600"],
    category: { name: "Haircare" },
    rating: 4.6,
    reviewsCount: 76,
    stock: 40,
    inStock: true,
    features: ["Fortifying", "Color-safe", "Silicone-free"],
  },
  {
    _id: "5",
    slug: "radiant-skin-serum",
    name: "Radiant Skin Serum",
    price: 30.00,
    description: "Unlock your inner glow with this highly concentrated serum. Packed with active ingredients to brighten and smooth.",
    images: ["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600"],
    category: { name: "Skincare" },
    rating: 5.0,
    reviewsCount: 342,
    stock: 15,
    inStock: true,
    features: ["Brightening", "Smoothing", "Highly concentrated"],
  },
  {
    _id: "6",
    slug: "daily-moisture-cream",
    name: "Daily Moisture Cream",
    price: 18.00,
    description: "Your daily dose of deep hydration. Leaves skin feeling plump, soft, and perfectly prepped for the day.",
    images: ["https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600"],
    category: { name: "Skincare" },
    rating: 4.5,
    reviewsCount: 56,
    stock: 200,
    inStock: true,
    features: ["Deep hydration", "Plumping effect", "Perfect under makeup"],
  },
  {
    _id: "7",
    slug: "botanical-toner",
    name: "Botanical Toner",
    price: 22.00,
    description: "Refresh and balance with our signature botanical toner. The essential prep step for flawless skin.",
    images: ["https://images.unsplash.com/photo-1556228720-192a6af4e865?auto=format&fit=crop&q=80&w=600"],
    category: { name: "Skincare" },
    rating: 4.8,
    reviewsCount: 92,
    stock: 60,
    inStock: true,
    features: ["Balancing", "Alcohol-free", "Refreshing"],
  },
  {
    _id: "8",
    slug: "night-recovery-oil",
    name: "Night Recovery Oil",
    price: 35.00,
    description: "Work while you sleep. This potent night recovery oil restores and replenishes for a morning glow.",
    images: ["https://images.unsplash.com/photo-1608248593842-83210d7a0419?auto=format&fit=crop&q=80&w=600"],
    category: { name: "Skincare" },
    rating: 4.9,
    reviewsCount: 115,
    stock: 25,
    inStock: true,
    features: ["Restorative", "Replenishing", "Overnight treatment"],
  }
];

export default async function ProductPage(props: { params: { slug: string } }) {
  const { slug } = props.params;
  
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
    console.error("Failed to fetch from API, falling back to mock data if available.");
  }

  // Fallback to mock data if API fails or returns 404
  if (!data) {
    const mockProduct = FEATURED_FALLBACKS.find(p => p.slug === slug || p._id === slug);
    if (mockProduct) {
      data = mockProduct;
    }
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
