import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { createAdminUserSchema } from "@/lib/validation/admin-user";

// Always creates an EDITOR — there is exactly one master admin (the seeded
// account) and it's never created through this endpoint.
export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = createAdminUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const data = parsed.data;

  const existing = await prisma.adminUser.findUnique({ where: { email: data.email } });
  if (existing) {
    return NextResponse.json({ error: "An admin with this email already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const created = await prisma.adminUser.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: "EDITOR",
      permissions: data.permissions,
    },
  });

  return NextResponse.json({ id: created.id }, { status: 201 });
}
