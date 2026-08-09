"use server";

import { getSystemAlertState } from "@/lib/admin-data";

export async function fetchNotificationCountAction() {
  try {
    const { pendingOrdersCount, lowStockCount } = await getSystemAlertState();
    return pendingOrdersCount + lowStockCount;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return 0;
  }
}
