"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { User, MapPin, Heart, LogOut, Settings, Camera, Loader2 } from "lucide-react";
import Link from "next/link";
import { useDashStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser } = useDashStore();
  
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "wishlist" | "settings">("overview");
  
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (user === null) {
      // wait a bit in case it's still hydrating, but for now we just redirect
      const timeout = setTimeout(() => {
        if (!user) router.push("/login");
      }, 1000);
      return () => clearTimeout(timeout);
    } else if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;

    setIsUpdating(true);
    try {
      const form = new FormData();
      form.append("userId", user._id);
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      
      const res = await fetch("/api/users/update-profile", {
        method: "PATCH",
        body: form,
      });

      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();
      setUser(data.user);
      Swal.fire("Success", "Profile updated successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Could not update profile", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;
    
    if (passwordData.password !== passwordData.confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    if (passwordData.password.length < 6) {
      Swal.fire("Error", "Password must be at least 6 characters", "error");
      return;
    }

    setIsUpdating(true);
    try {
      const form = new FormData();
      form.append("userId", user._id);
      form.append("password", passwordData.password);
      
      const res = await fetch("/api/users/update-profile", {
        method: "PATCH",
        body: form,
      });

      if (!res.ok) throw new Error("Failed to update password");
      Swal.fire("Success", "Password updated successfully", "success");
      setPasswordData({ password: "", confirmPassword: "" });
    } catch (error) {
      Swal.fire("Error", "Could not update password", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?._id) return;

    setIsUpdating(true);
    try {
      const form = new FormData();
      form.append("userId", user._id);
      form.append("profile", file);
      
      const res = await fetch("/api/users/update-profile", {
        method: "PATCH",
        body: form,
      });

      if (!res.ok) throw new Error("Failed to upload image");
      const data = await res.json();
      setUser(data.user);
      Swal.fire("Success", "Profile picture updated", "success");
    } catch (error) {
      Swal.fire("Error", "Could not upload image", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main>
      <Header />

      {/* Page Header */}
      <section className="bg-secondary border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold">
            My Account
          </h1>
        </div>
      </section>

      {/* Account Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <Card className="bg-card border-border p-6 space-y-4">
              <div className="flex flex-col items-center gap-3 pb-4 border-b border-border">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center overflow-hidden border-2 border-primary/20">
                    {user.profile ? (
                      <Image src={user.profile} alt="Profile" width={80} height={80} className="object-cover w-full h-full" />
                    ) : (
                      <User size={32} className="text-primary-foreground" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="text-white w-6 h-6" />
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  {isUpdating && <p className="text-[10px] text-primary mt-1 flex items-center justify-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Updating...</p>}
                </div>
              </div>

              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "overview"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <User size={18} />
                  Account Overview
                </span>
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "orders"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <MapPin size={18} />
                  My Orders
                </span>
              </button>

              <button
                onClick={() => setActiveTab("wishlist")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "wishlist"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Heart size={18} />
                  Wishlist
                </span>
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === "settings"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Settings size={18} />
                  Settings
                </span>
              </button>

              <hr className="border-border" />

              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-transparent text-sm font-medium"
              >
                <LogOut size={18} />
                Sign Out
              </Button>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <Card className="bg-card border-border p-6">
                  <h2 className="text-xl font-semibold mb-6">
                    Profile Information
                  </h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-xl">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Full Name</label>
                      <input 
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-secondary/50 border border-border/40 rounded-none px-4 py-2.5 text-[13px] focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Email Address</label>
                      <input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-secondary/50 border border-border/40 rounded-none px-4 py-2.5 text-[13px] focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Phone Number</label>
                      <input 
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="e.g. +233 123 456 789"
                        className="w-full bg-secondary/50 border border-border/40 rounded-none px-4 py-2.5 text-[13px] focus:outline-none focus:border-primary"
                      />
                    </div>
                    <Button type="submit" disabled={isUpdating} className="mt-4 bg-[#5B7763] hover:bg-[#5B7763]/90 text-white rounded-none px-8 font-semibold tracking-wider uppercase text-[11px]">
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </Card>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <Card className="bg-card border-border p-6">
                  <h2 className="text-xl font-semibold mb-6">
                    Change Password
                  </h2>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-xl">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">New Password</label>
                      <input
                        type="password"
                        value={passwordData.password}
                        onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                        className="w-full bg-secondary/50 border border-border/40 rounded-none px-4 py-2.5 text-[13px] focus:outline-none focus:border-primary"
                        required
                        minLength={6}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Confirm Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full bg-secondary/50 border border-border/40 rounded-none px-4 py-2.5 text-[13px] focus:outline-none focus:border-primary"
                        required
                        minLength={6}
                      />
                    </div>
                    <Button type="submit" disabled={isUpdating} className="mt-4 bg-[#5B7763] hover:bg-[#5B7763]/90 text-white rounded-none px-8 font-semibold tracking-wider uppercase text-[11px]">
                      {isUpdating ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </Card>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="text-center py-16 bg-white border border-border/40">
                <p className="text-text-muted text-[13px]">You have no orders yet.</p>
                <Link href="/shop">
                   <Button className="mt-4 bg-[#5B7763] text-white rounded-none uppercase tracking-wider text-[11px] font-bold">Shop Now</Button>
                </Link>
              </div>
            )}

            {activeTab === "wishlist" && (
               <div className="text-center py-16 bg-white border border-border/40">
                 <Heart className="w-12 h-12 text-border/40 mx-auto mb-3" />
                 <p className="text-text-muted text-[13px]">Your wishlist is empty.</p>
                 <Link href="/shop">
                    <Button className="mt-4 bg-[#5B7763] text-white rounded-none uppercase tracking-wider text-[11px] font-bold">Explore Products</Button>
                 </Link>
               </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
