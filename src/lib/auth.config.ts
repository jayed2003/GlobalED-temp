import type { NextAuthConfig } from "next-auth";
import type { AdminPermission } from "@/generated/prisma/client";

/**
 * Edge-safe base config (no providers that touch Prisma/bcrypt) — this is
 * what `middleware.ts` runs on the Edge runtime. The full config in
 * `src/lib/auth.ts` spreads this and adds the Credentials provider.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      if (!isAdminRoute) return true;

      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === "/admin/login";

      if (isLoginPage) {
        if (isLoggedIn) return Response.redirect(new URL("/admin", nextUrl));
        return true;
      }

      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        const u = user as { id: string; role: "ADMIN" | "EDITOR"; permissions: AdminPermission[] };
        token.id = u.id;
        token.role = u.role;
        token.permissions = u.permissions;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "EDITOR";
        session.user.permissions = token.permissions as AdminPermission[];
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
