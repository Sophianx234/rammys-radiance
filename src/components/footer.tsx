import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border/40 pt-24 pb-8">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Info (4 columns) */}
          <div className="md:col-span-4 flex flex-col items-start">
            <Link href="/" className="inline-block mb-8">
              <Image 
                src="/imgs/logo.jpeg" 
                alt="Rammy's Radiance Logo" 
                width={160} 
                height={50} 
                className="object-contain"
              />
            </Link>
            <p className="text-[13px] text-text-muted leading-relaxed max-w-sm mb-8">
              Luxury cosmetics curated for your unique beauty. Experience a new era of effortless confidence with our clinically proven, nature-inspired formulas.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-5">
              <a href="#" className="text-text-muted hover:text-black transition-colors" aria-label="Instagram">
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-text-muted hover:text-black transition-colors" aria-label="Twitter">
                <Twitter size={18} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-text-muted hover:text-black transition-colors" aria-label="Facebook">
                <Facebook size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Links Grid (8 columns) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 md:pl-10">
            
            {/* Shop */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-main">Shop</h3>
              <ul className="space-y-4">
                <li><Link href="/shop" className="text-[13px] text-text-muted hover:text-black transition-colors">All Products</Link></li>
                <li><Link href="/shop?category=skincare" className="text-[13px] text-text-muted hover:text-black transition-colors">Skincare</Link></li>
                <li><Link href="/shop?category=makeup" className="text-[13px] text-text-muted hover:text-black transition-colors">Makeup</Link></li>
                <li><Link href="/shop?sortBy=rating" className="text-[13px] text-text-muted hover:text-black transition-colors">Bestsellers</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-main">Support</h3>
              <ul className="space-y-4">
                <li><Link href="/support#faq" className="text-[13px] text-text-muted hover:text-black transition-colors">FAQ</Link></li>
                <li><Link href="/support#shipping" className="text-[13px] text-text-muted hover:text-black transition-colors">Delivery Options</Link></li>
                <li><Link href="/support#shipping" className="text-[13px] text-text-muted hover:text-black transition-colors">Returns & Exchanges</Link></li>
                <li><Link href="/support#contact" className="text-[13px] text-text-muted hover:text-black transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-main">Company</h3>
              <ul className="space-y-4">
                <li><Link href="/corporate" className="text-[13px] text-text-muted hover:text-black transition-colors">Corporate Hub</Link></li>
                <li><Link href="/corporate#careers" className="text-[13px] text-text-muted hover:text-black transition-colors">Careers</Link></li>
                <li><Link href="/privacy" className="text-[13px] text-text-muted hover:text-black transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-[13px] text-text-muted hover:text-black transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[12px] text-text-muted">
            © {currentYear} Rammy's Radiance. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-6">
            <a href="mailto:info@rammys.com" className="flex items-center gap-2 text-[12px] text-text-muted hover:text-black transition-colors">
              <Mail size={14} strokeWidth={1.5} /> 
              info@rammys.com
            </a>
            <a href="tel:+2341234567890" className="flex items-center gap-2 text-[12px] text-text-muted hover:text-black transition-colors">
              <Phone size={14} strokeWidth={1.5} /> 
              +234 (123) 456-7890
            </a>
            <span className="flex items-center gap-2 text-[12px] text-text-muted">
              <MapPin size={14} strokeWidth={1.5} /> 
              Accra, Legon
            </span>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
