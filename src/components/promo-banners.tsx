"use client";

import { PromoCard } from "./promo-card";

export default function PromoBanners() {
  return (
    <section className="py-6 bg-surface">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Left Banner (Larger - 3 columns) */}
          <PromoCard
            eyebrow="NEW COLLECTION"
            title={"Discover Our\nAutumn Skincare"}
            buttonText="Explore More"
            buttonLink="/collection/autumn"
            imageSrc="/imgs/products/lady-1.jpeg"
            bgHex="#F2F2F2"
            className="lg:col-span-3"
          />

          {/* Right Banner (Smaller - 2 columns) */}
          <PromoCard
            title="25% off Everything"
            description="Makeup with extended range in colors for every human."
            buttonText="Shop Sale"
            buttonLink="/sale"
            imageSrc="/imgs/products/prod-7.jpeg"
            bgHex="#DFE5D4"
            className="lg:col-span-2"
          />
          
        </div>
      </div>
    </section>
  );
}
