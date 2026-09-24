import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, readJson } from "@/lib/api/admin-route";
import { reorderSchema } from "@/lib/api/reorder";
import { logActivity } from "@/lib/activity";

/** Save the order branches appear in (contact page, footer, booking form). */
export const POST = adminRoute({ permission: "SETTINGS" }, async ({ request, session }) => {
  const { ids } = await readJson(request, reorderSchema);
  await prisma.$transaction(ids.map((id, index) => prisma.branch.update({ where: { id }, data: { sortOrder: index } })));

  revalidateTag("branches", { expire: 0 });
  await logActivity(session, { action: "UPDATED", entityType: "branch", label: "Branch order", details: "Reordered" });
  return NextResponse.json({ ok: true });
});
