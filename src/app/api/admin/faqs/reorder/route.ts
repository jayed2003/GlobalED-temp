import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, readJson } from "@/lib/api/admin-route";
import { reorderSchema } from "@/lib/api/reorder";
import { logActivity } from "@/lib/activity";

/** The order questions appear in on the FAQs and Services pages. */
export const POST = adminRoute({ permission: "FAQS" }, async ({ request, session }) => {
  const { ids } = await readJson(request, reorderSchema);
  await prisma.$transaction(ids.map((id, index) => prisma.faq.update({ where: { id }, data: { sortOrder: index } })));
  revalidateTag("faqs", { expire: 0 });
  await logActivity(session, { action: "UPDATED", entityType: "faq", label: "FAQ order", details: "Reordered" });
  return NextResponse.json({ ok: true });
});
