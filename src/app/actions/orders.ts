"use server";
import { connectToDatabase } from "@/lib/connectDB";
import { Order } from "@/models/Order";
import { revalidatePath } from "next/cache";

export async function updateOrderStatusAction(paymentReference: string, newStatus: string) {
  try {
    await connectToDatabase();
    await Order.findOneAndUpdate({ paymentReference }, { orderStatus: newStatus });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteOrderAction(orderId: string) {
  try {
    await connectToDatabase();
    await Order.findByIdAndDelete(orderId);
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function batchUpdateOrderStatusAction(paymentReferences: string[], newStatus: string) {
  try {
    await connectToDatabase();
    await Order.updateMany(
      { paymentReference: { $in: paymentReferences } },
      { orderStatus: newStatus }
    );
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
