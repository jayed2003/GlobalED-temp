import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { createAdminUserSchema } from "@/lib/validation/admin-user";

// Always creates an EDITOR — there is exactly one master admin (the seeded
// account) and it's never created through this endpoint.
export const POST = adminRoute({ adminOnly: true }, async ({ request }) => {
  const data = await readJson(request, createAdminUserSchema);

  // Emails are stored lowercase (see admin-user.ts); insensitive match also
  // catches any older mixed-case row.
  const existing = await prisma.adminUser.findFirst({ where: { email: { equals: data.email, mode: "insensitive" } } });
  if (existing) throw new ApiError(409, "An admin with this email already exists", "email");

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
});
