"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { IUser } from "@/models/User";
import { Button } from "@/components/ui/button";
import { useDashStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState<"user" | "admin">("user");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [queryString, setQueryString] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setQueryString(window.location.search);
    }
  }, []);

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";
  const cartParam = searchParams.get("cart") || "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to login");
        setLoading(false);
        return;
      }

      if (res.ok) {
        let resMe = await fetch("/api/auth/me");
        let userData = await resMe.json();
        if (resMe.ok) {
          const userRole = (userData.user as IUser).role;
          
          if (["user", "customer"].includes(userRole) && cartParam) {
            try {
              const cartItems = JSON.parse(decodeURIComponent(cartParam));
              if (cartItems.length > 0) {
                await fetch("/api/users/cart", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(cartItems),
                });
                
                // Fetch fresh user data with updated cart from DB
                resMe = await fetch("/api/auth/me");
                userData = await resMe.json();
              }
            } catch (e) {
              console.error("Failed to sync cart", e);
            }
          }

          // Hydrate the Zustand store so client components immediately see the user and their cart without a hard reload
          useDashStore.getState().setUser(userData.user);
          if (userData.user.cart) {
            useDashStore.getState().loadCart(userData.user.cart);
          }

          if (redirect) {
            const redirectUrl = cartParam ? `${redirect}?cart=${encodeURIComponent(cartParam)}` : redirect;
            // Force a full reload to ensure global state fetches fresh from DB
            window.location.href = redirectUrl;
          } else if (userRole === "admin") {
            router.push("/admin/products");
          } else if (userRole === "dispatcher") {
            router.push("/admin/orders");
          } else {
            router.push("/");
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-dvh lg:h-dvh font-sans bg-surface lg:grid-cols-2 overflow-hidden">
      {/* Left Section (Form) */}
      <div className="flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto scrollbar-hide">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex justify-center mb-2 mt-24">
            <Link href="/">
              <Image 
                src="/imgs/logo.jpeg" 
                alt="Rammy's Radiance" 
                width={180} 
                height={54} 
                className="object-contain"
                priority
              />
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-text-main mb-4">
              Welcome Back
            </h1>
            <p className="text-[13px] text-text-muted tracking-wide">
              Sign in to continue your journey to radiant skin.
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted">
                Email Address or Phone Number
              </label>
              <input
                id="email"
                type="text"
                placeholder="Enter your email or phone number"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full border-b border-border/60 bg-transparent text-[14px] text-text-main focus:border-black focus:outline-none transition-colors placeholder:text-border"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[11px] font-bold tracking-widest uppercase text-text-main hover:text-[#5B7763] transition-colors">
                  Forgot?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full border-b border-border/60 bg-transparent text-[14px] text-text-main focus:border-black focus:outline-none transition-colors placeholder:text-border"
              />
            </div>

            {error && (
              <p className="text-red-500 text-[12px] font-medium text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-14 mt-4 w-full bg-black hover:bg-black/80 rounded-none text-white text-[12px] font-bold tracking-[0.2em] uppercase transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/40" />
              </div>
              
            </div>

            
          </form>

          <p className="mt-4 text-center text-[12px] text-text-muted">
            Don't have an account?{" "}
            <Link href={queryString ? `/signup${queryString}` : "/signup"} className="font-bold uppercase tracking-[0.1em] text-text-main hover:text-[#5B7763] transition-colors ml-1">
              Create One
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section (Image) */}
      <div className="relative hidden lg:block bg-surface h-full">
        <Image
          src="/imgs/c-1.jpg"
          alt="Rammy's Radiance Model"
          fill
          className="object-cover"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-black/5" />
      </div>
    </div>
  );
}
