"use server";
import { cookies } from "next/headers";

export async function getUserRole() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return "guest";
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    const role = payload?.role || "guest";
    return role === "dispatcher" ? "dispatch" : (role === "customer" ? "user" : role);
  } catch {
    return "guest";
  }
}

export async function getUserId() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    return payload?.userId || null;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const role = await getUserRole();
  if (role !== "admin") {
    throw new Error("Forbidden: Admin access required.");
  }
}

export async function requireManagerOrAdmin() {
  const role = await getUserRole();
  if (role !== "admin" && role !== "manager") {
    throw new Error("Forbidden: Admin or Manager access required.");
  }
}
