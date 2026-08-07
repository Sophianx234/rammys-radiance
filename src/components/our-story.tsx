"use client";

export default function OurStory() {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Story
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Founded with a passion for luxury beauty, Rammys Radiance brings
              the world's finest cosmetics to Nigeria. We believe that every
              person deserves to feel confident and beautiful with premium,
              authentic products.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Our curated collection showcases top international brands
              alongside emerging luxury labels, all carefully selected for
              quality and performance. More than just makeup, we're a lifestyle
              destination for the modern, sophisticated beauty enthusiast.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                <p className="text-foreground">
                  Committed to authenticity and quality
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                <p className="text-foreground">
                  Supporting beauty enthusiasts across Nigeria
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                <p className="text-foreground">
                  Creating an inclusive luxury beauty community
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <img
              src="/luxury-cosmetics-brand-story.jpg"
              alt="Rammys Radiance brand story"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
