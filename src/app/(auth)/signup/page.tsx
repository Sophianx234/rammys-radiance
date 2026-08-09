"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useDashStore } from "@/lib/store";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [queryString, setQueryString] = useState("");
  const [useEmail, setUseEmail] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setQueryString(window.location.search);
    }
  }, []);

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";
  const cartParam = searchParams.get("cart") || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!useEmail) {
      if (!phone) {
        setError("Phone number is required");
        setLoading(false);
        return;
      }
      setStep(3); // Skip OTP for phone
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2);
      } else {
        setError(data.message || "Failed to send verification code");
      }
    } catch (err) {
      setError("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(3);
      } else {
        setError(data.message || "Invalid or expired verification code");
      }
    } catch (err) {
      setError("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("password", password);
    
    if (useEmail) {
      formData.append("email", email);
      formData.append("otp", otp);
    } else {
      formData.append("phone", phone);
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        if (cartParam) {
          try {
            const cartItems = JSON.parse(decodeURIComponent(cartParam));
            if (cartItems.length > 0) {
              await fetch("/api/users/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cartItems),
              });
            }
          } catch (e) {
            console.error("Failed to sync cart", e);
          }
        }


        if (redirect) {
          const redirectUrl = cartParam ? `${redirect}?cart=${encodeURIComponent(cartParam)}` : redirect;
          window.location.href = redirectUrl;
        } else {
          window.location.href = "/";
        }
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Internal server error");
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
          <div className="flex justify-center pt-12">
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

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-text-main mb-3">
              {step === 1 && "Join Us"}
              {step === 2 && "Verification"}
              {step === 3 && "Secure Account"}
            </h1>
            <p className="text-[13px] text-text-muted tracking-wide">
              {step === 1 && "Create an account to start your radiance journey."}
              {step === 2 && `Enter the 6-digit code sent to ${email}`}
              {step === 3 && "Create a secure password for your account."}
            </p>
          </div>

          {/* STEP 1: Name and Email/Phone */}
          {step === 1 && (
            <form className="flex flex-col gap-6" onSubmit={handleSendOtp}>
              <div className="flex gap-4 mb-2">
                <button
                  type="button"
                  onClick={() => setUseEmail(true)}
                  className={`flex-1 pb-2 text-[11px] font-bold uppercase tracking-widest border-b-2 transition-colors ${
                    useEmail ? "border-black text-black" : "border-transparent text-text-muted hover:text-black"
                  }`}
                >
                  Use Email
                </button>
                <button
                  type="button"
                  onClick={() => setUseEmail(false)}
                  className={`flex-1 pb-2 text-[11px] font-bold uppercase tracking-widest border-b-2 transition-colors ${
                    !useEmail ? "border-black text-black" : "border-transparent text-text-muted hover:text-black"
                  }`}
                >
                  Use Phone Number
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 w-full border-b border-border/60 bg-transparent text-[14px] text-text-main focus:border-black focus:outline-none transition-colors placeholder:text-border"
                />
              </div>

              {useEmail ? (
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full border-b border-border/60 bg-transparent text-[14px] text-text-main focus:border-black focus:outline-none transition-colors placeholder:text-border"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 w-full border-b border-border/60 bg-transparent text-[14px] text-text-main focus:border-black focus:outline-none transition-colors placeholder:text-border"
                  />
                </div>
              )}

              {error && <p className="text-red-500 text-[12px] font-medium text-center">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="h-14 mt-4 w-full bg-black hover:bg-black/80 rounded-none text-white text-[12px] font-bold tracking-[0.2em] uppercase transition-colors"
              >
                {loading ? "Sending Code..." : "Continue"}
              </Button>
            </form>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 2 && (
            <form className="flex flex-col gap-6" onSubmit={handleVerifyOtp}>
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

              {error && <p className="text-red-500 text-[12px] font-medium text-center">{error}</p>}

              <Button
                type="submit"
                disabled={loading || otp.length < 6}
                className="h-14 mt-4 w-full bg-black hover:bg-black/80 rounded-none text-white text-[12px] font-bold tracking-[0.2em] uppercase transition-colors"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
              
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[11px] font-bold uppercase tracking-widest text-text-muted hover:text-text-main transition-colors mt-2"
              >
                Change Email
              </button>
            </form>
          )}

          {/* STEP 3: Passwords */}
          {step === 3 && (
            <form className="flex flex-col gap-6" onSubmit={handleFinalSignup}>
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted">
                  Password
                </label>
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

              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 w-full border-b border-border/60 bg-transparent text-[14px] text-text-main focus:border-black focus:outline-none transition-colors placeholder:text-border"
                />
              </div>

              {error && <p className="text-red-500 text-[12px] font-medium text-center">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="h-14 mt-4 w-full bg-black hover:bg-black/80 rounded-none text-white text-[12px] font-bold tracking-[0.2em] uppercase transition-colors"
              >
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </form>
          )}

          {/* Global Footer elements for step 1 only */}
          {step === 1 && (
            <>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/40" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-surface px-4 text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted">Or</span>
                </div>
              </div>

              

              <p className="mt-10 text-center text-[12px] text-text-muted pb-4">
                Already have an account?{" "}
                <Link href={queryString ? `/login${queryString}` : "/login"} className="font-bold uppercase tracking-[0.1em] text-text-main hover:text-[#5B7763] transition-colors ml-1">
                  Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Right Section (Image) */}
      <div className="relative hidden lg:block bg-surface h-full">
        <Image
          src="/imgs/c-2.jpg"
          alt="Rammy's Radiance Signup"
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
