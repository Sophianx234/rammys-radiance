"use server";

import { connectToDatabase } from "@/lib/connectDB";
import { Invitation } from "@/models/Invitation";
import { User } from "@/models/User";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";
import mongoose from "mongoose";
import React from "react";
import { sendMail } from "@/lib/mail";
import InvitationEmail from "@/components/mail/invitation-email";
import TeamUpdateEmail from "@/components/mail/team-update-mail";
import jwt from "jsonwebtoken";
import { signToken } from "@/lib/jwtConfig";
import { render } from "@react-email/render";

const jwtSecret = process.env.JWT_SECRET as string;

// Helper to get session from cookie
async function getSession() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, jwtSecret) as any;
    return decoded;
  } catch {
    return null;
  }
}

const inviteSchema = z.object({
  email: z.string().email("Invalid email format").trim().toLowerCase(),
  role: z.enum(["admin", "manager", "dispatcher"], { message: "Invalid role specified" }),
});

const updateRoleSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID format"),
  newRole: z.enum(["admin", "manager", "dispatcher"]),
});

const toggleStatusSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID format"),
  currentIsSuspended: z.boolean(),
});

const cancelInviteSchema = z.object({
  invitationId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Invite ID format"),
});

const acceptInviteSchema = z.object({
  token: z.string().min(32, "Invalid token length").trim(),
  name: z.string().min(2, "Name is too short").trim().max(100),
  phone: z.string().min(10, "Invalid phone number").trim().max(50),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function inviteTeamMemberAction(rawEmail: string, rawRole: string) {
  try {
    const session = await getSession();
    if (!session?.userId || session.role !== "admin") {
      throw new Error("Unauthorized access attempt.");
    }

    const { email, role } = inviteSchema.parse({ email: rawEmail, role: rawRole });
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) return { success: false, error: "A user with this email already exists." };

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await Invitation.findOneAndUpdate(
      { email },
      { email, role, invitedBy: session.userId, token, expiresAt },
      { upsert: true, new: true }
    );

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const emailHtml = await render(React.createElement(InvitationEmail, { role, inviteLink: `${baseUrl}/accept-invite?token=${token}` }));
    
    await sendMail({
      to: email,
      subject: "Join the Rammy's Radiance Team",
      html: emailHtml
    });
    
    revalidatePath("/admin/manage/team"); 
    return { success: true, message: `Invitation sent to ${email}` };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: "Operation failed. Please try again." };
  }
}

export async function updateTeamMemberRole(rawUserId: string, rawNewRole: string) {
  try {
    const session = await getSession();
    if (!session?.userId || session.role !== "admin") throw new Error("Unauthorized");

    const { userId, newRole } = updateRoleSchema.parse({ userId: rawUserId, newRole: rawNewRole });

    if (session.userId === userId && newRole !== "admin") {
      return { success: false, error: "You cannot demote your own account." };
    }

    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) return { success: false, error: "User not found." };

    user.role = newRole;
    await user.save();

    const emailHtml = await render(React.createElement(TeamUpdateEmail, {
      userName: user.name,
      title: "Account permissions updated",
      message: `Your account role has been updated to ${newRole}.`
    }));

    await sendMail({
      to: user.email!,
      subject: "Account Permission Update",
      html: emailHtml
    });
    
    revalidatePath("/admin/manage/team");
    return { success: true, message: `Role updated successfully.` };
  } catch (error: any) {
    return { success: false, error: "Failed to update role." };
  }
}

export async function toggleTeamAccountStatus(rawUserId: string, currentIsSuspended: boolean) {
  try {
    const session = await getSession();
    if (!session?.userId || session.role !== "admin") throw new Error("Unauthorized");

    const { userId, currentIsSuspended: isSusp } = toggleStatusSchema.parse({ userId: rawUserId, currentIsSuspended });
    
    if (session.userId === userId) {
      return { success: false, error: "You cannot suspend your own account." };
    }

    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) return { success: false, error: "User not found." };

    const newIsSuspended = !isSusp;
    user.isSuspended = newIsSuspended;
    await user.save();

    const emailHtml = await render(React.createElement(TeamUpdateEmail, {
      userName: user.name,
      title: newIsSuspended ? "Account Access Restricted" : "Account Access Restored",
      message: newIsSuspended
        ? "Your account has been suspended. Please contact administration for further details."
        : "Your account has been reactivated. You may now log in normally."
    }));

    await sendMail({
      to: user.email!,
      subject: newIsSuspended ? "Account Suspended" : "Account Reactivated",
      html: emailHtml
    });
    
    revalidatePath("/admin/manage/team");
    return { success: true, message: `Account has been ${newIsSuspended ? 'suspended' : 'reactivated'}.` };
  } catch (error: any) {
    return { success: false, error: "Failed to update account status." };
  }
}

export async function cancelInvitation(rawInvitationId: string) {
  try {
    const session = await getSession();
    if (!session?.userId || session.role !== "admin") throw new Error("Unauthorized");

    const { invitationId } = cancelInviteSchema.parse({ invitationId: rawInvitationId });

    await connectToDatabase();
    await Invitation.findByIdAndDelete(invitationId);
    
    revalidatePath("/admin/manage/team");
    return { success: true, message: "Invitation cancelled." };
  } catch (error: any) {
    return { success: false, error: "Failed to cancel invitation." };
  }
}

export async function acceptInviteAction(prevState: any, formData: FormData) {
  try {
    const data = acceptInviteSchema.parse(Object.fromEntries(formData));

    await connectToDatabase();
    const dbSession = await mongoose.startSession();
    
    const result = await dbSession.withTransaction(async () => {
      const invitation = await Invitation.findOne({ 
        token: data.token, 
        expiresAt: { $gt: new Date() } 
      }).session(dbSession);

      if (!invitation) throw new Error("INVALID_TOKEN");

      const existingUser = await User.findOne({ email: invitation.email }).session(dbSession);
      if (existingUser) {
        await Invitation.findByIdAndDelete(invitation._id).session(dbSession);
        throw new Error("USER_EXISTS");
      }

      const hashedPassword = await bcrypt.hash(data.password, 12);

      const newUser = await User.create([{
        name: data.name,
        email: invitation.email,
        phone: data.phone,
        password: hashedPassword,
        role: invitation.role,
        isSuspended: false,
      }], { session: dbSession });

      await Invitation.findByIdAndDelete(invitation._id).session(dbSession);

      const token = await signToken(newUser[0]);
      (await cookies()).set("token", token, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        path: "/",
        sameSite: "strict",
      });

      return "SUCCESS";
    });

    await dbSession.endSession();

    if (result === "USER_EXISTS") return { success: false, error: "An account with this email already exists." };
    if (result === "INVALID_TOKEN") return { success: false, error: "This invitation is invalid or has expired." };

    return { success: true, message: "Welcome to the team! Redirecting..." };

  } catch (error: any) {
    console.error(error)
    return { success: false, error: "An error occurred while creating your account. Please try again." };
  }
}
