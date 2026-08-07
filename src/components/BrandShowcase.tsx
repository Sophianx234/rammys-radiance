"use client";

import {
  SiDior,
  SiNike,
  SiAdidas,
} from "react-icons/si";
import { FaCrown, FaGem } from "react-icons/fa";

const brands = [
  { name: "Dior", icon: SiDior },
  { name: "Adidas Beauty", icon: SiAdidas },
  { name: "Nike Cosmetics", icon: SiNike },
  // Elegant placeholders for unavailable designer brands
  { name: "Gucci", icon: FaCrown },
  { name: "Chanel", icon: FaGem },
];

export default function BrandShowcase() {
  return (
    <section className="py-12 md:py-20 bg-secondary border-y border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="uppercase text-xs text-muted-foreground tracking-wider mb-6">
          Trusted by top beauty brands
        </p>

        <div className="flex flex-wrap justify-center items-center gap-10 opacity-80">
          {brands.map(({ name, icon: Icon }, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 hover:opacity-100 transition-opacity"
            >
              <Icon className="text-4xl text-[#5B7763]" />
              <span className="text-sm text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
