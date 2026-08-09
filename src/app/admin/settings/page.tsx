"use client";

import { Input } from "@/components/ui/input";
import { useDashStore } from "@/lib/store";
import { Lock, Mail, Upload, User, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { updateProfileAction, updateEmailAction, updatePasswordAction } from "@/app/actions/settings";
import { motion } from "framer-motion";

/* ------------------ ZOD SCHEMAS ------------------ */
const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
});

const emailSchema = z.object({
  email: z.string().email("Invalid email format"),
});

const passwordSchema = z.object({
  current: z.string().min(1, "Current password is required"),
  newPass: z.string().min(6, "New password must be at least 6 characters"),
  confirm: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.newPass === data.confirm, {
  path: ["confirm"],
  message: "Passwords do not match",
});

export default function AdminSettingsPage() {
  const { user, setUser } = useDashStore();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    image: user?.profile || "",
    file: null as File | null,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [btnProfile, setBtnProfile] = useState("Save Changes");
  const [btnEmail, setBtnEmail] = useState("Update Email");
  const [btnPass, setBtnPass] = useState("Update Password");

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        image: user.profile || "",
        file: null,
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex-1 flex justify-center items-center h-[50vh]">
        <div className="w-8 h-8 border-2 border-[#5B7763] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  /* ------------------ PROFILE IMAGE ------------------ */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfile((prev) => ({ ...prev, image: url, file }));
  };

  const clearImage = () => {
    setProfile((prev) => ({ ...prev, image: "", file: null }));
  };

  /* ------------------ GENERIC UPDATE FUNCTION ------------------ */
  const runAction = async (action: (form: FormData) => Promise<any>, form: FormData, btnSetter: (val: string) => void, type: "profile" | "email" | "password") => {
    try {
      btnSetter("Saving...");
      const res = await action(form);

      if (!res.success) {
        toast.error(res.message || "Failed to update");
        btnSetter(type === "profile" ? "Save Changes" : type === "email" ? "Update Email" : "Update Password");
        return;
      }

      if (type === "profile" || type === "email") {
        setUser(res.user);
      }

      toast.success(res.message);
      btnSetter(type === "profile" ? "Save Changes" : type === "email" ? "Update Email" : "Update Password");

      if (type === "password") {
        setPasswords({ current: "", newPass: "", confirm: "" });
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
      btnSetter(type === "profile" ? "Save Changes" : type === "email" ? "Update Email" : "Update Password");
    }
  };

  /* ------------------ PROFILE UPDATE ------------------ */
  const handleProfileSave = async () => {
    const validate = profileSchema.safeParse({ name: profile.name || user.name });
    if (!validate.success) {
      setErrors({ profileName: validate.error.errors[0].message });
      toast.error(validate.error.errors[0].message);
      return;
    }
    
    setErrors({});
    const form = new FormData();
    form.append("userId", user._id);
    form.append("name", profile.name || user.name);
    if (profile.file) form.append("profile", profile.file);

    await runAction(updateProfileAction, form, setBtnProfile, "profile");
  };

  /* ------------------ EMAIL UPDATE ------------------ */
  const handleEmailUpdate = async () => {
    const validate = emailSchema.safeParse({ email: profile.email || user.email });
    if (!validate.success) {
      setErrors({ email: validate.error.errors[0].message });
      toast.error(validate.error.errors[0].message);
      return;
    }

    setErrors({});
    const form = new FormData();
    form.append("userId", user._id);
    form.append("email", profile.email || user.email);

    await runAction(updateEmailAction, form, setBtnEmail, "email");
  };

  /* ------------------ PASSWORD UPDATE ------------------ */
  const handlePasswordUpdate = async () => {
    const validate = passwordSchema.safeParse(passwords);
    if (!validate.success) {
      const err = validate.error.errors[0];
      setErrors({ [err.path[0]]: err.message });
      toast.error(err.message);
      return;
    }

    setErrors({});
    const form = new FormData();
    form.append("userId", user?._id);
    form.append("current", passwords.current);
    form.append("newPass", passwords.newPass);

    await runAction(updatePasswordAction, form, setBtnPass, "password");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 space-y-8 pb-20 max-w-4xl mx-auto"
    >
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h2 className="text-[18px] uppercase tracking-widest font-bold text-[#222222]">Account Settings</h2>
          <p className="text-[12px] text-text-muted mt-1 uppercase tracking-wider font-medium">
            Manage your admin profile and security
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="space-y-8">
          {/* PROFILE */}
          <div className="bg-white border border-border/40 p-6 md:p-8 space-y-8">
            <h3 className="text-[14px] uppercase tracking-widest font-bold text-[#222222] border-b border-border/40 pb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#5B7763]" /> Profile Information
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative w-20 h-20 bg-secondary/30 border border-border/40 shrink-0 group">
                  {profile.image ? (
                    <>
                      <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                      <button 
                        onClick={clearImage}
                        className="absolute top-1 right-1 w-5 h-5 bg-white border border-border/40 flex items-center justify-center text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" strokeWidth={2} />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#222222] font-bold text-2xl uppercase">
                      {user.name ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "U"}
                    </div>
                  )}
                </div>
                <div>
                  <div className="relative inline-block">
                    <Input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleImageUpload} />
                    <button className="bg-secondary/50 border border-border/40 text-[#222222] px-4 py-2 text-[10px] uppercase tracking-wider font-bold hover:bg-secondary transition-colors flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5" /> Upload Photo
                    </button>
                  </div>
                  <p className="text-[10px] text-text-muted mt-2 tracking-wider">Recommended: 1:1 aspect ratio</p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-2">Full Name</label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  className="bg-secondary/20 border-border/40 text-[13px] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] text-[#222222] h-12"
                />
                {errors.profileName && <p className="text-red-600 text-[11px] mt-1 uppercase tracking-wider">{errors.profileName}</p>}
              </div>

              <button
                onClick={handleProfileSave}
                disabled={btnProfile === "Saving..."}
                className="bg-black text-white px-6 py-3 text-[11px] uppercase tracking-wider font-bold hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Save className="w-3.5 h-3.5" /> {btnProfile}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* EMAIL */}
          <div className="bg-white border border-border/40 p-6 md:p-8 space-y-6">
            <h3 className="text-[14px] uppercase tracking-widest font-bold text-[#222222] border-b border-border/40 pb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#5B7763]" /> Email Address
            </h3>
            
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-2">Email Address</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                className="bg-secondary/20 border-border/40 text-[13px] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] text-[#222222] h-12"
              />
              {errors.email && <p className="text-red-600 text-[11px] mt-1 uppercase tracking-wider">{errors.email}</p>}
            </div>

            <button
              onClick={handleEmailUpdate}
              disabled={btnEmail === "Saving..."}
              className="bg-[#222222] text-white px-6 py-3 text-[11px] uppercase tracking-wider font-bold hover:bg-black transition-colors w-full sm:w-auto"
            >
              {btnEmail}
            </button>
          </div>

          {/* PASSWORD */}
          <div className="bg-white border border-border/40 p-6 md:p-8 space-y-6">
            <h3 className="text-[14px] uppercase tracking-widest font-bold text-[#222222] border-b border-border/40 pb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#5B7763]" /> Change Password
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-2">Current Password</label>
                <Input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                  className="bg-secondary/20 border-border/40 text-[13px] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] text-[#222222] h-12"
                />
                {errors.current && <p className="text-red-600 text-[11px] mt-1 uppercase tracking-wider">{errors.current}</p>}
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-2">New Password</label>
                <Input
                  type="password"
                  value={passwords.newPass}
                  onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
                  className="bg-secondary/20 border-border/40 text-[13px] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] text-[#222222] h-12"
                />
                {errors.newPass && <p className="text-red-600 text-[11px] mt-1 uppercase tracking-wider">{errors.newPass}</p>}
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-text-muted mb-2">Confirm Password</label>
                <Input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                  className="bg-secondary/20 border-border/40 text-[13px] rounded-none focus-visible:ring-0 focus-visible:border-[#5B7763] text-[#222222] h-12"
                />
                {errors.confirm && <p className="text-red-600 text-[11px] mt-1 uppercase tracking-wider">{errors.confirm}</p>}
              </div>
            </div>

            <button
              onClick={handlePasswordUpdate}
              disabled={btnPass === "Saving..."}
              className="bg-[#222222] text-white px-6 py-3 text-[11px] uppercase tracking-wider font-bold hover:bg-black transition-colors w-full sm:w-auto"
            >
              {btnPass}
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}