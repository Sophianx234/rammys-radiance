import ManageTeamClient from "@/components/admin/manage-team-client";
import { connectToDatabase } from "@/lib/connectDB"; 
import { User } from "@/models/User"; 
import { Invitation } from "@/models/Invitation";

export const dynamic = 'force-dynamic';

export default async function TeamManagementPage() {
  await connectToDatabase();

  const rawUsers = await User.find({
    role: { $in: ["admin", "manager", "dispatcher"] },
  })
    .select("name email profile role isSuspended updatedAt")
    .sort({ createdAt: -1 })
    .lean();

  const rawInvites = await Invitation.find()
    .select("email role createdAt expiresAt")
    .sort({ createdAt: -1 })
    .lean();

  const formattedUsers = rawUsers.map((member: any) => ({
    id: member._id.toString(),
    name: member.name,
    email: member.email,
    profilePicture: member.profile || "",
    role: member.role,
    accountStatus: member.isSuspended ? "Suspended" : "Active",
    lastActive: member.updatedAt 
      ? new Date(member.updatedAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Never",
  }));

  const formattedInvites = rawInvites.map((invite: any) => ({
    id: invite._id.toString(),
    name: "Awaiting Registration",
    email: invite.email,
    profilePicture: "",
    role: invite.role,
    accountStatus: "Pending_Invite",
    lastActive: `Expires ${new Date(invite.expiresAt).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short"
    })}`,
  }));

  const combinedTeamData = [...formattedUsers, ...formattedInvites];

  return (
    <main>
      <ManageTeamClient data={combinedTeamData} />
    </main>
  );
}
