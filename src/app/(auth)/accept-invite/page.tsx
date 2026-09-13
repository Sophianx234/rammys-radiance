"use client";

import { AcceptInviteForm } from "@/components/auth/accept-invite-form";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function AcceptInvitePage() {
  return (
    <div className="grid min-h-dvh lg:h-dvh font-sans bg-surface lg:grid-cols-2 overflow-hidden">
      <div className="flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto scrollbar-hide">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-2 mt-24">
            <Link href="/">
              <Image
                src="/imgs/logo.jpeg"
                alt="Rammy's Radiance Logo"
                width={180}
                height={54}
                className="object-contain"
                priority
              />
            </Link>
          </div>
          
          <Suspense fallback={<div className="text-center text-sm text-zinc-500 mt-12"><Loader2 className="animate-spin mx-auto" /></div>}>
            <AcceptInviteForm />
          </Suspense>
        </div>
      </div>
      
      <div className="relative hidden lg:block bg-surface h-full">
        <img
          src="https://images.unsplash.com/photo-1606788075819-9574a6edfab3?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Rammy's Radiance"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/5" />
      </div>
    </div>
  );
}
