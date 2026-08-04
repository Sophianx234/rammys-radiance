import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { IProduct } from "@/models/Product";

interface ProductCardProps {
  product: any; // We use 'any' here or a Partial<IProduct> for frontend to avoid Mongoose Document type conflicts, but it's structurally the same
}

export function ProductCard({ product }: ProductCardProps) {
  const priceDisplay = `₵${(product.price).toLocaleString()}`;
  const discountPriceDisplay = product.discountPrice ? `₵${(product.discountPrice).toLocaleString()}` : undefined;

  return (
    <Link href={`/product/${product.slug || product._id}`} className="group flex flex-col cursor-pointer w-full block">
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-[#F8F9FA] mb-5 overflow-hidden flex items-center justify-center">
        {product.discountBadge && (
          <div className="absolute top-3 left-3 z-10 bg-[#5B7763] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
            {product.discountBadge}
          </div>
        )}
        <div className="relative w-full h-full transition-transform duration-700 ">
          <Image
            src={product.images?.[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col items-center text-center space-y-1.5">
        <div className="flex items-center justify-center space-x-1.5 text-xs font-semibold text-text-main">
          {discountPriceDisplay ? (
            <>
              <span className="line-through text-text-muted font-normal">{priceDisplay}</span>
              <span>{discountPriceDisplay}</span>
            </>
          ) : (
            <span>{priceDisplay}</span>
          )}
        </div>
        
        <div className="text-sm font-semibold text-text-main group-hover:text-[#5B7763] transition-colors">
          {product.name}
        </div>
        
        {/* Stars */}
        <div className="flex items-center space-x-[2px] mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-3 h-3 fill-[#5B7763] text-[#5B7763]" />
          ))}
        </div>
      </div>
    </Link>
  );
}
