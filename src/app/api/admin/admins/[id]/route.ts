import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { updateAdminUserSchema } from "@/lib/validation/admin-user";

type Params = { id: string };

// Role is immutable after creation. The master admin (role ADMIN) can only
// ever edit their own record — no one else, including a hypothetical other
// ADMIN row, can touch it. Editors can be freely managed by the master.
export const PATCH = adminRoute<Params>({ adminOnly: true }, async ({ request, session, params: { id } }) => {
  const data = await readJson(request, updateAdminUserSchema);

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) throw new ApiError(404, "This admin no longer exists. Refresh the page.");

  if (target.role === "ADMIN" && session.user.id !== target.id) {
    throw new ApiError(403, "Only the master admin can edit their own account");
  }

  const existing = await prisma.adminUser.findFirst({ where: { email: { equals: data.email, mode: "insensitive" } } });
  if (existing && existing.id !== id) throw new ApiError(409, "An admin with this email already exists", "email");

  const updateData: Prisma.AdminUserUpdateInput = {
    name: data.name,
    email: data.email,
    // Master admin's permissions field is unused/ignored regardless of value.
    permissions: target.role === "ADMIN" ? [] : data.permissions,
  };
  if (data.password) {
    updateData.passwordHash = await bcrypt.hash(data.password, 10);
  }

  await prisma.adminUser.update({ where: { id }, data: updateData });
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute<Params>({ adminOnly: true }, async ({ session, params: { id } }) => {
  if (id === session.user.id) throw new ApiError(400, "You cannot delete your own account");

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) throw new ApiError(404, "This admin no longer exists. Refresh the page.");

  if (target.role === "ADMIN") throw new ApiError(400, "The master admin account cannot be deleted");

  await prisma.adminUser.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
