import { ProductCard } from "@/components/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getProducts } from "@/lib/data";

export default async function FeaturedProducts() {
  const { products } = await getProducts({ limit: 8 });

  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-medium text-text-main tracking-widest font-bold">
            Our Featured Products
          </h2>
          <p className="text-text-muted text-sm md:text-base">
            Get the skin you want to feel
          </p>
        </div>

        <div className="relative px-2 sm:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {products.map((product: any) => (
                <CarouselItem key={product._id} className="pl-4 md:pl-6 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="hidden sm:block">
              <CarouselPrevious className="-left-12 h-10 w-10 border-border/60 text-text-muted hover:text-text-main hover:border-text-main transition-colors bg-surface" />
              <CarouselNext className="-right-12 h-10 w-10 border-border/60 text-text-muted hover:text-text-main hover:border-text-main transition-colors bg-surface" />
            </div>
          </Carousel>
        </div>

      </div>
    </section>
  );
}
