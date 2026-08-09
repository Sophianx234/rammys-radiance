import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
  user: mongoose.Types.ObjectId;
  action: string;
  details: string;
  targetId?: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    details: { type: String, required: true },
    targetId: { type: String },
  },
  { timestamps: true }
);

export const ActivityLog = mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
