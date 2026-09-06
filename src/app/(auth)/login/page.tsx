"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { IUser } from "@/models/User";
import { Button } from "@/components/ui/button";
import { useDashStore } from "@/lib/store";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<1 | 2>(1); // 1 = Credentials, 2 = OTP
  const [adminEmailForOtp, setAdminEmailForOtp] = useState("");
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

  const handleCredentialsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to login");
        setLoading(false);
        return;
      }

      if (data.requiresOtp) {
        // Admin 2FA triggered
        setAdminEmailForOtp(data.email);
        setStep(2);
        setLoading(false);
        return;
      }

      await finalizeLogin(res);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmailForOtp, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Invalid OTP");
        setLoading(false);
        return;
      }

      await finalizeLogin(res);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  const finalizeLogin = async (res: Response) => {
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
              
              resMe = await fetch("/api/auth/me");
              userData = await resMe.json();
            }
          } catch (e) {
            console.error("Failed to sync cart", e);
          }
        }

        useDashStore.getState().setUser(userData.user);
        if (userData.user.cart) {
          useDashStore.getState().loadCart(userData.user.cart);
        }

        if (redirect) {
          const redirectUrl = cartParam ? `${redirect}?cart=${encodeURIComponent(cartParam)}` : redirect;
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
              {step === 1 ? "Welcome Back" : "Admin Verification"}
            </h1>
            <p className="text-[13px] text-text-muted tracking-wide">
              {step === 1 
                ? "Sign in to continue your journey to radiant skin." 
                : "An OTP has been sent to your email to verify your identity."}
            </p>
          </div>

          {step === 1 && (
            <form className="flex flex-col gap-6" onSubmit={handleCredentialsSubmit}>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted">
                  Email / Phone 
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
            </form>
          )}

          {step === 2 && (
            <form className="flex flex-col gap-6" onSubmit={handleOtpSubmit}>
              <div className="flex flex-col gap-4 items-center">
                <label htmlFor="otp" className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted">
                  Verification Code
                </label>
                <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-12 h-14 text-xl bg-transparent" />
                    <InputOTPSlot index={1} className="w-12 h-14 text-xl bg-transparent" />
                    <InputOTPSlot index={2} className="w-12 h-14 text-xl bg-transparent" />
                    <InputOTPSlot index={3} className="w-12 h-14 text-xl bg-transparent" />
                    <InputOTPSlot index={4} className="w-12 h-14 text-xl bg-transparent" />
                    <InputOTPSlot index={5} className="w-12 h-14 text-xl bg-transparent" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {error && (
                <p className="text-red-500 text-[12px] font-medium text-center">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading || otp.length < 6}
                className="h-14 mt-4 w-full bg-black hover:bg-black/80 rounded-none text-white text-[12px] font-bold tracking-[0.2em] uppercase transition-colors"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </Button>
              
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[11px] font-bold uppercase tracking-widest text-text-muted hover:text-text-main transition-colors mt-2"
              >
                Go Back
              </button>
            </form>
          )}

          {step === 1 && (
            <p className="mt-10 text-center text-[12px] text-text-muted">
              Don't have an account?{" "}
              <Link href={queryString ? `/signup${queryString}` : "/signup"} className="font-bold uppercase tracking-[0.1em] text-text-main hover:text-[#5B7763] transition-colors ml-1">
                Create One
              </Link>
            </p>
          )}
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
