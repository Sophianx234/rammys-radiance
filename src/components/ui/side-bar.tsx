"use client";

import {
  LayoutDashboard,
  Package2,
  ShoppingCart,
  UsersRound,
  Settings,
  LogOut,
  LucidePanelLeft,
  ClipboardList,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useDashStore } from "@/lib/store";
import type { IUser } from "@/models/User";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const navItems = [
  { name: "Overview", key: "overview", icon: LayoutDashboard, path: "/admin/overview" },
  { name: "Products", key: "products", icon: Package2, path: "/admin/products" },
  { name: "Orders", key: "orders", icon: ShoppingCart, path: "/admin/orders" },
  { name: "Customers", key: "customers", icon: UsersRound, path: "/admin/customers" },
  { name: "Activity Logs", key: "activity", icon: ClipboardList, path: "/admin/activity" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { setUser, user } = useDashStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // <-- monitor current path
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    // Fetch user if not in state
    const getMe = async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (res.ok) setUser(data.user as IUser);
    };
    if (!user) getMe();
  }, [user, setUser]);

  useEffect(() => {
    // Set active tab based on current path
    const current = navItems.find((item) => pathname?.startsWith(item.path));
    if (current) setActiveTab(current.key);
  }, [pathname]);

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
      if (!res.ok) throw new Error("Logout failed");
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside
      className={`h-screen hidden md:flex sticky top-0 flex-col border-r border-border/40 bg-white transition-all duration-300 ${
        collapsed ? "w-[80px]" : "w-[260px]"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between h-20 border-b border-border/40 px-4">
        {!collapsed && (
          <div className="flex items-center gap-3 overflow-hidden ">
            <div className="flex flex-col">
              <Image 
                src="/imgs/logo.jpeg" 
                alt="Rammy's Radiance Logo" 
                width={170} 
                height={36} 
                className="object-contain -ml-7"
                priority
              />
              
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-text-muted hover:text-[#5B7763] hover:bg-secondary/50 rounded-none h-10 w-10 mx-auto transition-colors"
        >
          <LucidePanelLeft size={18} strokeWidth={1.5} />
        </Button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto overflow-x-hidden">
        {navItems.map(({ name, key, icon: Icon }) => {
          const role = user?.role === "dispatcher" ? "dispatch" : (user?.role === "customer" ? "user" : user?.role);
          if (role === "dispatch" && key !== "orders") return null;
          if (key === "activity" && role !== "admin") return null;

          const isActive = activeTab === key;

          return (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                router.push(navItems.find((item) => item.key === key)?.path || "/");
              }}
              className={`relative flex items-center gap-4 w-full px-4 py-3.5 transition-all outline-none focus:outline-none group ${
                isActive
                  ? "bg-secondary/70 text-[#222222]"
                  : "text-text-muted hover:text-[#222222] hover:bg-secondary/40"
              } ${collapsed ? "justify-center px-0" : ""}`}
            >
              <Icon 
                size={18} 
                strokeWidth={1.5}
                className={`flex-shrink-0 transition-colors ${isActive ? "text-[#5B7763]" : "text-text-muted group-hover:text-[#222222]"}`} 
              />
              
              {!collapsed && (
                <span className="text-[11px] uppercase tracking-wider font-bold whitespace-nowrap">
                  {name}
                </span>
              )}
              
              {isActive && (
                <motion.span
                  layoutId="activeSidebarIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1/2 w-1 bg-[#5B7763]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* FOOTER ACTIONS */}
      <div className="border-t border-border/40 p-4 mt-auto space-y-1">
        <button
          onClick={() => router.push("/admin/settings")}
          className={`flex items-center gap-4 w-full px-4 py-3.5 text-text-muted hover:text-[#222222] hover:bg-secondary/40 transition-colors outline-none focus:outline-none group ${collapsed ? "justify-center px-0" : ""}`}
        >
          <Settings size={18} strokeWidth={1.5} className="flex-shrink-0 text-text-muted group-hover:text-[#222222] transition-colors" />
          {!collapsed && <span className="text-[11px] uppercase tracking-wider font-bold whitespace-nowrap">Settings</span>}
        </button>

        <button
          onClick={handleLogout}
          disabled={loading}
          className={`flex items-center gap-4 w-full px-4 py-3.5 text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-colors outline-none focus:outline-none group ${collapsed ? "justify-center px-0" : ""}`}
        >
          <LogOut size={18} strokeWidth={1.5} className="flex-shrink-0 text-red-600 group-hover:text-red-700 transition-colors" />
          {!collapsed && (
            <span className="text-[11px] uppercase tracking-wider font-bold whitespace-nowrap">
              {loading ? "Logging out..." : "Logout"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
