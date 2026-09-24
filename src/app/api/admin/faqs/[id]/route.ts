import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { assertNotDuplicate } from "@/lib/api/duplicates";
import { faqSchema } from "@/lib/validation/faq";
import { logActivity } from "@/lib/activity";

type Params = { id: string };

export const PATCH = adminRoute<Params>({ permission: "FAQS" }, async ({ request, session, params: { id } }) => {
  const data = await readJson(request, faqSchema);
  const faqs = await prisma.faq.findMany({ select: { id: true, question: true } });
  if (!faqs.some((f) => f.id === id)) throw new ApiError(404, "This question no longer exists. It may have been deleted — refresh the page.");
  assertNotDuplicate(
    faqs.map((f) => ({ id: f.id, value: f.question })),
    data.question,
    { excludeId: id, message: "This question is already on the FAQs page", field: "question" },
  );

  const updated = await prisma.faq.update({ where: { id }, data });
  revalidateTag("faqs", { expire: 0 });
  await logActivity(session, { action: "UPDATED", entityType: "faq", entityId: id, label: updated.question });
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute<Params>({ permission: "FAQS" }, async ({ session, params: { id } }) => {
  const removed = await prisma.faq.delete({ where: { id } });
  revalidateTag("faqs", { expire: 0 });
  await logActivity(session, { action: "DELETED", entityType: "faq", entityId: id, label: removed.question });
  return NextResponse.json({ ok: true });
});
