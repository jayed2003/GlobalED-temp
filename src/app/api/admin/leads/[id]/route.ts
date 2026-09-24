import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { adminRoute, readJson } from "@/lib/api/admin-route";
import { leadStatusOptions } from "@/lib/inbox";
import { logActivity } from "@/lib/activity";

type Params = { id: string };

// Either field (or both): the status, and/or read (true = opened, false = back to unread).
const updateSchema = z
  .strictObject({
    status: z.enum(["NEW", "CONTACTED", "CLOSED"], "Invalid status").optional(),
    read: z.boolean().optional(),
  })
  .refine((d) => d.status !== undefined || d.read !== undefined, "Nothing to update");

export const PATCH = adminRoute<Params>({ permission: "LEADS" }, async ({ request, session, params: { id } }) => {
  const { status, read } = await readJson(request, updateSchema);
  const updated = await prisma.lead.update({
    where: { id },
    data: {
      ...(status !== undefined ? { status } : {}),
      ...(read !== undefined ? { readAt: read ? new Date() : null } : {}),
    },
  });
  if (status !== undefined) {
    const statusLabel = leadStatusOptions.find((o) => o.value === status)?.label ?? status;
    await logActivity(session, { action: "STATUS_CHANGED", entityType: "lead", entityId: id, label: updated.name, details: `Status: ${statusLabel}` });
  }
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute<Params>({ permission: "LEADS" }, async ({ session, params: { id } }) => {
  const removed = await prisma.lead.delete({ where: { id } });
  await logActivity(session, { action: "DELETED", entityType: "lead", entityId: id, label: removed.name });
  return NextResponse.json({ ok: true });
});
