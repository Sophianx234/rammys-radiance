"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, User, Star, ShoppingBag, ChevronDown, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDashStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, cart, setUser } = useDashStore();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

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

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "ELEMENTS", href: "#" },
    { name: "SHOP", href: "/shop" },
    { name: "BLOG", href: "#" },
    { name: "PAGES", href: "#" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col bg-surface border-b border-border">
      {/* Top Banner */}
      <div className="bg-[#5B7763] text-white text-xs sm:text-sm text-center py-2.5 px-4 w-full font-medium">
        Free shipping on all U.S. orders $50+
      </div>

      {/* Main Navbar */}
      <div className="w-full px-6 lg:px-12 flex items-center justify-between h-[80px]">
        
        {/* Left: Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-8 flex-1">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="flex items-center text-[13px] font-semibold text-text-main tracking-[0.08em] hover:text-action-primary transition-colors"
            >
              {link.name}
              <ChevronDown className="ml-1.5 w-3.5 h-3.5 text-text-muted" strokeWidth={2} />
            </Link>
          ))}
        </nav>

        {/* Center: Logo */}
        <div className="flex-1 lg:flex-none flex justify-center lg:absolute lg:left-1/2 lg:-translate-x-1/2">
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
        <div className="flex items-center justify-end space-x-6 flex-1">
          <button className="text-text-main hover:text-action-primary transition-colors">
            <Search className="w-[20px] h-[20px]" strokeWidth={1.5} />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-text-main hover:text-action-primary transition-colors">
                <User className="w-[20px] h-[20px]" strokeWidth={1.5} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-surface">
              {user ? (
                <>
                  <DropdownMenuItem asChild><Link href="/profile">My Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/orders">Orders</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <button onClick={handleLogout} className="w-full text-left text-red-500">Logout</button>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild><Link href="/login">Login / Register</Link></DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/wishlist" className="relative text-text-main hover:text-action-primary transition-colors hidden sm:block">
            <Star className="w-[20px] h-[20px]" strokeWidth={1.5} />
            <span className="absolute -top-2 -right-2 bg-text-main text-surface text-[10px] font-bold rounded-full w-[16px] h-[16px] flex items-center justify-center">
              0
            </span>
          </Link>

          <Link href="/cart" className="relative text-text-main hover:text-action-primary transition-colors">
            <ShoppingBag className="w-[20px] h-[20px]" strokeWidth={1.5} />
            <span className="absolute -top-2 -right-2 bg-text-main text-surface text-[10px] font-bold rounded-full w-[16px] h-[16px] flex items-center justify-center">
              {cart?.length || 0}
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-text-main hover:text-action-primary transition ml-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            ref={menuRef}
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-surface border-t border-border"
          >
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-sm font-semibold tracking-wider text-text-main hover:text-action-primary"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
