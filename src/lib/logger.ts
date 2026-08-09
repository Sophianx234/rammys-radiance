import { connectToDatabase } from "./connectDB";
import { ActivityLog } from "@/models/ActivityLog";
import { getUserId } from "@/app/actions/auth";

export async function logActivity(action: string, details: string, targetId?: string) {
  try {
    const userId = await getUserId();
    if (!userId) return; // Skip if no user context
    
    await connectToDatabase();
    await ActivityLog.create({
      user: userId,
      action,
      details,
      targetId,
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}
