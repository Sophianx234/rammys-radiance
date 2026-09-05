import { User } from "@/models/User";
import { Resend } from "resend";

// Use a fallback to prevent Next.js build crashes if the env var is missing during build time
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

// Use a verified domain email in production, otherwise onboarding@resend.dev for testing.
const fromEmail = process.env.RESEND_FROM_EMAIL || process.env.EMAIL_USER || "onboarding@resend.dev";

export async function sendMail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: `"Rammy's Closet" <${fromEmail}>`,
      to: [to],
      subject,
      html,
      text: text || "", // Resend expects text to be a string if provided
    });

    if (error) {
      console.error("❌ Email send error:", error);
      return { success: false, error };
    }

    console.log("✅ Email sent:", data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("❌ Email send exception:", error);
    return { success: false, error };
  }
}

export async function sendMailToAllUsers({
  subject,
  html,
  text,
}: {
  subject: string;
  html: string;
  text?: string;
}) {
  // Get all emails
  const users = await User.find({}, "email");

  if (!users.length) {
    console.log("⚠️ No users found. Skipping bulk email.");
    return;
  }

  const BATCH_SIZE = 50; // Resend allows up to 100 per batch send
  const allEmails = users.map((u) => u.email);

  for (let i = 0; i < allEmails.length; i += BATCH_SIZE) {
    const batch = allEmails.slice(i, i + BATCH_SIZE);

    try {
      // Create batch array for Resend
      const emailsToSend = batch.map((email) => ({
        from: `"Rammy's Closet" <${fromEmail}>`,
        to: [email],
        subject,
        html,
        text: text || "",
      }));

      const { data, error } = await resend.batch.send(emailsToSend);

      if (error) {
         console.error(`❌ Batch send error:`, error);
      } else {
         console.log(`📩 Sent batch of ${batch.length} successfully. Batch ID:`, data?.data?.[0]?.id || "unknown");
      }
    } catch (error) {
      console.error(`❌ Batch send exception:`, error);
    }
  }
}
