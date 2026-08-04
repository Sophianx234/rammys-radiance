// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/admin",
  "/admin/overview",
  "/admin/products",
  "/admin/orders",
  "/admin/customers",
  "/checkout",
  "/product", // ← NEW
];


export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only run on protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      // Not authenticated, redirect to login
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Decode JWT without 'jsonwebtoken' since Edge doesn't support Node modules
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );

      if (!payload.userId) {
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
      }

      // Optional: check role
      if (pathname.startsWith("/admin") && payload.role !== "admin") {
        const unauthorizedUrl = new URL("/unauthorized", req.url);
        return NextResponse.redirect(unauthorizedUrl);
      }
    } catch (err) {
      // Invalid token
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/checkout/:path*",
    "/product/:path*",   // ← NEW
  ],
};