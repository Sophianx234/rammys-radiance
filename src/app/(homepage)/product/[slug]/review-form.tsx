"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

export default function ReviewSection() {
  // State from your existing code
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<{ text: string; type: string } | null>(null);

  // Mock data for existing reviews
  const reviews = []; 

  // Determine which rating to show (hover takes precedence)
  const displayRating = hoverRating || userRating;

  // Logic to handle mouse movement over a star
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const x = e.clientX - rect.left; // X coordinate within the star

    // If mouse is on the left 50% of the star, it's a half star (0.5)
    // starIndex is 1-based (1, 2, 3, 4, 5)
    if (x < width / 2) {
      setHoverRating(starIndex - 0.5);
    } else {
      setHoverRating(starIndex);
    }
  };

  const handleClick = () => {
    setUserRating(hoverRating);
  };

  const handleSubmitReview = () => {
    setIsSubmittingReview(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmittingReview(false);
      setReviewMessage({ text: "Review submitted successfully!", type: "success" });
    }, 1000);
  };

  return (
    <Card className="bg-secondary/30 border-border p-6 mt-8 shadow-sm">
      <h3 className="text-xl font-bold mb-6 text-foreground">Customer Reviews</h3>

      {/* Review Form */}
      <div className="mb-8 space-y-4 bg-background p-6 rounded-lg border border-border">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Rate this product
          </h4>
          
          <div className="flex items-center gap-4">
            {/* Star Container */}
            <div 
              className="flex items-center gap-1" 
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map((index) => {
                // Calculate how much of this specific star should be filled
                // 100% = Full, 50% = Half, 0% = Empty
                let fillPercentage = 0;
                if (displayRating >= index) {
                  fillPercentage = 100;
                } else if (displayRating === index - 0.5) {
                  fillPercentage = 50;
                }

                return (
                  <div
                    key={index}
                    className="relative cursor-pointer transition-transform hover:scale-110"
                    onMouseMove={(e) => handleMouseMove(e, index)}
                    onClick={handleClick}
                  >
                    {/* Background Star (Gray/Empty) */}
                    <Star size={32} className="text-gray-300 dark:text-gray-600" />

                    {/* Foreground Star (Yellow/Filled) - Clipped based on percentage */}
                    <div
                      className="absolute top-0 left-0 overflow-hidden"
                      style={{ width: `${fillPercentage}%` }}
                    >
                      <Star size={32} className="fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Numeric Rating Display */}
            <div className="flex items-center justify-center min-w-[3rem]">
              <span className={`text-2xl font-bold transition-colors ${
                displayRating > 0 ? "text-foreground" : "text-muted-foreground"
              }`}>
                {displayRating > 0 ? displayRating.toFixed(1) : "0.0"}
              </span>
              <span className="text-sm text-muted-foreground ml-1 mb-1">/ 5</span>
            </div>
          </div>
        </div>

        <Textarea
          placeholder="Share your experience with this product..."
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          rows={4}
          className="w-full resize-none"
        />

        {/* Review Feedback Message */}
        {reviewMessage && (
          <p
            className={`text-sm font-medium ${
              reviewMessage.type === "success"
                ? "text-emerald-500"
                : "text-red-500"
            }`}
          >
            {reviewMessage.text}
          </p>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleSubmitReview}
            disabled={isSubmittingReview || displayRating === 0}
            className="w-full sm:w-auto"
          >
            {isSubmittingReview ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </div>

      {/* Existing Reviews List */}
      <div className="space-y-6">
        <h4 className="font-semibold text-lg">Recent Reviews</h4>
        {!reviews.length && (
          <div className="text-center py-8 bg-background/50 rounded-lg border border-dashed border-border">
            <p className="text-muted-foreground">No reviews yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </Card>
  );
}