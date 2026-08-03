"use client";

import { PromoCard } from "./promo-card";

export default function PromoBannersSecondary() {
  return (
    <section className="py-6 bg-surface">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Banner (50%) */}
          <PromoCard
            eyebrow="NEW COLLECTION"
            title={"Intensive Glow C+\nSerum"}
            buttonText="Explore More"
            buttonLink="/collection/glow-c-serum"
            imageSrc="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1000"
            bgHex="#F7F7F7"
          />

          {/* Right Banner (50%) */}
          <PromoCard
            title="25% off Everything"
            description="Makeup with extended range in colors for every human."
            buttonText="Explore More"
            buttonLink="/sale"
            imageSrc="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=1000"
            bgHex="#B5CDB8"
          />
          
        </div>
      </div>
    </section>
  );
}
