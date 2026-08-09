"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Simple regex to detect if the input looks like a phone number instead of an email
  const isPhoneInput = email.length > 0 && !email.includes("@") && /^\+?[0-9\s\-]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPhoneInput) return; // Prevent submission if it's a phone number

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to send reset email.");
      } else {
        setSuccess("Password reset link sent! Check your email.");
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
          <div className="flex justify-center mb-16">
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
              Reset Password
            </h1>
            <p className="text-[13px] text-text-muted tracking-wide">
              Enter your email or phone number to reset your password.
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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

            {isPhoneInput && (
              <div className="bg-transparent border border-border/80 p-6 text-center mt-2">
                <p className="text-[12px] text-text-muted mb-4 tracking-wide leading-relaxed">
                  Account recovery for phone numbers is securely handled by our dedicated support team.
                </p>
                <a 
                  href={`https://wa.me/233554802687?text=${encodeURIComponent(`Hello, I need help recovering my Rammy's Radiance account registered with the phone number: ${email}`)}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="block w-full bg-black  text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors"
                >
                  Message on WhatsApp
                </a>
              </div>
            )}

            {error && !isPhoneInput && (
              <p className="text-red-500 text-[12px] font-medium text-center">{error}</p>
            )}
            {success && !isPhoneInput && (
              <p className="text-[#5B7763] text-[12px] font-medium text-center">{success}</p>
            )}

            {!isPhoneInput && (
              <Button
                type="submit"
                disabled={loading}
                className="h-14 mt-4 w-full bg-black hover:bg-black/80 rounded-none text-white text-[12px] font-bold tracking-[0.2em] uppercase transition-colors"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            )}
          </form>

          <p className="mt-12 text-center text-[12px] text-text-muted">
            Remember your password?{" "}
            <Link href="/login" className="font-bold uppercase tracking-[0.1em] text-text-main hover:text-[#5B7763] transition-colors ml-1">
              Sign In
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
