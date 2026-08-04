"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
    formData.append("email", email);
    formData.append("otp", otp);
    formData.append("password", password);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        // Skip the image upload step and go straight to the home page.
        // Using window.location.href forces a hard reload so the Navbar updates with user info!
        window.location.href = "/";
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
          <div className="flex justify-center mb-12">
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

          {/* STEP 1: Name and Email */}
          {step === 1 && (
            <form className="flex flex-col gap-6" onSubmit={handleSendOtp}>
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

              <Button
                variant="outline"
                type="button"
                className="h-14 w-full rounded-none border border-border/60 bg-transparent hover:bg-white text-[12px] font-bold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                GitHub
              </Button>

              <p className="mt-10 text-center text-[12px] text-text-muted pb-4">
                Already have an account?{" "}
                <Link href="/login" className="font-bold uppercase tracking-[0.1em] text-text-main hover:text-[#5B7763] transition-colors ml-1">
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
