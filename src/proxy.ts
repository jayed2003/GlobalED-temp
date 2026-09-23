import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import type { NextAuthRequest } from "next-auth";
import { auth } from "@/lib/auth";
import { checkRateLimit, tooManyRequests } from "@/lib/rate-limit";

const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const isDev = process.env.NODE_ENV === "development";
// Vercel preview deployments show the Vercel toolbar, which needs a few extra sources.
const isPreview = process.env.VERCEL_ENV === "preview";

/**
 * Content-Security-Policy with a per-request nonce. Next.js reads the nonce
 * from this header while rendering and puts it on its own <script> tags, so
 * only scripts we ship can run; 'strict-dynamic' lets those load their own
 * chunks (and the Turnstile script loaded by next/script).
 *
 * style-src keeps 'unsafe-inline' without a nonce on purpose: React style={{}}
 * attributes can't carry a nonce, and adding one would make browsers ignore
 * 'unsafe-inline'. Styles can't execute code, so this doesn't open XSS.
 */
function buildCsp(nonce: string): string {
  const vercelLive = isPreview ? " https://vercel.live" : "";
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com${isDev ? " 'unsafe-eval'" : ""}${vercelLive}`,
    `style-src 'self' 'unsafe-inline'${vercelLive}`,
    `img-src 'self' data: blob: https://*.public.blob.vercel-storage.com${isPreview ? " https://vercel.live https://vercel.com" : ""}`,
    `font-src 'self'${isPreview ? " https://vercel.live https://assets.vercel.com" : ""}`,
    `connect-src 'self' https://challenges.cloudflare.com${isPreview ? " https://vercel.live wss://ws-us3.pusher.com" : ""}`,
    // Turnstile's challenge iframe and the Google Maps embeds on the contact page.
    `frame-src https://challenges.cloudflare.com https://www.google.com${vercelLive}`,
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ];
  return directives.join("; ");
}

function nextWithCsp(req: NextRequest): NextResponse {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

/**
 * Admin area: login gate + per-admin write limit. Wrapped in Auth.js, which
 * runs the full session check (including the per-request DB lookup that
 * signs out deleted admins). Next 16's proxy runs on Node.js, so that works
 * here.
 *
 * Note: when auth() wraps a custom handler like this, Auth.js does NOT
 * redirect unauthenticated users by itself — the gate below is what protects
 * /admin. Route handlers and pages still check permissions on their own.
 */
// The event parameter's type is what selects Auth.js's proxy/middleware
// overload (a one-argument handler is typed as a route handler).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const adminProxy = auth(async (req: NextAuthRequest, _event: NextFetchEvent) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  if (pathname.startsWith("/api/")) {
    // Admin create/update/delete calls: per-admin limit (uploads have their own).
    if (user?.id && pathname !== "/api/admin/upload" && WRITE_METHODS.has(req.method)) {
      const limit = await checkRateLimit("adminWrite", user.id);
      if (!limit.success) return tooManyRequests(limit.retryAfter);
    }
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    if (user) return NextResponse.redirect(new URL("/admin", req.nextUrl));
  } else if (!user) {
    const login = new URL("/admin/login", req.nextUrl);
    login.searchParams.set("callbackUrl", req.nextUrl.href);
    return NextResponse.redirect(login);
  }

  return nextWithCsp(req);
});

function isAdminPath(pathname: string): boolean {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/api/admin/")
  );
}

// Next 16 renamed `middleware` to `proxy`.
export function proxy(req: NextRequest, event: NextFetchEvent) {
  // Auth.js only runs for the admin area, so public visitors never get
  // session/CSRF cookies; public pages just get the CSP.
  if (isAdminPath(req.nextUrl.pathname)) return adminProxy(req, event);
  return nextWithCsp(req);
}

export const config = {
  matcher: [
    // Pages (for the CSP nonce). Skips static files, image optimization,
    // robots/sitemap and link prefetches, which don't render HTML.
    {
      source: "/((?!api|_next/static|_next/image|images/|favicon.ico|robots.txt|sitemap.xml).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    // Admin pages always go through the login gate, prefetch or not.
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
