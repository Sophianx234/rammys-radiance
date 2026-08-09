"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Search, LogOut, Settings, Menu, LayoutDashboard, Package2, ShoppingCart, UsersRound, User, Package, ClipboardList } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useDashStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { fetchNotificationCountAction } from "@/app/actions/notifications";


export default function Topbar() {
  const [notifications, setNotifications] = useState(0);
  const { user, setUser } = useDashStore();
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();

  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch real notifications count
  useEffect(() => {
    fetchNotificationCountAction().then(setNotifications);
  }, []);


  const handleProfileClick = () => {
    if (user) {
      router.push("/profile");
    } else {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) return console.error("Logout failed");
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ---------- TOPBAR ---------- */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 w-full h-20 flex items-center justify-between border-b border-border/40 bg-white px-6 md:px-10"
      >
        {/* Left: Menu button */}
        <div className="flex items-center gap-3">
          <Menu
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden text-text-muted hover:text-[#5B7763] cursor-pointer transition-colors"
          />
        </div>

        {/* Center: Search bar (Desktop only) */}
        <div className="hidden md:flex items-center relative w-full max-w-md">
          <Search
            size={16}
            className="absolute left-4 text-text-muted pointer-events-none"
          />
          <Input
            placeholder="Search products, orders, or users..."
            className="pl-11 pr-4 h-11 bg-secondary/30 border-transparent focus-visible:ring-1 focus-visible:ring-[#5B7763]/30 text-[13px] text-[#222222] placeholder:text-text-muted/70 rounded-none w-full transition-all"
          />
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center ">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/overview")}
            className="relative hover:bg-secondary/30 border-none transition-all text-text-muted hover:text-[#222222] rounded-none h-10 w-10 flex-shrink-0"
          >
            <Bell size={18} strokeWidth={1.5} />
            {notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[14px] h-[14px] rounded-full bg-[#5B7763] text-white text-[9px] font-bold tracking-tighter shadow-sm border border-white px-0.5">
                {notifications > 99 ? '99+' : notifications}
              </span>
            )}
          </Button>

          {/* Profile dropdown */}
          <div className="relative flex items-center h-full" ref={userMenuRef}>
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="group flex items-center gap-3 hover:bg-secondary/30 transition-colors p-1.5 pr-4 rounded-none outline-none focus:outline-none"
            >
              {user ? (
                <>
                  {user.profile ? (
                    <img
                      src={user.profile}
                      alt={user.name}
                      width={36}
                      height={36}
                      className="rounded-full size-10 object-cover border border-border/40"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary border border-border/40 text-[#222222] font-semibold text-sm">
                      {user.name
                        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
                        : "U"}
                    </div>
                  )}

                  <div className="hidden sm:flex flex-col items-start gap-0.5">
                    <span className="text-[13px] font-semibold text-[#222222] leading-none">
                      {user.name || "Unknown"}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#5B7763] leading-none">
                      {user.role}
                    </span>
                  </div>
                </>
              ) : (
               <div className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-secondary" />
                  <div className="hidden sm:flex flex-col items-start gap-1.5">
                    <div className="h-3 w-20 bg-secondary" />
                    <div className="h-2 w-12 bg-secondary" />
                  </div>
                </div>
              )}
            </button>

            <div className={`absolute top-[4.5rem] right-0 pt-4 w-56 transition-all duration-300 z-50 ${isUserMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              <div className={`relative bg-white border border-border/40 shadow-sm flex flex-col transform transition-transform duration-300 ${isUserMenuOpen ? 'translate-y-0' : 'translate-y-2'}`}>
                {/* Pointed Edge (Caret) */}
                <div className="absolute -top-[7px] right-[24px] w-[13px] h-[13px] bg-white border-t border-l border-border/40 transform rotate-45 z-0"></div>
                
                <div className="flex flex-col relative z-10 py-2">
                  <div className="px-4 py-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-text-muted">Account</span>
                  </div>
                  <div className="border-t border-border/40 my-1" />

                  <Link href="/admin/settings" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-text-muted hover:text-black hover:bg-secondary/50 transition-colors">
                    <Settings className="w-4 h-4" /> Settings
                  </Link>

                  <div className="border-t border-border/40 my-1" />

                  <button onClick={() => { handleLogout(); setIsUserMenuOpen(false); }} className="flex items-center justify-center gap-2 w-full text-center px-4 py-2.5 text-[13px] font-medium text-[#5B7763] hover:bg-[#5B7763]/10 transition-colors">
                     {loading ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ---------- MOBILE NAV DROPDOWN ---------- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden sticky top-20 left-0 w-full z-40 bg-white border-b border-border/40 shadow-lg"
          >
            <div className="flex flex-col p-4 space-y-1">
              {(user?.role === "admin" || user?.role === "manager") && (
                <>
                  <Link
                    href="/admin/overview"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-[12px] uppercase tracking-wider font-bold text-text-muted hover:text-[#222222] hover:bg-secondary/50 transition-colors"
                  >
                    <LayoutDashboard size={16} strokeWidth={1.5} /> Overview
                  </Link>

                  <Link
                    href="/admin/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-[12px] uppercase tracking-wider font-bold text-text-muted hover:text-[#222222] hover:bg-secondary/50 transition-colors"
                  >
                    <Package2 size={16} strokeWidth={1.5} /> Products
                  </Link>

                  <Link
                    href="/admin/customers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-[12px] uppercase tracking-wider font-bold text-text-muted hover:text-[#222222] hover:bg-secondary/50 transition-colors"
                  >
                    <UsersRound size={16} strokeWidth={1.5} /> Customers
                  </Link>
                </>
              )}
              {user?.role === "admin" && (
                <Link
                  href="/admin/activity"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-[12px] uppercase tracking-wider font-bold text-text-muted hover:text-[#222222] hover:bg-secondary/50 transition-colors"
                >
                  <ClipboardList size={16} strokeWidth={1.5} /> Activity Logs
                </Link>
              )}

              <Link
                href="/admin/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-[12px] uppercase tracking-wider font-bold text-text-muted hover:text-[#222222] hover:bg-secondary/50 transition-colors"
              >
                <ShoppingCart size={16} strokeWidth={1.5} /> Orders
              </Link>

              <div
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-[12px] uppercase tracking-wider font-bold text-red-600 hover:bg-red-50/50 cursor-pointer transition-colors mt-2"
              >
                <LogOut size={16} strokeWidth={1.5} /> {loading ? 'Logging out...' : "Logout"}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
