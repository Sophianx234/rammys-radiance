"use client";

import { Shield, Truck, Sparkles, HeartHandshake } from "lucide-react";

export default function WhyChooseUs() {
  const benefits = [
    {
      icon: Sparkles,
      title: "Premium Quality",
      description: "Luxury cosmetics handpicked for excellence and performance",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Swift and secure delivery across Nigeria",
    },
    {
      icon: Shield,
      title: "Authentic Guaranteed",
      description: "100% genuine products with authenticity certificates",
    },
    {
      icon: HeartHandshake,
      title: "Customer Care",
      description: "24/7 support for your beauty journey",
    },
  ];

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-card/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose Rammys Radiance
          </h2>
          <p className="text-lg text-muted-foreground">
            Experience luxury cosmetics like never before
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 group hover:bg-accent/20 transition-colors">
                  <Icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
