"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, User, Star, ShoppingBag, ChevronDown, Menu, X, Package, LogOut, Settings, LogIn } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDashStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";


const navLinks = [
  {
    name: "HOME",
    href: "/",
  },
  {
    name: "SHOP",
    href: "/shop",
    megaMenu: [
      {
        title: "Category",
        items: [
          { name: "All Products", href: "/shop" },
          { name: "Skincare", href: "/shop/skincare" },
          { name: "Makeup", href: "/shop/makeup" },
          { name: "Gift Sets", href: "/shop/gifts" },
        ]
      },
      {
        title: "Featured",
        items: [
          { name: "Bestsellers", href: "/shop/bestsellers" },
          { name: "The Glow Routine", href: "/routine/glow" },
          { name: "Autumn Edit", href: "/collection/autumn" },
        ]
      }
    ],
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "BLOG",
    href: "#",
    megaMenu: [
      {
        title: "Topics",
        items: [
          { name: "Skincare Tips", href: "#" },
          { name: "Makeup Tutorials", href: "#" },
          { name: "Brand News", href: "#" },
        ]
      },
      {
        title: "Latest Reads",
        items: [
          { name: "Achieving the Glow", href: "#" },
          { name: "Winter Routine", href: "#" },
          { name: "Ingredient Spotlight", href: "#" },
        ]
      }
    ],
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400"
  },
  { 
    name: "CONTACT", 
    href: "#",
    megaMenu: [
      {
        title: "Support",
        items: [
          { name: "Customer Service", href: "#" },
          { name: "FAQs", href: "#" },
          { name: "Shipping & Returns", href: "#" },
        ]
      },
      {
        title: "Business",
        items: [
          { name: "Wholesale Inquiry", href: "#" },
          { name: "Press & Media", href: "#" },
          { name: "Careers", href: "#" },
        ]
      }
    ],
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=400"
  },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, cart, setUser } = useDashStore();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch user session on mount since Zustand state clears on hard refresh
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user session");
      }
    };
    if (!user) {
      fetchUser();
    }
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) return console.error("Logout failed");
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col bg-surface border-b border-border/40">
      <div className="bg-[#5B7763] text-white text-xs sm:text-[13px] tracking-wide text-center py-2.5 px-4 w-full font-medium">
        Free shipping on all U.S. orders $50+
      </div>

      <div className="w-full px-6 lg:px-12 flex items-center justify-between h-[80px]">
        
        <nav className="hidden lg:flex items-center space-x-8 h-full flex-1">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group flex items-center h-full">
              <Link 
                href={link.href} 
                className="flex items-center text-[12px] font-semibold text-text-main tracking-[0.1em] uppercase hover:text-black transition-colors"
              >
                {link.name}
                {link.megaMenu && (
                  <ChevronDown className="ml-1 w-3.5 h-3.5 text-text-muted transition-transform duration-300 group-hover:rotate-180" strokeWidth={2} />
                )}
              </Link>

              {/* Mega Menu (used for all dropdowns now) */}
              {link.megaMenu && (
                <div className="absolute top-16 left-[-20px] pt-4 w-[600px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="relative bg-white border border-border/40 shadow-md flex p-8 gap-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {/* Pointed Edge (Caret) */}
                    <div className="absolute -top-[7px] left-[32px] w-[13px] h-[13px] bg-white border-t border-l border-border/40 transform rotate-45 z-0"></div>
                    
                    <div className="flex-1 flex gap-10 relative z-10">
                      {link.megaMenu.map(col => (
                        <div key={col.title} className="flex-1">
                          <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-main mb-5">{col.title}</h4>
                          <ul className="space-y-4">
                            {col.items.map(item => (
                              <li key={item.name}>
                                <Link href={item.href} className="text-[13px] text-text-muted hover:text-black transition-colors">
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    {link.image && (
                      <div className="w-[220px] relative h-[180px] shrink-0 overflow-hidden bg-surface z-10">
                        <Image 
                          src={link.image} 
                          alt={`${link.name} Featured`} 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-105" 
                          sizes="220px"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Center: Logo */}
        <div className="flex-1 lg:flex-none flex justify-center lg:absolute lg:left-1/2 lg:-translate-x-1/2 h-full items-center">
          <Link href="/">
            <Image 
              src="/imgs/logo.jpeg" 
              alt="Rammy's Radiance Logo" 
              width={160} 
              height={48} 
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center justify-end space-x-6 h-full flex-1">
          <button className="text-text-main hover:text-black transition-colors">
            <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </button>

          <div className="relative flex items-center h-full" ref={userMenuRef}>
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center justify-center gap-2 text-text-main hover:text-black transition-colors focus:outline-none"
            >
              <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
              {user?.name ? (
                <span className="text-[12px] font-medium tracking-wide hidden sm:block">
                  Hi, {user.name.split(" ")[0]}
                </span>
              ) : <span className="text-[12px] font-medium tracking-wide hidden sm:block pt-1">Account</span>}
            </button>

            <div className={`absolute top-[3.5rem] right-0 pt-4 w-48 transition-all duration-300 z-50 ${isUserMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>

              <div className={`relative bg-white border border-border/40 shadow-sm flex flex-col transform transition-transform duration-300 ${isUserMenuOpen ? 'translate-y-0' : 'translate-y-2'}`}>
                {/* Pointed Edge (Caret) */}
                <div className="absolute -top-[7px] right-[18px] w-[13px] h-[13px] bg-white border-t border-l border-border/40 transform rotate-45 z-0"></div>
                
                <div className="flex flex-col relative z-10 py-2">
                  {/* drop down items */}
                  {user ? (
                    <>
                      <Link href="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-text-muted hover:text-black hover:bg-secondary/50 transition-colors">
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link href="/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-text-muted hover:text-black hover:bg-secondary/50 transition-colors">
                        <Package className="w-4 h-4" /> Orders
                      </Link>
                      {/* <Link href="/login" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-text-muted hover:text-black hover:bg-secondary/50 transition-colors">
                        <Settings className="w-4 h-4" /> Settings
                      </Link> */}
                      <div className="my-1 border-t border-border/40" />
                      <button onClick={() => { handleLogout(); setIsUserMenuOpen(false); }} className="flex items-center justify-center gap-2 w-full text-center px-4 py-2.5 text-[13px] font-medium text-[#5B7763] hover:bg-[#5B7763]/10 transition-colors">
                         Logout
                      </button>
                    </>
                  ) : (
                    <>
                    {/* drop down items 2*/}
                    <Link href="/login" onClick={() => setIsUserMenuOpen(false)} className="flex items-center shadow-2xl justify-center gap-2 px-4 my-2 py-2.5 text-[13px] text-center bg-[#5B7763] font-medium text-white mx-3 hover:bg-opacity-90 transition-colors">
                      <LogIn className="w-4 h-4" /> Login 
                     </Link>
                      <div className="my-1 border-t border-border/40" />

                     <Link href="/login" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-text-muted hover:text-black hover:bg-secondary/50 transition-colors">
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link href="/login" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-text-muted hover:text-black hover:bg-secondary/50 transition-colors">
                        <Package className="w-4 h-4" /> Orders
                      </Link>
                      <Link href="/login" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-text-muted hover:text-black hover:bg-secondary/50 transition-colors">
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Link href="/wishlist" className="relative text-text-main hover:text-black transition-colors hidden sm:block">
            <Star className="w-[18px] h-[18px]" strokeWidth={1.5} />
            {user?.wishlist && user.wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#5B7763] text-white text-[9px] font-bold rounded-full w-[14px] h-[14px] flex items-center justify-center">
                {user.wishlist.length}
              </span>
            )}
          </Link>

          <Link href="/cart" className="relative text-text-main hover:text-black transition-colors">
            <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
            <span className="absolute -top-1.5 -right-2 bg-[#5B7763] text-white text-[9px] font-bold rounded-full w-[14px] h-[14px] flex items-center justify-center">
              {cart?.reduce((acc, item: any) => acc + (item.quantity || 1), 0) || 0}
            </span>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-text-main hover:text-black transition ml-2"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            ref={menuRef}
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-white border-t border-border/40"
          >
            <div className="px-6 py-6 space-y-6">
              {navLinks.map((link) => (
                <div key={link.name} className="flex flex-col space-y-3">
                  <Link
                    href={link.href}
                    onClick={() => !link.megaMenu && setIsOpen(false)}
                    className="block text-[13px] font-semibold tracking-widest text-text-main uppercase"
                  >
                    {link.name}
                  </Link>
                  {link.megaMenu && (
                    <div className="pl-4 flex flex-col space-y-3 border-l border-border/40">
                      {link.megaMenu[0].items.map(sub => (
                        <Link key={sub.name} href={sub.href} onClick={() => setIsOpen(false)} className="text-[13px] text-text-muted">
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
