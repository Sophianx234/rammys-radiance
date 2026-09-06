import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize a global API rate limiter (e.g. 100 requests per 10 seconds per IP)
// Wrapped in try/catch to ensure build doesn't fail if UPSTASH env vars are missing
let globalApiRateLimit: Ratelimit | null = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    globalApiRateLimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(100, "10 s"),
      analytics: true,
      prefix: "@upstash/ratelimit/global-api",
    });
  }
} catch (e) {
  console.warn("Could not initialize global rate limiter.");
}

const allowedOrigins = process.env.NODE_ENV === "production" 
  ? [process.env.NEXT_PUBLIC_APP_URL || "https://your-production-url.com"] 
  : ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"];

function logRequest(req: NextRequest, status: string, icon: string, role: string = "unknown") {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  const method = req.method.padEnd(6);
  // truncate path if it's too long to keep the logs clean
  let path = req.nextUrl.pathname;
  if (path.length > 25) path = path.substring(0, 22) + "...";
  path = path.padEnd(25);
  const ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
  
  console.log(`[${time}] ➔ ${method} ${path} => ${icon} ${status} (Role: ${role}, IP: ${ip})`);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method;

  const isAdminPage = pathname.startsWith("/admin");
  const isApi = pathname.startsWith("/api");

  // 1. Setup response and apply Security Headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY"); // Prevent Clickjacking
  response.headers.set("X-Content-Type-Options", "nosniff"); // Prevent MIME-sniffing
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin"); // Control Referer info
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload"); // Enforce HTTPS
  
  // Basic Content Security Policy (CSP)
  const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.paystack.co;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://res.cloudinary.com;
    font-src 'self';
    connect-src 'self' https://api.paystack.co;
    frame-src 'self' https://js.paystack.co;
  `.replace(/\s{2,}/g, ' ').trim();
  response.headers.set("Content-Security-Policy", csp);

  // 2. CSRF Protection for API Mutations
  if (isApi && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const origin = req.headers.get("origin");
    const referer = req.headers.get("referer");
    
    // Check if the request comes from an allowed origin
    if (origin && !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      logRequest(req, "BLOCKED (CSRF Origin mismatch)", "🔴");
      return NextResponse.json({ error: "Forbidden: CSRF protection triggered (Origin mismatch)" }, { status: 403 });
    } else if (referer && !allowedOrigins.some(allowed => referer.startsWith(allowed))) {
      logRequest(req, "BLOCKED (CSRF Referer mismatch)", "🔴");
      return NextResponse.json({ error: "Forbidden: CSRF protection triggered (Referer mismatch)" }, { status: 403 });
    } else if (!origin && !referer && process.env.NODE_ENV === "production") {
      // In production, enforce that browsers send Origin or Referer for mutations
      logRequest(req, "BLOCKED (CSRF Missing header)", "🔴");
      return NextResponse.json({ error: "Forbidden: Missing Origin/Referer header" }, { status: 403 });
    }
  }

  // 3. Global API Rate Limiting (DDoS mitigation for APIs)
  if (isApi && globalApiRateLimit) {
    const ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
    try {
      const { success, limit, reset, remaining } = await globalApiRateLimit.limit(ip);
      
      response.headers.set("X-RateLimit-Limit", limit.toString());
      response.headers.set("X-RateLimit-Remaining", remaining.toString());
      response.headers.set("X-RateLimit-Reset", reset.toString());
      
      if (!success) {
        logRequest(req, "LIMITED (Rate Limit Exceeded)", "🟠");
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { 
            status: 429,
            headers: { "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString() }
          }
        );
      }
    } catch (err) {
      console.warn("Global rate limiter failed, continuing:", err);
    }
  }

  // If not an admin page or API, we just return the response with security headers
  if (!isAdminPage && !isApi) {
    logRequest(req, "ALLOWED (Public)", "🟢");
    return response;
  }

  // 4. Authentication & JWT Validation
  const token = req.cookies.get("token")?.value;
  let payload: any = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload: verifiedPayload } = await jwtVerify(token, secret);
      payload = verifiedPayload;
    } catch (err) {
      // Invalid token signature or expired - handled gracefully below
    }
  }

  // Immediate Suspension Check via Redis
  if (payload && payload.userId) {
    try {
      const redis = Redis.fromEnv();
      const isSuspended = await redis.sismember("suspended_users", payload.userId);
      if (isSuspended) {
        logRequest(req, "BLOCKED (Suspended Account)", "⛔", payload.role);
        
        // If it's an API request, return JSON. Otherwise redirect.
        if (isApi) {
          const res = NextResponse.json({ error: "Your account has been suspended." }, { status: 403 });
          res.cookies.delete("token");
          return res;
        } else {
          const res = NextResponse.redirect(new URL("/login?suspended=true", req.url));
          res.cookies.delete("token");
          return res;
        }
      }
    } catch (e) {
      console.warn("Could not check suspension status:", e);
    }
  }

  const role = payload?.role || "guest";
  const normalizedRole = role === "dispatcher" ? "dispatch" : (role === "customer" ? "user" : role);
  const isAuthenticated = normalizedRole !== "guest";
  
  // 5. Admin Page RBAC Protection
  if (isAdminPage) {
    if (!isAuthenticated) {
      logRequest(req, "REDIRECTED (Unauthenticated)", "🟡", "guest");
      // Redirect to login preserving the original URL
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!["admin", "manager", "dispatch"].includes(normalizedRole)) {
      logRequest(req, "REDIRECTED (Unauthorized access)", "🔴", normalizedRole);
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Dispatch role restriction
    if (normalizedRole === "dispatch") {
      if (pathname === "/admin" || (!pathname.startsWith("/admin/orders") && !pathname.startsWith("/admin/settings"))) {
        logRequest(req, "REDIRECTED (Dispatch restricted)", "🟡", normalizedRole);
        return NextResponse.redirect(new URL("/admin/orders", req.url));
      }
    }
  }

  // 6. Secure API RBAC Protection
  if (isApi) {
    const isAdminApi = pathname.startsWith("/api/admin");

    if (isAdminApi) {
      if (method === "DELETE" && normalizedRole !== "admin") {
        logRequest(req, "BLOCKED (Admin access required)", "🔴", normalizedRole);
        return NextResponse.json({ error: "Forbidden. Admin access required to delete." }, { status: 403 });
      }

      if (["POST", "PUT", "PATCH"].includes(method) && !["admin", "manager"].includes(normalizedRole)) {
        logRequest(req, "BLOCKED (Create/Edit access required)", "🔴", normalizedRole);
        return NextResponse.json({ error: "Forbidden. Create/Edit access required." }, { status: 403 });
      }
    }
  }

  logRequest(req, "ALLOWED", "🟢", normalizedRole);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * This ensures security headers are applied to HTML pages as well as API routes.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)"
  ],
};
