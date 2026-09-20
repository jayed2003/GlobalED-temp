import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import type { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { updateAdminUserSchema } from "@/lib/validation/admin-user";

// Role is immutable after creation. The master admin (role ADMIN) can only
// ever edit their own record — no one else, including a hypothetical other
// ADMIN row, can touch it. Editors can be freely managed by the master.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = updateAdminUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const data = parsed.data;

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

  if (target.role === "ADMIN" && session.user.id !== target.id) {
    return NextResponse.json({ error: "Only the master admin can edit their own account" }, { status: 403 });
  }

  const existing = await prisma.adminUser.findUnique({ where: { email: data.email } });
  if (existing && existing.id !== id) {
    return NextResponse.json({ error: "An admin with this email already exists" }, { status: 409 });
  }

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
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (id === session.user.id) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

  if (target.role === "ADMIN") {
    return NextResponse.json({ error: "The master admin account cannot be deleted" }, { status: 400 });
  }

  await prisma.adminUser.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
