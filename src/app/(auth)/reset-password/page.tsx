"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check token on load
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
    <div className="grid h-dvh overflow-hidden bg-gradient-to-b from-secondary to-background lg:grid-cols-2">
      {/* Left Section */}
      <div className="flex flex-col overflow-y-scroll scrollbar-hide p-6 md:p-10 gap-4">
        {/* Logo */}
        <div className="flex justify-center md:justify-start gap-2">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span className="text-primary">Rammys Radiance</span>
          </a>
        </div>

        {/* Form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <FieldGroup>
                <div className="flex flex-col items-center text-center gap-1">
                  <h1 className="text-2xl font-bold text-foreground">
                    Reset Password
                  </h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Enter a new password for your account.
                  </p>
                </div>

                {/* New Password */}
                <Field>
                  <FieldLabel className="text-foreground">
                    New Password
                  </FieldLabel>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary text-foreground border border-border"
                  />
                </Field>

                {/* Confirm Password */}
                <Field>
                  <FieldLabel className="text-foreground">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="bg-secondary text-foreground border border-border"
                  />
                </Field>

                {/* Error / Success */}
                {error && (
                  <p className="text-red-500 text-center text-sm">{error}</p>
                )}
                {success && (
                  <p className="text-green-500 text-center text-sm">
                    {success}
                  </p>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Reset Password"}
                </Button>

                <FieldDescription className="text-center text-muted-foreground">
                  Remember your password?{" "}
                  <a href="/login" className="text-primary hover:underline">
                    Sign in
                  </a>
                </FieldDescription>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>

      {/* Right Image */}
      <div className="bg-muted hidden lg:block relative">
        <img
          src="/imgs/c-5.jpg"
          alt="Fashion display"
          className="absolute inset-0 w-full h-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
