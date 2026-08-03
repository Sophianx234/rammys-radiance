"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    <div className="grid h-dvh overflow-hidden relative bg-gradient-to-b from-secondary to-background lg:grid-cols-2">
      {/* Left Section */}
      <div className="flex flex-col overflow-y-scroll scrollbar-hide gap-4 p-6 md:p-10">
        {/* Logo */}
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span className="text-primary">Rammys Radiance</span>
          </a>
        </div>

        {/* Form Section */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold text-foreground">
                    Forgot Password
                  </h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Enter your email and we’ll send a password reset link.
                  </p>
                </div>

                {/* Email */}
                <Field>
                  <FieldLabel htmlFor="email" className="text-foreground">
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-secondary text-foreground border border-border placeholder-muted-foreground focus:ring-primary"
                  />
                </Field>

                {/* Error or Success */}
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                {success && (
                  <p className="text-green-500 text-sm text-center">
                    {success}
                  </p>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
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

      {/* Right Image Section */}
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/imgs/c-1.jpg"
          alt="Fashion display"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
