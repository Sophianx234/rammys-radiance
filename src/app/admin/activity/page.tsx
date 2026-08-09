import { connectToDatabase } from "@/lib/connectDB";
import { ActivityLog } from "@/models/ActivityLog";
import ActivityClient from "./activity-client";

export default async function ActivityLogsPage() {
  await connectToDatabase();
  // We limit to 100 for now. Pagination can be added later.
  const logs = await ActivityLog.find()
    .populate("user", "name role")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
  
  const formattedLogs = logs.map((log: any) => ({
    ...log,
    _id: log._id.toString(),
    user: log.user ? { name: log.user.name, role: log.user.role } : { name: "System/Deleted", role: "unknown" },
    createdAt: log.createdAt.toISOString()
  }));

  return <ActivityClient logs={formattedLogs} />;
}
