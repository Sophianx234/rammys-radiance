'use client'
import BrandShowcase from "@/components/BrandShowcase"
import CategoriesShowcase from "@/components/CategoriesShowcase"
import Testimonials from "@/components/Testimonials"
import FeaturedProducts from "@/components/featured-products"
import Footer from "@/components/footer"
import Header from "@/components/header"
import Hero from "@/components/hero"
import Newsletter from "@/components/newsletter"
import Bestsellers from "@/components/ui/BestSellers"
import CampaignVideo from "@/components/ui/CampaignVideo"
import Sustainability from "@/components/ui/Sustainability"

export default function HomePage() {
 
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <Bestsellers />
      {/* <AboutSectios /> */}
      <CampaignVideo />
      <BrandShowcase />
      <Testimonials />
      {/* <BeautyBlog /> */}
      <Sustainability />
      {/* <SocialFeed /> */}
      <Newsletter />
    </main>
  )
}
