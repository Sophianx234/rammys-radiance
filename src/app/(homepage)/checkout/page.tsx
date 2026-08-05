"use client";

import dynamic from "next/dynamic";
import { GridLoader } from "react-spinners";

const CheckoutContent = dynamic(() => import("@/components/checkout-content"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <GridLoader color="#5B7763" />
    </div>
  ),
});

export default function CheckoutPage() {
  return <CheckoutContent />;
}
