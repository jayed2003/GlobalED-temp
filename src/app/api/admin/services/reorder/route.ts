import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, readJson } from "@/lib/api/admin-route";
import { reorderSchema } from "@/lib/api/reorder";
import { logActivity } from "@/lib/activity";

/** The order services appear in (home, services page, menu, footer). */
export const POST = adminRoute({ permission: "SERVICES" }, async ({ request, session }) => {
  const { ids } = await readJson(request, reorderSchema);
  await prisma.$transaction(ids.map((id, index) => prisma.service.update({ where: { id }, data: { sortOrder: index } })));
  revalidateTag("services", { expire: 0 });
  await logActivity(session, { action: "UPDATED", entityType: "service", label: "Service order", details: "Reordered" });
  return NextResponse.json({ ok: true });
});
