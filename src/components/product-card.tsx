import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  discountPrice?: string;
  priceRange?: boolean;
  image: string;
  discountBadge?: string;
}

export function ProductCard({
  id,
  name,
  price,
  discountPrice,
  priceRange,
  image,
  discountBadge,
}: ProductCardProps) {
  return (
    <div className="group flex flex-col cursor-pointer w-full">
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-[#F8F9FA] mb-5 overflow-hidden flex items-center justify-center">
        {discountBadge && (
          <div className="absolute top-3 left-3 z-10 bg-[#5B7763] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
            {discountBadge}
          </div>
        )}
        <div className="relative w-full h-full transition-transform duration-700 ">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col items-center text-center space-y-1.5">
        <div className="flex items-center justify-center space-x-1.5 text-xs font-semibold text-text-main">
          {discountPrice ? (
            <>
              <span className="line-through text-text-muted font-normal">{price}</span>
              <span>{discountPrice}</span>
            </>
          ) : priceRange ? (
            <span>{price}</span>
          ) : (
            <span>{price}</span>
          )}
        </div>
        
        <Link href={`/product/${id}`} className="text-sm font-semibold text-text-main hover:text-action-primary transition-colors">
          {name}
        </Link>
        
        {/* Stars */}
        <div className="flex items-center space-x-[2px] mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-3 h-3 fill-[#5B7763] text-[#5B7763]" />
          ))}
        </div>
      </div>
    </div>
  );
}
