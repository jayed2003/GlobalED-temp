import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { adminRoute, readJson } from "@/lib/api/admin-route";

type Params = { id: string };

// Either field (or both): the status, and/or read (true = opened, false = back to unread).
const updateSchema = z
  .strictObject({
    status: z.enum(["NEW", "CONTACTED", "CLOSED"], "Invalid status").optional(),
    read: z.boolean().optional(),
  })
  .refine((d) => d.status !== undefined || d.read !== undefined, "Nothing to update");

export const PATCH = adminRoute<Params>({ permission: "LEADS" }, async ({ request, params: { id } }) => {
  const { status, read } = await readJson(request, updateSchema);
  await prisma.lead.update({
    where: { id },
    data: {
      ...(status !== undefined ? { status } : {}),
      ...(read !== undefined ? { readAt: read ? new Date() : null } : {}),
    },
  });
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute<Params>({ permission: "LEADS" }, async ({ params: { id } }) => {
  await prisma.lead.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});
