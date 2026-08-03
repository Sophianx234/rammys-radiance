"use client";

import { Star } from "lucide-react";

export default function CustomerTestimonials() {
  const testimonials = [
    {
      name: "Chioma A.",
      location: "Lagos",
      text: "Rammys Radiance is my go-to for authentic luxury makeup. The quality is unmatched and delivery is always prompt!",
      rating: 5,
    },
    {
      name: "Zainab M.",
      location: "Abuja",
      text: "Finally found a trusted source for genuine premium cosmetics. The customer service is exceptional.",
      rating: 5,
    },
    {
      name: "Temi O.",
      location: "Port Harcourt",
      text: "Love the curated collection and the attention to detail. Every product feels like a luxury investment.",
      rating: 5,
    },
    {
      name: "Blessing K.",
      location: "Ibadan",
      text: "Best shopping experience! Authentic products, beautiful packaging, and incredible support. Highly recommended!",
      rating: 5,
    },
  ];

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Loved by Our Customers
          </h2>
          <p className="text-lg text-muted-foreground">
            Real reviews from beauty enthusiasts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-background rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-border"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground mb-4 italic">
                "{testimonial.text}"
              </p>
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
