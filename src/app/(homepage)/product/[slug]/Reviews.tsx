"use client";

import { useState } from "react";
import ReviewCard from "@/components/review-card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const mockReviews = [
  {
    author: "Sarah M.",
    rating: 5,
    title: "Amazing quality!",
    content:
      "The product exceeded my expectations. The quality is excellent and it arrived quickly.",
    date: "2025-10-20",
    verified: true,
  },
  {
    author: "Jennifer K.",
    rating: 4,
    title: "Great product, fast delivery",
    content:
      "Very satisfied with my purchase. The color is exactly as shown in pictures.",
    date: "2025-10-18",
    verified: true,
  },
  {
    author: "Amanda T.",
    rating: 5,
    title: "Love it!",
    content:
      "Best purchase I've made from Rammys Radiance. Highly recommend to everyone.",
    date: "2025-10-15",
    verified: true,
  },
];

export default function ReviewsSection() {
  const [showReviewForm, setShowReviewForm] = useState(false);

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-primary text-primary" />
            ))}
          </div>
          <span className="text-lg font-semibold">4.7/5</span>
          <span className="text-muted-foreground">
            ({mockReviews.length} reviews)
          </span>
        </div>

        <Button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="bg-primary hover:bg-primary/90"
        >
          {showReviewForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      {showReviewForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-4">Share your thoughts</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star className="w-6 h-6 text-muted-foreground hover:fill-primary hover:text-primary" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                placeholder="Sum up your experience"
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Review</label>
              <textarea
                placeholder="Share details about your experience..."
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Submit Review
            </Button>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {mockReviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </div>
    </div>
  );
}
