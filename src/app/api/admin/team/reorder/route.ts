import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, readJson } from "@/lib/api/admin-route";
import { reorderSchema } from "@/lib/api/reorder";
import { logActivity } from "@/lib/activity";

/** The order people appear in on Our Team (one group at a time). */
export const POST = adminRoute({ permission: "TEAM" }, async ({ request, session }) => {
  const { ids } = await readJson(request, reorderSchema);
  await prisma.$transaction(ids.map((id, index) => prisma.teamMember.update({ where: { id }, data: { sortOrder: index } })));
  revalidateTag("team", { expire: 0 });
  await logActivity(session, { action: "UPDATED", entityType: "team", label: "Team order", details: "Reordered" });
  return NextResponse.json({ ok: true });
});
