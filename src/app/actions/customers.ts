"use server";
import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/User";
import { Order } from "@/models/Order";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth";
import { logActivity } from "@/lib/logger";

export async function updateCustomerRoleAction(userId: string, newRole: string) {
  try {
    await requireAdmin();
    await connectToDatabase();
    await User.findByIdAndUpdate(userId, { role: newRole });
    await logActivity("UPDATE_ROLE", `Updated role of user ${userId} to ${newRole}`, userId);
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleSuspendCustomerAction(userId: string, currentSuspendedStatus: boolean) {
  try {
    await requireAdmin();
    await connectToDatabase();
    await User.findByIdAndUpdate(userId, { isSuspended: !currentSuspendedStatus });
    await logActivity(currentSuspendedStatus ? "UNSUSPEND_USER" : "SUSPEND_USER", `${currentSuspendedStatus ? 'Unsuspended' : 'Suspended'} user ${userId}`, userId);
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function fetchCustomerOrdersAction(userId: string) {
  try {
    await connectToDatabase();
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).lean();
    return {
      success: true,
      orders: orders.map((o: any) => ({
        ...o,
        _id: o._id.toString(),
        createdAt: o.createdAt.toISOString()
      }))
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adminChangePasswordAction(userId: string, newPassword: string) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const { encryptPassword } = await import("@/lib/bcrypt");
    const hashedPassword = await encryptPassword(newPassword);
    
    await User.findByIdAndUpdate(userId, { password: hashedPassword });
    await logActivity("RESET_PASSWORD", `Manually reset password for user ${userId}`, userId);
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
