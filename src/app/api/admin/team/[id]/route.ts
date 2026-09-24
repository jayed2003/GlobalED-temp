import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { teamMemberSchema } from "@/lib/validation/team";
import { logActivity } from "@/lib/activity";

type Params = { id: string };

export const PATCH = adminRoute<Params>({ permission: "TEAM" }, async ({ request, session, params: { id } }) => {
  const data = await readJson(request, teamMemberSchema);
  const current = await prisma.teamMember.findUnique({ where: { id }, select: { group: true } });
  if (!current) throw new ApiError(404, "This person is no longer on the team list. Refresh the page.");

  // Moving to the other group puts them at the end of it.
  let sortOrder: number | undefined;
  if (current.group !== data.group) {
    const last = await prisma.teamMember.findFirst({ where: { group: data.group }, orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });
    sortOrder = (last?.sortOrder ?? -1) + 1;
  }
  const updated = await prisma.teamMember.update({ where: { id }, data: { ...data, ...(sortOrder !== undefined ? { sortOrder } : {}) } });
  revalidateTag("team", { expire: 0 });
  await logActivity(session, { action: "UPDATED", entityType: "team", entityId: id, label: updated.name });
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute<Params>({ permission: "TEAM" }, async ({ session, params: { id } }) => {
  const removed = await prisma.teamMember.delete({ where: { id } });
  revalidateTag("team", { expire: 0 });
  await logActivity(session, { action: "DELETED", entityType: "team", entityId: id, label: removed.name });
  return NextResponse.json({ ok: true });
});
