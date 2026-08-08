"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, User, Star, ShoppingBag, ChevronDown, Menu, X, Package, LogOut, Settings, LogIn } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDashStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/product-card";


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
          { name: "Bestsellers", href: "/shop?sortBy=rating" },
          { name: "Latest Products", href: "/shop?sortBy=newest" },
          { name: "Combo Package", href: "/shop?search=combo" },
          { name: "Discounted Products", href: "/shop?discounted=true" },
        ]
      }
    ],
    image: "/imgs/products/h-2.jpeg"
  },
  {
    name: "BLOG",
    href: "/blog",
    megaMenu: [
      {
        title: "Topics",
        items: [
          { name: "Skincare Tips", href: "/blog?topic=skincare-tips" },
          { name: "Makeup Tutorials", href: "/blog?topic=makeup-tutorials" },
          { name: "Brand News", href: "/blog?topic=brand-news" },
        ]
      },
      {
        title: "Latest Reads",
        items: [
          { name: "Achieving the Glow", href: "/blog/achieving-the-glow" },
          { name: "Winter Routine", href: "/blog/winter-routine" },
          { name: "Ingredient Spotlight", href: "/blog/ingredient-spotlight" },
        ]
      }
    ],
    image: "/imgs/products/h-3.jpg"
  },
  { 
    name: "CONTACT", 
    href: "/support",
    megaMenu: [
      {
        title: "Support",
        items: [
          { name: "Customer Service", href: "/support#contact" },
          { name: "FAQs", href: "/support#faq" },
          { name: "Shipping & Returns", href: "/support#shipping" },
        ]
      },
      {
        title: "Business",
        items: [
          { name: "Wholesale Inquiry", href: "/corporate#wholesale" },
          { name: "Press & Media", href: "/corporate#press" },
          { name: "Careers", href: "/corporate#careers" },
        ]
      }
    ],
    image: "/imgs/products/h-1.jpeg"
  },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const { user, cart, setUser, loadCart } = useDashStore();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.data?.products || []);
        }
      } catch (err) {
        console.error("Failed to fetch search results", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

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

  useEffect(() => {
    const fetchWishlistCount = async () => {
      try {
        const res = await fetch("/api/users/wishlist");
        if (res.ok) {
          const data = await res.json();
          setWishlistCount(data.wishlist.length);
          window.dispatchEvent(new CustomEvent("wishlistFetched", { detail: data.wishlist }));
        }
      } catch (err) {
        console.error("Failed to fetch wishlist count");
      }
    };

    if (user) {
      fetchWishlistCount();
    }

    const handleWishlistUpdated = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setWishlistCount(e.detail.length);
      } else {
        fetchWishlistCount();
      }
    };

    window.addEventListener("wishlistUpdated", handleWishlistUpdated);
    window.addEventListener("wishlistFetched", handleWishlistUpdated);
    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdated);
      window.removeEventListener("wishlistFetched", handleWishlistUpdated);
    };
  }, [user]);

  // Fetch user session on mount since Zustand state clears on hard refresh
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          if (data.user && data.user.cart) {
            loadCart(data.user.cart);
          }
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
      if (!res.ok) return;
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileClick = () => {
    if (user) {
      router.push("/profile");
    } else {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  };

  const [categories, setCategories] = useState<{name: string, _id: string, slug: string}[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to fetch categories");
      }
    }
    fetchCategories();
  }, []);

  const dynamicNavLinks = navLinks.map(link => {
    if (link.name === "SHOP" && categories.length > 0) {
      return {
        ...link,
        megaMenu: link.megaMenu?.map(col => {
          if (col.title === "Category") {
            return {
              ...col,
              items: [
                { name: "All Products", href: "/shop" },
                ...categories.map(cat => ({
                  name: cat.name,
                  href: `/shop?category=${cat.slug}` 
                }))
              ]
            }
          }
          return col;
        })
      };
    }
    return link;
  });

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col bg-surface border-b border-border/40">
      <div className="bg-[#5B7763] text-white text-xs sm:text-[13px] tracking-wide text-center py-2.5 px-4 w-full font-medium flex items-center justify-center gap-2">
        <span>All orders are delivered on Fridays.</span>
        <Link href="/delivery" className="underline font-bold hover:text-white/80 transition-colors">
          Learn more
        </Link>
      </div>

      <div className="w-full px-6 lg:px-12 flex items-center justify-between h-[80px]">
        
        <nav className="hidden lg:flex items-center space-x-8 h-full flex-1">
          {dynamicNavLinks.map((link) => (
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

              {/* Mega Menu */}
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
                      <div className="w-[160px] relative h-[200px] shrink-0 overflow-hidden bg-surface z-10">
                        <Image 
                          src={link.image} 
                          alt={`${link.name} Featured`} 
                          fill 
                          className="object-cover transition-transform duration-700 " 
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
          
          {/* Search Button */}
          <button 
            onClick={() => {
              setIsSearchOpen(true);
              setTimeout(() => searchInputRef.current?.focus(), 100);
            }}
            className="text-text-main hover:text-[#5B7763] transition-colors z-10 h-full flex items-center"
          >
            <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </button>

          <div className="relative flex items-center h-full" ref={userMenuRef}>
            {/* user button */}
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="group flex items-center justify-center gap-2 hover:text-[#5B7763] text-text-main transition-colors focus:outline-none"
            >
              <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
              {user?.name ? (
                <span className="text-[12px] font-medium tracking-wide sm:flex items-center hidden sm:block">
                  Hi, {user.name.split(" ")[0]} 
                  <ChevronDown className={`w-3.5 h-3.5 text-text-muted group-hover:text-[#5B7763] transition-all duration-300 ml-1 ${isUserMenuOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
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
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#5B7763] text-white text-[9px] font-bold rounded-full w-[14px] h-[14px] flex items-center justify-center">
                {wishlistCount}
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
      {mounted && createPortal(
        /* search container */
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 z-[9999] bg-white/95 backdrop-blur-md flex flex-col"
            >
              <div className="flex items-center justify-between px-6 lg:px-12 h-[100px] border-b border-border/40 bg-white shadow-sm">
                <div className="flex-1 max-w-4xl mx-auto flex items-center relative">
                  <Search className="w-6 h-6 text-text-muted absolute left-0" strokeWidth={1.5} />
                  <form onSubmit={handleSearchSubmit} className="w-full">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for products, categories..."
                      className="w-full text-xl md:text-3xl bg-transparent border-none focus:outline-none pl-12 text-[#222222] placeholder:text-text-muted/40 font-medium tracking-tight"
                    />
                  </form>
                </div>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="text-text-main hover:text-[#5B7763] transition-colors p-2 ml-4 bg-gray-100 hover:bg-gray-200 rounded-full"
                >
                  <X className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex-1 p-6 lg:p-12 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                  {searchQuery.trim() ? (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5B7763]">
                          {isSearching ? "Searching..." : `Results for "${searchQuery}"`}
                        </h3>
                        {searchResults.length > 0 && !isSearching && (
                          <button 
                            onClick={handleSearchSubmit}
                            className="text-[11px] font-bold uppercase tracking-widest text-[#222222] hover:text-[#5B7763] transition-colors"
                          >
                            View All Results &rarr;
                          </button>
                        )}
                      </div>
                      
                      {!isSearching && searchResults.length === 0 ? (
                        <p className="text-text-muted text-[13px]">No products found. Try a different search term.</p>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          {searchResults.map((product) => (
                            <div key={product._id} onClick={() => setIsSearchOpen(false)}>
                              <ProductCard product={product} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5B7763] mb-6">Popular Searches</h3>
                      <div className="flex flex-wrap gap-3">
                        {["Skincare", "Combo", "Serum", "Moisturizer", "Cleanser"].map((term) => (
                          <button 
                            key={term}
                            onClick={() => setSearchQuery(term)}
                            className="px-6 py-2 border border-border/60 text-[13px] font-medium text-text-muted hover:text-black hover:border-black transition-colors rounded-none"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}
