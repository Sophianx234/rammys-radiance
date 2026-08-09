"use server";
import { connectToDatabase } from "@/lib/connectDB";
import { Order } from "@/models/Order";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireManagerOrAdmin } from "./auth";
import { logActivity } from "@/lib/logger";

export async function updateOrderStatusAction(paymentReference: string, newStatus: string) {
  try {
    await requireManagerOrAdmin();
    await connectToDatabase();
    await Order.findOneAndUpdate({ paymentReference }, { orderStatus: newStatus });
    await logActivity("UPDATE_ORDER_STATUS", `Updated order ${paymentReference} status to ${newStatus}`, paymentReference);
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteOrderAction(orderId: string) {
  try {
    await requireAdmin();
    await connectToDatabase();
    await Order.findByIdAndDelete(orderId);
    await logActivity("DELETE_ORDER", `Deleted order ${orderId}`, orderId);
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function batchUpdateOrderStatusAction(paymentReferences: string[], newStatus: string) {
  try {
    await requireManagerOrAdmin();
    await connectToDatabase();
    await Order.updateMany(
      { paymentReference: { $in: paymentReferences } },
      { orderStatus: newStatus }
    );
    await logActivity("BATCH_UPDATE_ORDER_STATUS", `Updated ${paymentReferences.length} orders to ${newStatus}`);
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
