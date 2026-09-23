import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Next 16 renamed `middleware` to `proxy` (runs on the Node.js runtime).
export const proxy = NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/:path*"],
};
