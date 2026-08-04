"use client";

import type React from "react";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CheckCircle, ArrowLeft, AlertCircle } from "lucide-react";
import { useDashStore } from "@/lib/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { IOrder } from "@/models/Order";
import { GridLoader } from "react-spinners";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, user } = useDashStore();
  const [currentStep, setCurrentStep] = useState<"delivery" | "payment" | "success">("delivery");
  const [formData, setFormData] = useState({
    userId: user?._id || "",
    phone: "",
    address: "",
    city: "",
    region: "",
  });
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<IOrder|null>(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState<string>("");
  const router = useRouter();


  useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://js.paystack.co/v1/inline.js";
  script.async = true;
  script.onload = () => {
    console.log("Paystack script loaded");
  };
  document.body.appendChild(script);
}, []);

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handledeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone && formData.address && formData.city && formData.region) {
      setCurrentStep("payment");
      setError("");
    } else {
      setError("Please fill in all required fields");
    }
  };

const handlePaymentSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsProcessing(true);
  setError("");

  try {
    const reference = `ORD-${Date.now()}`;

    // Initialize transaction (server-side)
    const initResponse = await fetch("/api/paystack/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user?.email,
        amount: finalTotal,
        reference,
      }),
    });

    const initData = await initResponse.json();

    if (!initResponse.ok) {
      throw new Error(initData.error || "Failed to initialize payment");
    }

    // SAFEGUARD — Save order data BEFORE starting payment
    localStorage.setItem(
      "pendingOrder",
      JSON.stringify({
        userId: user?._id,
        reference,
        formData,
        cart,
        total: finalTotal,
      })
    );

    // Open Paystack Inline Window
    const paystack = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: user?.email,
      amount: finalTotal * 100, // kobo
      ref: reference,
      currency: "GHS",

      callback: function (response: any) {
        // Payment finished → proceed to verification
        router.push(`/checkout/verify?reference=${response.reference}&totalAmount=${finalTotal}items=${cart.length}`);
      },

      onClose: function () {
        setIsProcessing(false);
        setError("Payment cancelled.");
      }
    });

    paystack.openIframe(); // 🟩 THIS opens the popup instead of redirecting
  } catch (err: any) {
    console.error("[Payment Error]:", err);
    setError(err.message || "Payment failed. Please try again.");
    setIsProcessing(false);
  }
};



  const subtotal = cartTotal();
  const delivery = cart.length > 0 ? 500 : 0;
  const tax = Math.round(subtotal * 0.1);
  const finalTotal = subtotal + delivery + tax;

  
  return (
    <main>
      <section className="bg-secondary border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold">
            Checkout
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div
            className={`flex items-center gap-2 ${
              currentStep === "delivery" ||
              currentStep === "payment" ||
              currentStep === "success"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "delivery" ||
                currentStep === "payment" ||
                currentStep === "success"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary"
              }`}
            >
              1
            </div>
            <span className="text-sm font-semibold">Delivery</span>
          </div>
          <div
            className={`h-0.5 w-12 ${
              currentStep === "payment" || currentStep === "success"
                ? "bg-primary"
                : "bg-border"
            }`}
          />
          <div
            className={`flex items-center gap-2 ${
              currentStep === "payment" || currentStep === "success"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "payment" || currentStep === "success"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary"
              }`}
            >
              2
            </div>
            <span className="text-sm font-semibold">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {currentStep === "delivery" && (
              <Card className="bg-card border-border p-6 space-y-6">
                <h2 className="text-xl font-semibold">Delivery Information</h2>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3">
                    <AlertCircle
                      size={20}
                      className="text-red-500 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-red-500 text-sm">{error}</p>
                  </div>
                )}
                <form onSubmit={handledeliverySubmit} className="space-y-4">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />

                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />

                    <Select
                      onValueChange={(value) =>
                        handleInputChange({ target: { name: "region", value } })
                      }
                      defaultValue={formData.region}
                    >
                      <SelectTrigger className="bg-background border border-border rounded-lg px-4 py-2">
                        <SelectValue placeholder="Select Region" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="Greater Accra">Greater Accra</SelectItem>
                        <SelectItem value="Ashanti">Ashanti</SelectItem>
                        <SelectItem value="Eastern">Eastern</SelectItem>
                        <SelectItem value="Western">Western</SelectItem>
                        <SelectItem value="Western North">Western North</SelectItem>
                        <SelectItem value="Central">Central</SelectItem>
                        <SelectItem value="Volta">Volta</SelectItem>
                        <SelectItem value="Oti">Oti</SelectItem>
                        <SelectItem value="Northern">Northern</SelectItem>
                        <SelectItem value="Savannah">Savannah</SelectItem>
                        <SelectItem value="North East">North East</SelectItem>
                        <SelectItem value="Upper East">Upper East</SelectItem>
                        <SelectItem value="Upper West">Upper West</SelectItem>
                        <SelectItem value="Bono">Bono</SelectItem>
                        <SelectItem value="Bono East">Bono East</SelectItem>
                        <SelectItem value="Ahafo">Ahafo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3"
                  >
                    Continue to Payment
                  </Button>
                </form>
              </Card>
            )}

            {currentStep === "payment" && (
              <Card className="bg-card border-border p-6 space-y-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentStep("delivery")}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3">
                    <AlertCircle
                      size={20}
                      className="text-red-500 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-red-500 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div className="bg-secondary p-4 rounded-lg border-2 border-primary">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src="/paystack-logo.png"
                        alt="Paystack"
                        className="w-12 h-8 object-contain"
                      />
                      <span className="font-semibold">
                        Secure payment powered by Paystack
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You will be redirected to Paystack to complete your
                      payment securely. All major payment methods are accepted.
                    </p>
                  </div>

                  <div className="bg-secondary p-4 rounded-lg text-sm space-y-2">
                    <p className="font-semibold">Order Summary</p>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₵{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery</span>
                      <span>₵{delivery.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax</span>
                      <span>₵{tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t border-border">
                      <span>Total</span>
                      <span className="text-primary">
                        ₵{finalTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3"
                  >
                    {isProcessing
                      ? "Processing..."
                      : `Proceed to Pay ₵${finalTotal.toLocaleString()}`}
                  </Button>
                </form>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-secondary border-border p-6 sticky top-20 space-y-4">
              <h3 className="font-semibold text-lg">Order Summary</h3>

              <div className="space-y-3 max-h-64 overflow-y-auto border-b border-border pb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x {item.quantity}
                    </span>
                    <span>
                      ₵{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 py-4 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₵{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>₵{delivery.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>₵{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">
                  ₵{finalTotal.toLocaleString()}
                </span>
              </div>

              <Link href="/cart">
                <Button variant="outline" className="w-full bg-transparent">
                  Edit Cart
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
