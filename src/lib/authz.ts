import type { AdminPermission } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";

/** Returns the session if signed in, otherwise null (any admin role). */
export async function requireSession() {
  const session = await auth();
  if (!session?.user) return null;
  return session;
}

/** Returns the session only if signed in AND role is ADMIN (master admin). */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

/**
 * Returns the session if signed in AND allowed to manage the given content
 * area — ADMIN (master) always passes; EDITOR only passes if the permission
 * is in their `permissions` list.
 */
export async function requirePermission(permission: AdminPermission) {
  const session = await auth();
  if (!session?.user) return null;
  if (session.user.role === "ADMIN") return session;
  if (session.user.permissions?.includes(permission)) return session;
  return null;
}
