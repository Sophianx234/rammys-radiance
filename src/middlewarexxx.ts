import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method;

  const isAdminPage = pathname.startsWith("/admin");
  const isApi = pathname.startsWith("/api");

  if (!isAdminPage && !isApi) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  let payload: any = null;

  if (token) {
    try {
      payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );
    } catch (err) {
      // Invalid token
    }
  }

  const role = payload?.role || "guest";
  const normalizedRole = role === "dispatcher" ? "dispatch" : (role === "customer" ? "user" : role);
  const isAuthenticated = normalizedRole !== "guest";
  
  // 1. Admin Page Protection
  if (isAdminPage) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (!["admin", "manager", "dispatch"].includes(normalizedRole)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Dispatch role can only access orders and settings
    if (normalizedRole === "dispatch") {
      if (!pathname.startsWith("/admin/orders") && !pathname.startsWith("/admin/settings")) {
        return NextResponse.redirect(new URL("/admin/orders", req.url));
      }
    }
  }

  // 2. API Protection
  if (isApi) {
    const isAdminApi = pathname.startsWith("/api/admin");

    if (isAdminApi) {
      // DELETE requires ADMIN
      if (method === "DELETE") {
        if (normalizedRole !== "admin") {
          return NextResponse.json({ error: "Forbidden. Admin access required to delete." }, { status: 403 });
        }
      }

      // POST/PUT/PATCH (Create/Edit) requires ADMIN or MANAGER
      if (["POST", "PUT", "PATCH"].includes(method)) {
        if (!["admin", "manager"].includes(normalizedRole)) {
          return NextResponse.json({ error: "Forbidden. Create/Edit access required." }, { status: 403 });
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
  ],
};
