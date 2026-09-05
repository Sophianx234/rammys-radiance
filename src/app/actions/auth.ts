"use server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function getUserRole() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return "guest";
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const role = (payload?.role as string) || "guest";
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
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return (payload?.userId as string) || null;
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

