"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { acceptInviteAction } from "@/actions/admin/invitation.action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";

// --- Submit Button Component ---
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      className="h-14 mt-4 w-full bg-black hover:bg-black/80 rounded-none text-white text-[12px] font-bold tracking-[0.2em] uppercase transition-colors flex items-center justify-center" 
      type="submit" 
      disabled={pending}
    >
      {pending && (
        <Loader2 className="animate-spin mr-2 h-4 w-4" />
      )}
      {pending ? "Setting up account..." : "Join the Team"}
    </Button>
  );
}

// --- Main Form Component ---
export function AcceptInviteForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Initialize server action state hook
  const [state, formAction] = useFormState(acceptInviteAction, null);

  // Trigger toasts and redirects
  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    } else if (state?.success) {
      toast.success(state.message);
      // Route new staff member to the dashboard
      router.push("/admin/products");
    }
  }, [state, router]);

  // Defensive check: If they land here without a token
  if (!token) {
    return (
      <div className="text-center space-y-3 mt-12">
        <h2 className="text-xl font-bold text-red-500">Invalid Link</h2>
        <p className="text-[13px] text-text-muted tracking-wide">
          This invitation link is missing or malformed. Please request a new
          invitation from your administrator.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-text-main mb-4">
          Accept Invitation
        </h1>
        <p className="text-[13px] text-text-muted tracking-wide">
          You've been invited to join the Rammy's Radiance management team. Complete your profile below.
        </p>
      </div>

      <form
        className={cn("flex flex-col gap-6", className)}
        action={formAction}
        {...props}
      >
        {/* Hidden Token Field */}
        <input type="hidden" name="token" value={token} />

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted">
            Full Legal Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            required
            className="h-12 w-full border-b border-border/60 bg-transparent text-[14px] text-text-main focus:border-black focus:outline-none transition-colors placeholder:text-border"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+233 55 000 0000"
            required
            className="h-12 w-full border-b border-border/60 bg-transparent text-[14px] text-text-main focus:border-black focus:outline-none transition-colors placeholder:text-border"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted">
            Create a Secure Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            minLength={8}
            className="h-12 w-full border-b border-border/60 bg-transparent text-[14px] text-text-main focus:border-black focus:outline-none transition-colors placeholder:text-border"
          />
        </div>

        <SubmitButton />
      </form>
    </>
  );
}
