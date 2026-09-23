import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkRateLimit, tooManyRequests } from "@/lib/rate-limit";

const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * Next 16 renamed `middleware` to `proxy`; it runs on the Node.js runtime, so
 * it uses the full Auth.js config (including the per-request DB check that
 * signs out deleted admins).
 *
 * Note: when auth() wraps a custom handler like this, Auth.js does NOT
 * redirect unauthenticated users by itself — the gate below is what protects
 * /admin. Route handlers and pages still check permissions on their own.
 */
export const proxy = auth(async (req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  if (pathname === "/admin/login") {
    if (user) return NextResponse.redirect(new URL("/admin", req.nextUrl));
  } else if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!user) {
      const login = new URL("/admin/login", req.nextUrl);
      login.searchParams.set("callbackUrl", req.nextUrl.href);
      return NextResponse.redirect(login);
    }
  }

  // Admin create/update/delete calls: per-admin limit (uploads have their own).
  if (
    user?.id &&
    pathname.startsWith("/api/admin/") &&
    pathname !== "/api/admin/upload" &&
    WRITE_METHODS.has(req.method)
  ) {
    const limit = await checkRateLimit("adminWrite", user.id);
    if (!limit.success) return tooManyRequests(limit.retryAfter);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
