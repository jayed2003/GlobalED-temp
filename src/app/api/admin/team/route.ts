import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, readJson } from "@/lib/api/admin-route";
import { teamMemberSchema } from "@/lib/validation/team";
import { logActivity } from "@/lib/activity";

export const POST = adminRoute({ permission: "TEAM" }, async ({ request, session }) => {
  const data = await readJson(request, teamMemberSchema);
  // New people go to the end of their group.
  const last = await prisma.teamMember.findFirst({ where: { group: data.group }, orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });
  const created = await prisma.teamMember.create({ data: { ...data, sortOrder: (last?.sortOrder ?? -1) + 1 } });
  revalidateTag("team", { expire: 0 });
  await logActivity(session, { action: "CREATED", entityType: "team", entityId: created.id, label: created.name });
  return NextResponse.json({ id: created.id }, { status: 201 });
});
