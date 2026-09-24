import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, readJson } from "@/lib/api/admin-route";
import { assertNotDuplicate } from "@/lib/api/duplicates";
import { faqSchema } from "@/lib/validation/faq";
import { logActivity } from "@/lib/activity";

export const POST = adminRoute({ permission: "FAQS" }, async ({ request, session }) => {
  const data = await readJson(request, faqSchema);
  const faqs = await prisma.faq.findMany({ select: { id: true, question: true, sortOrder: true } });
  assertNotDuplicate(
    faqs.map((f) => ({ id: f.id, value: f.question })),
    data.question,
    { message: "This question is already on the FAQs page", field: "question" },
  );

  const created = await prisma.faq.create({
    data: { ...data, sortOrder: faqs.reduce((max, f) => Math.max(max, f.sortOrder + 1), 0) },
  });
  revalidateTag("faqs", { expire: 0 });
  await logActivity(session, { action: "CREATED", entityType: "faq", entityId: created.id, label: created.question });
  return NextResponse.json({ id: created.id }, { status: 201 });
});
