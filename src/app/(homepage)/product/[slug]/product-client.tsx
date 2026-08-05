"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Share2, Check, Star, Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { IProduct } from "@/models/Product";
import { useDashStore } from "@/lib/store";
import ProductImageSlider from "./product-images-slider";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export default function ProductClient({ product }: { product: IProduct }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<{ type: 'success' | 'error' | 'warning', text: string } | null>(null);
  const { setCart, user } = useDashStore();

  // Fetch true wishlist status on mount
  useEffect(() => {
    if (!product?._id || !user) return;
    const fetchWishlistStatus = async () => {
      try {
        const res = await fetch("/api/users/wishlist");
        if (res.ok) {
          const data = await res.json();
          setIsFavorite(data.wishlist.some((id: any) => id.toString() === product._id.toString()));
        }
      } catch (err) {
        console.error("Failed to fetch wishlist status");
      }
    };
    fetchWishlistStatus();
  }, [product?._id, user]);

  const [userRating, setUserRating] = useState(product?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const finalRating = hoverRating || userRating;
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    if (!product?._id) return;
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/admin/products/reviews/${product._id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };
    fetchReviews();
  }, [product?._id]);

  const handleAddToCart = async () => {
    try {
      setCart(product, quantity);
      const res = await fetch("/api/users/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, quantity }),
      });
      if (!res.ok) return;
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      console.error("Cart request failed:", err);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    
    try {
      setIsFavorite(isFavorite => !isFavorite);
      const res = await fetch("/api/users/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });
      if (!res.ok) {
        // revert on failure
        console.error("Wishlist API failed:", res.status, await res.text());
        setIsFavorite(isFavorite => !isFavorite);
        return;
      }
      const data = await res.json();
      setIsFavorite(data.isFavorite);
      
      // Notify header to refetch from server
      window.dispatchEvent(new CustomEvent("wishlistUpdated", { detail: data.wishlist }));
    } catch (err) {
      console.error("Wishlist failed:", err);
      // revert on failure
      setIsFavorite(isFavorite => !isFavorite);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/admin/products/reviews/${product._id}`, {
        method: "POST",
        body: JSON.stringify({ rating: userRating, comment: reviewComment }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 409) {
        setReviewMessage({ type: 'warning', text: 'You have already reviewed this product. Product can only be reviewed once in a year' });
        return;
      }
      if (res.ok) {
        const newReview = await res.json();
        setReviews([newReview, ...reviews]);
        setReviewComment("");
        const MySwal = withReactContent(Swal);
        MySwal.fire({ toast: true, position: "top-end", icon: "success", title: "Review submitted successfully!", showConfirmButton: false, timer: 2000, timerProgressBar: true });
      }
    } catch (err) {
      setReviewMessage({ type: 'error', text: 'Failed to submit review. Please try again.' });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!product) return null;

  return (
    <main className="bg-white min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-8">
        <div className="flex items-center gap-3 text-[11px] font-bold tracking-[0.2em] uppercase text-text-muted">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="text-border">/</span>
          <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
          <span className="text-border">/</span>
          <span className="text-black">{product.category?.name || "Product"}</span>
        </div>
      </div>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left: Image Slider (Sticky) */}
          <div className="relative">
            <div className="lg:sticky lg:top-[120px] bg-surface aspect-[4/5] flex items-center justify-center overflow-hidden">
              <ProductImageSlider images={product.images || []} />
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col pt-4 lg:pt-10">
            <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-text-muted mb-4">
              {product.category?.name || "Skincare"}
            </p>
            <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-text-main mb-6 leading-tight">
              {product.name}
            </h1>

            {/* Price & Rating */}
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-border/40">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-medium text-text-main">
                  ${typeof product.price === 'number' ? product.price.toLocaleString() : product.price}
                </span>
                <span className={`text-[11px] font-bold uppercase tracking-widest ${product.inStock !== false ? "text-[#5B7763]" : "text-red-500"}`}>
                  {product.inStock !== false ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-[2px]">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star key={value} className={`w-3.5 h-3.5 ${value <= (product.rating || 5) ? "fill-[#5B7763] text-[#5B7763]" : "text-border"}`} />
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-text-muted tracking-widest">
                  ({product.reviewsCount || reviews.length} REVIEWS)
                </span>
              </div>
            </div>

            <p className="text-[14px] leading-relaxed text-text-muted mb-12">
              {product.description || "Experience a new era of effortless confidence with our clinically proven, nature-inspired formulas. Perfectly balanced to rejuvenate your natural glow."}
            </p>

            {/* Add to Cart Actions */}
            <div className="flex flex-col gap-5 mb-14">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border border-border/60 h-14 w-full sm:w-36 shrink-0">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-full flex items-center justify-center text-text-muted hover:text-black transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="flex-1 text-center text-[13px] font-semibold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-full flex items-center justify-center text-text-muted hover:text-black transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                
                {/* Add to Cart Button */}
                <Button 
                  onClick={handleAddToCart} 
                  disabled={product.inStock === false} 
                  className="flex-1 w-full h-14 rounded-none bg-black hover:bg-black/80 text-white text-[12px] font-bold uppercase tracking-[0.2em] transition-colors"
                >
                  {addedToCart ? "Added To Cart" : "Add To Bag"}
                </Button>
              </div>

              {/* Wishlist */}
              <div className="flex items-center gap-4">
                <button onClick={handleWishlist} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted hover:text-black transition-colors">
                  <Heart size={14} className={isFavorite ? "fill-[#5B7763] text-[#5B7763]" : ""} />
                  {isFavorite ? "Saved to Wishlist" : "Save to Wishlist"}
                </button>
              </div>
            </div>

            {/* Accordions (Details, Features) */}
            <div className="border-t border-border/40">
              <div className="py-7 border-b border-border/40">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] mb-4 text-text-main">Key Features</h3>
                <ul className="space-y-3">
                  {(product.features && product.features.length > 0) ? product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-4">
                      <span className="w-1 h-1 rounded-full bg-black mt-2.5 shrink-0" />
                      <span className="text-[14px] text-text-muted leading-relaxed">{feature}</span>
                    </li>
                  )) : (
                    <li className="flex items-start gap-4">
                      <span className="w-1 h-1 rounded-full bg-black mt-2.5 shrink-0" />
                      <span className="text-[14px] text-text-muted leading-relaxed">Formulated for all skin types with highly active botanicals.</span>
                    </li>
                  )}
                </ul>
              </div>
              <div className="py-7 border-b border-border/40">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] mb-4 text-text-main">Shipping & Returns</h3>
                <p className="text-[14px] text-text-muted leading-relaxed">
                  Complimentary shipping on all U.S. orders over $50. Enjoy a 30-day money-back guarantee on all products if you're not fully satisfied with your radiance.
                </p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-20 pt-10">
              <h2 className="text-2xl font-medium tracking-tight mb-10">Customer Reviews</h2>
              
              {/* Form */}
              <div className="bg-surface p-8 mb-12">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6">Write a Review</h4>
                <div className="flex items-center gap-1.5 mb-6">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      size={20}
                      onClick={() => setUserRating(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      className={`cursor-pointer transition-colors ${value <= finalRating ? "fill-[#5B7763] text-[#5B7763]" : "text-border"}`}
                    />
                  ))}
                </div>
                <Textarea 
                  placeholder="Share your experience..." 
                  value={reviewComment} 
                  onChange={(e) => setReviewComment(e.target.value)} 
                  className="w-full bg-white border-border/60 rounded-none mb-4 resize-none h-24 focus:ring-black text-[13px] p-4"
                />
                {reviewMessage && (
                  <p className={`text-[12px] font-medium mb-4 ${reviewMessage.type === 'success' ? 'text-[#5B7763]' : 'text-red-500'}`}>
                    {reviewMessage.text}
                  </p>
                )}
                <Button 
                  onClick={handleSubmitReview} 
                  disabled={isSubmittingReview} 
                  className="h-12 px-8 bg-black hover:bg-black/80 rounded-none text-white text-[11px] font-bold tracking-[0.2em] uppercase"
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </div>

              {/* List */}
              <div className="space-y-8">
                {reviews.length === 0 ? (
                  <p className="text-[13px] text-text-muted italic">No reviews yet. Be the first to share your thoughts.</p>
                ) : (
                  reviews.map((r: any) => (
                    <div key={r._id} className="pb-8 border-b border-border/40 last:border-0">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <img src={r.user.profile || `https://ui-avatars.com/api/?name=${r.user.name}&background=random`} alt={r.user.name} className="w-10 h-10 rounded-full object-cover grayscale" />
                          <div>
                            <span className="block text-[12px] font-bold tracking-[0.1em] uppercase">{r.user.name}</span>
                            <span className="block text-[11px] text-text-muted mt-0.5">
                              {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-[2px]">
                          {[1, 2, 3, 4, 5].map((v) => (
                            <Star key={v} className={`w-3.5 h-3.5 ${v <= r.rating ? "fill-[#5B7763] text-[#5B7763]" : "text-border"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[14px] leading-relaxed text-text-muted pl-[56px]">
                        {r.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
