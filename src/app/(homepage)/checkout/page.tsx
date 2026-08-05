"use client";

import type React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useDashStore } from "@/lib/store";
import { useRouter, useSearchParams } from "next/navigation";
import { IOrder } from "@/models/Order";
import Image from "next/image";
import DeliveryMap from "@/components/delivery-map";
import { usePaystackPayment } from "react-paystack";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, user } = useDashStore();
  const [currentStep, setCurrentStep] = useState<"delivery" | "payment" | "success">("delivery");
  const [formData, setFormData] = useState({
    userId: user?._id || "",
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    region: "",
    lat: undefined as number | undefined,
    lng: undefined as number | undefined,
  });
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<IOrder|null>(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        userId: user._id,
        fullName: user.name || prev.fullName,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  // Paystack script is handled by react-paystack

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } } | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleMapAddressSelect = (address: string, city: string, region: string, lat?: number, lng?: number) => {
    setFormData((prev) => {
      let matchedRegion = prev.region;
      if (region) {
        const normalized = region.toLowerCase();
        const availableRegions = [
          "Greater Accra", "Ashanti", "Eastern", "Western", "Western North", 
          "Central", "Volta", "Oti", "Northern", "Savannah", "North East", 
          "Upper East", "Upper West", "Bono", "Bono East", "Ahafo"
        ];
        const found = availableRegions.find(r => normalized.includes(r.toLowerCase()));
        if (found) matchedRegion = found;
      }

      return {
        ...prev,
        address: address || prev.address,
        city: city || prev.city,
        region: matchedRegion,
        lat,
        lng,
      };
    });
  };

  const handledeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName && formData.phone && formData.address && formData.city && formData.region) {
      setCurrentStep("payment");
      setError("");
    } else {
      setError("Please fill in all required fields");
    }
  };

  const subtotal = cartTotal();
  const delivery = cart.length > 0 ? 50 : 0;
  const finalTotal = subtotal + delivery;

  // Paystack Configuration using react-paystack
  const paystackConfig = {
    reference: `ORD-${Date.now()}`,
    email: user?.email || "customer@example.com", // Fallback if user email is missing
    amount: finalTotal * 100, // Paystack amount is in pesewas (1/100 of GHS)
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
    currency: "GHS",
    metadata: {
      userId: user?._id,
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: formData.fullName,
        },
        {
          display_name: "Phone Number",
          variable_name: "phone_number",
          value: formData.phone,
        }
      ],
    },
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const onSuccess = (paystackResponse: any) => {
    localStorage.setItem(
      "pendingOrder",
      JSON.stringify({
        userId: user?._id,
        reference: paystackResponse.reference,
        formData,
        cart,
        total: finalTotal,
      })
    );
    router.push(`/checkout/verify?reference=${paystackResponse.reference}&totalAmount=${finalTotal}&items=${cart.length}`);
  };

  const onClose = () => {
    setIsProcessing(false);
    setError("Payment cancelled. Your order is not complete.");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    // Initialize Paystack hook wrapper
    initializePayment({
      onSuccess,
      onClose
    } as any);
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans pb-24">
      {/* Page Header */}
      <section className="pt-20 pb-16 text-center border-b border-border/40 bg-white mb-12">
        <h1 className="text-3xl md:text-5xl font-sans font-medium text-[#222222] tracking-tight mb-4">
          CHECKOUT
        </h1>
        <p className="text-[13px] text-text-muted max-w-xl mx-auto px-4 uppercase tracking-[0.2em] font-medium">
          Finalize your order securely
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-8">
            {currentStep === "delivery" && (
              <div className="bg-white border border-border/40 p-8 lg:p-12 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)]">
                <h2 className="text-[13px] font-bold text-[#222222] uppercase tracking-[0.15em] mb-8 pb-4 border-b border-border/50">
                  Delivery Information
                </h2>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-none p-4 flex gap-3 mb-8">
                    <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-500 text-[13px] font-medium">{error}</p>
                  </div>
                )}
                
                <form onSubmit={handledeliverySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-border/60 px-0 py-3 text-[14px] text-[#222222] focus:outline-none focus:border-[#5B7763] transition-colors"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-border/60 px-0 py-3 text-[14px] text-[#222222] focus:outline-none focus:border-[#5B7763] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Delivery Map Integration */}
                  <DeliveryMap onAddressSelect={handleMapAddressSelect} />

                  <div className="space-y-1 mt-8">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-border/60 px-0 py-3 text-[14px] text-[#222222] focus:outline-none focus:border-[#5B7763] transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-border/60 px-0 py-3 text-[14px] text-[#222222] focus:outline-none focus:border-[#5B7763] transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Region</label>
                      <select
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-border/60 px-0 py-3 text-[14px] text-[#222222] focus:outline-none focus:border-[#5B7763] transition-colors appearance-none cursor-pointer"
                        required
                      >
                        <option value="" disabled>Select Region</option>
                        <option value="Greater Accra">Greater Accra</option>
                        <option value="Ashanti">Ashanti</option>
                        <option value="Eastern">Eastern</option>
                        <option value="Western">Western</option>
                        <option value="Western North">Western North</option>
                        <option value="Central">Central</option>
                        <option value="Volta">Volta</option>
                        <option value="Oti">Oti</option>
                        <option value="Northern">Northern</option>
                        <option value="Savannah">Savannah</option>
                        <option value="North East">North East</option>
                        <option value="Upper East">Upper East</option>
                        <option value="Upper West">Upper West</option>
                        <option value="Bono">Bono</option>
                        <option value="Bono East">Bono East</option>
                        <option value="Ahafo">Ahafo</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      type="submit"
                      className="w-full bg-[#5B7763] text-white text-[12px] font-bold uppercase tracking-[0.2em] py-4 hover:bg-black transition-colors duration-300"
                    >
                      CONTINUE TO PAYMENT
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === "payment" && (
              <div className="bg-white border border-border/40 p-8 lg:p-12 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-border/50">
                  <button
                    onClick={() => setCurrentStep("delivery")}
                    className="text-text-muted hover:text-[#5B7763] transition-colors"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <h2 className="text-[13px] font-bold text-[#222222] uppercase tracking-[0.15em]">
                    Payment Method
                  </h2>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-none p-4 flex gap-3 mb-8">
                    <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-500 text-[13px] font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handlePaymentSubmit} className="space-y-8">
                  <div className="bg-[#FAFAFA] p-6 border border-[#5B7763]/20 flex flex-col items-start gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-20 h-6">
                        <Image
                          src="/paystack-logo.png"
                          alt="Paystack"
                          fill
                          className="object-contain object-left"
                        />
                      </div>
                      <span className="text-[13px] font-bold text-[#222222] uppercase tracking-wider">
                        Secure Checkout
                      </span>
                    </div>
                    <p className="text-[13px] text-text-muted leading-relaxed max-w-md">
                      You will be securely redirected to Paystack to complete your transaction. We accept all major credit cards and mobile money.
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-[#5B7763] text-white text-[12px] font-bold uppercase tracking-[0.2em] py-4 hover:bg-black disabled:bg-gray-400 transition-colors duration-300 flex justify-center items-center"
                    >
                      {isProcessing
                        ? "PROCESSING..."
                        : `PAY ₵${finalTotal.toLocaleString()}`}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white border border-border/40 p-8 sticky top-28 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)]">
              <h3 className="text-[13px] font-bold text-[#222222] uppercase tracking-[0.15em] mb-6">
                Your Order
              </h3>

              <div className="space-y-4 max-h-[40vh] overflow-y-auto border-b border-border/50 pb-6 mb-6 pr-2 scrollbar-thin scrollbar-thumb-border">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="relative w-16 h-20 bg-secondary/30 shrink-0">
                      <Image
                        src={item.images[0] || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-[12px] font-bold text-[#222222] leading-tight mb-1">{item.name}</h4>
                      <p className="text-[12px] text-text-muted mb-2">QTY: {item.quantity}</p>
                      <p className="text-[12px] font-semibold text-[#5B7763]">₵{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pb-6 border-b border-border/50">
                <div className="flex justify-between text-[13px]">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="font-medium text-[#222222]">₵{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-text-muted">Estimated Delivery</span>
                  <span className="font-medium text-[#222222]">{delivery === 0 ? "Free" : `₵${delivery.toLocaleString()}`}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-6">
                <span className="text-[14px] font-bold text-[#222222] uppercase tracking-wider">Total</span>
                <span className="text-xl font-sans font-bold text-[#5B7763]">
                  ₵{finalTotal.toLocaleString()}
                </span>
              </div>

              <Link href="/cart">
                <button className="w-full bg-transparent border border-border/60 text-[#222222] text-[12px] font-bold uppercase tracking-[0.2em] py-4 hover:border-black transition-colors duration-300">
                  EDIT BAG
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
