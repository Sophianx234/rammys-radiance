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
            imageSrc="/imgs/products/prod-8.jpeg"
            bgHex="#F7F7F7"
          />

          {/* Right Banner (50%) */}
          <PromoCard
            title="25% off Everything"
            description="Makeup with extended range in colors for every human."
            buttonText="Explore More"
            buttonLink="/sale"
            imageSrc="/imgs/products/prod-9.jpeg"
            bgHex="#B5CDB8"
          />
          
        </div>
      </div>
    </section>
  );
}
