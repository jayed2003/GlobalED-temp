import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { adminRoute, readJson } from "@/lib/api/admin-route";
import { messageStatusOptions } from "@/lib/inbox";
import { logActivity } from "@/lib/activity";

type Params = { id: string };

// Either field (or both): the status, and/or read (true = opened, false = back to unread).
const updateSchema = z
  .strictObject({
    status: z.enum(["NEW", "REPLIED", "CLOSED"], "Invalid status").optional(),
    read: z.boolean().optional(),
  })
  .refine((d) => d.status !== undefined || d.read !== undefined, "Nothing to update");

export const PATCH = adminRoute<Params>({ permission: "MESSAGES" }, async ({ request, session, params: { id } }) => {
  const { status, read } = await readJson(request, updateSchema);
  const updated = await prisma.contactMessage.update({
    where: { id },
    data: {
      ...(status !== undefined ? { status } : {}),
      ...(read !== undefined ? { readAt: read ? new Date() : null } : {}),
    },
  });
  if (status !== undefined) {
    const statusLabel = messageStatusOptions.find((o) => o.value === status)?.label ?? status;
    await logActivity(session, { action: "STATUS_CHANGED", entityType: "message", entityId: id, label: updated.name, details: `Status: ${statusLabel}` });
  }
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute<Params>({ permission: "MESSAGES" }, async ({ session, params: { id } }) => {
  const removed = await prisma.contactMessage.delete({ where: { id } });
  await logActivity(session, { action: "DELETED", entityType: "message", entityId: id, label: removed.name });
  return NextResponse.json({ ok: true });
});
