import { auth } from "@/lib/auth";

// Next 16 renamed `middleware` to `proxy`; it runs on the Node.js runtime, so
// it uses the full Auth.js config (including the per-request DB check).
export const proxy = auth;

export const config = {
  matcher: ["/admin/:path*"],
};
