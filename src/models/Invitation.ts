import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvitation extends Document {
  email: string;
  role: "admin" | "manager" | "dispatcher";
  invitedBy: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

const invitationSchema = new Schema<IInvitation>(
  {
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: ["admin", "manager", "dispatcher"] },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Add an index to automatically expire documents
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Invitation: Model<IInvitation> =
  mongoose.models.Invitation || mongoose.model<IInvitation>("Invitation", invitationSchema);
