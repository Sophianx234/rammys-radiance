"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Home, ShoppingBag, User, Heart, LogOut, Sun, Moon, BarChart3 } from "lucide-react"
import { useDashStore } from "@/lib/store"
import { useTheme } from "next-themes"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, setUser } = useDashStore()
  const isLoggedIn = !!user
  const { theme, setTheme } = useTheme()
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      window.location.href = "/login"
    } catch(e) {}
  }

  const navigationItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: ShoppingBag, label: "Shop", href: "/shop" },
    ...(isLoggedIn
      ? [
          { icon: User, label: "Account", href: "/profile" },
          { icon: Heart, label: "Wishlist", href: "/wishlist" },
          { icon: BarChart3, label: "Admin", href: "/admin" },
        ]
      : []),
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:left-0 lg:top-16 lg:w-64 lg:h-[calc(100vh-64px)] lg:bg-card lg:border-r lg:border-border lg:flex lg:flex-col">
        <nav className="flex-1 p-6 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-sm">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-border space-y-3">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-sm"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-5 h-5" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          {isLoggedIn && (
            <button
              onClick={() => {
                logout()
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 transition-colors text-sm text-destructive"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-40 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/50 z-30 top-16" onClick={() => setIsOpen(false)} />
          <div className="lg:hidden fixed top-16 right-0 w-64 h-[calc(100vh-64px)] bg-card border-l border-border z-40 flex flex-col">
            <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-sm">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  </Link>
                )
              })}
            </nav>

            <div className="p-6 border-t border-border space-y-3">
              <button
                onClick={() => {
                  toggleTheme()
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-sm"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-5 h-5" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              {isLoggedIn && (
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 transition-colors text-sm text-destructive"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
