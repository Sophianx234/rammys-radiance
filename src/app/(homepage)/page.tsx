import FeaturedProducts from "@/components/featured-products"
import Hero from "@/components/hero"
import PromoBanners from "@/components/promo-banners"
import PromoBannersSecondary from "@/components/promo-banners-secondary"
import Bestsellers from "@/components/ui/BestSellers"
import { Suspense } from "react"
import dynamic from "next/dynamic"

const CampaignVideo = dynamic(() => import("@/components/ui/CampaignVideo"), { ssr: true })
const BrandShowcase = dynamic(() => import("@/components/BrandShowcase"), { ssr: true })
const WhyChooseUs = dynamic(() => import("@/components/why-choose-us"), { ssr: true })
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: true })
const Newsletter = dynamic(() => import("@/components/newsletter"), { ssr: true })

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Suspense fallback={<ProductRowSkeleton title="Our Featured Products" subtitle="Get the skin you want to feel" />}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<ProductRowSkeleton title="Bestsellers" subtitle="Discover our most loved beauty essentials, crafted for elegance." />}>
        <Bestsellers />
      </Suspense>
      <PromoBanners />
      <PromoBannersSecondary/>
      <CampaignVideo />
      <BrandShowcase />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </main>
  )
}

function ProductRowSkeleton({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <section className="py-24 bg-surface relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-medium text-text-main tracking-widest font-bold">
            {title}
          </h2>
          <p className="text-text-muted text-sm md:text-base">
            {subtitle}
          </p>
        </div>
        <div className="relative px-2 sm:px-12">
          <div className="flex -ml-4 md:-ml-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="pl-4 md:pl-6 min-w-0 flex-shrink-0 flex-grow-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="flex flex-col w-full">
                  <div className="aspect-[4/5] bg-gray-200 animate-pulse mb-5 rounded-none" />
                  <div className="flex flex-col items-center space-y-2.5">
                    <div className="h-3 w-16 bg-gray-200 animate-pulse rounded-none" />
                    <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded-none" />
                    <div className="h-3 w-20 bg-gray-200 animate-pulse rounded-none" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
