import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { checkRateLimits, getClientIp } from "@/lib/rate-limit";
import { recordActivity } from "@/lib/activity";

/** Too many sign-in attempts; the login form shows a "try again later" message for this code. */
class LoginRateLimitedError extends CredentialsSignin {
  code = "rate_limited";
}

/** Hard limit on an admin session, counted from sign-in (not from last activity). */
export const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

// One config for everything. (It used to be split into an Edge-safe
// auth.config.ts for middleware; Next 16's proxy runs on Node.js, so the proxy
// can use Prisma and this file directly.)
export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    // Cookie/JWT lifetime. Auth.js re-issues the token on each request, so on
    // its own this would slide forward forever — the loginAt check in the jwt
    // callback below is what makes 8 hours an absolute cap.
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials, request) => {
        const email = typeof credentials?.email === "string" ? credentials.email : undefined;
        const password = typeof credentials?.password === "string" ? credentials.password : undefined;
        if (!email || !password) return null;

        // Checked before the password so a blocked attacker learns nothing.
        const ip = getClientIp(request.headers);
        const limit = await checkRateLimits([
          ["loginAccount", `${email.trim().toLowerCase()}|${ip}`],
          ["loginIp", ip],
        ]);
        if (!limit.success) throw new LoginRateLimitedError();

        // Case-insensitive: emails are stored lowercase, people type them however.
        const user = await prisma.adminUser.findFirst({ where: { email: { equals: email.trim(), mode: "insensitive" } } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions,
        };
      },
    }),
  ],
  events: {
    // Sign-ins show in the activity log (useful to spot an account being misused).
    async signIn({ user }) {
      await recordActivity(
        { id: user.id ?? null, name: user.name || user.email || "Admin" },
        { action: "SIGNED_IN", entityType: "session", label: user.email ?? "" },
      );
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      // Sign-in: stamp the token with who logged in and when.
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.permissions = user.permissions;
        token.loginAt = Date.now();
        return token;
      }

      // Every later request. Returning null ends the session (Auth.js clears
      // the cookie and auth() yields no user).
      const loginAt = typeof token.loginAt === "number" ? token.loginAt : 0;
      if (!token.id || Date.now() - loginAt > ADMIN_SESSION_MAX_AGE_SECONDS * 1000) return null;

      // Re-check the account on every request instead of trusting the token,
      // so a deleted admin loses access immediately and role/permission
      // changes apply on their next click.
      const admin = await prisma.adminUser.findUnique({
        where: { id: token.id },
        select: { name: true, email: true, role: true, permissions: true },
      });
      if (!admin) return null;

      token.name = admin.name;
      token.email = admin.email;
      token.role = admin.role;
      token.permissions = admin.permissions;
      return token;
    },
    session({ session, token }) {
      // The jwt callback has already verified these; the fallbacks are the
      // least-privileged values, never the most.
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.role = token.role ?? "EDITOR";
        session.user.permissions = token.permissions ?? [];
      }
      return session;
    },
  },
});
