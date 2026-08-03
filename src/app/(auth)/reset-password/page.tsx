"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing token.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Reset failed.");
      } else {
        setSuccess("Password updated! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
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
      <div className="flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
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
              Update Password
            </h1>
            <p className="text-[13px] text-text-muted tracking-wide">
              Create a new, secure password for your account.
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted">
                New Password
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
              <label htmlFor="confirm" className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted">
                Confirm Password
              </label>
              <input
                id="confirm"
                type="password"
                placeholder="••••••••"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="h-12 w-full border-b border-border/60 bg-transparent text-[14px] text-text-main focus:border-black focus:outline-none transition-colors placeholder:text-border"
              />
            </div>

            {error && (
              <p className="text-red-500 text-[12px] font-medium text-center">{error}</p>
            )}
            {success && (
              <p className="text-[#5B7763] text-[12px] font-medium text-center">{success}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-14 mt-4 w-full bg-black hover:bg-black/80 rounded-none text-white text-[12px] font-bold tracking-[0.2em] uppercase transition-colors"
            >
              {loading ? "Updating..." : "Reset Password"}
            </Button>
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
          src="/imgs/c-5.jpg"
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
