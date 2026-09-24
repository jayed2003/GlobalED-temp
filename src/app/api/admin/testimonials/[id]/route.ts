import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { assertNotDuplicate } from "@/lib/api/duplicates";
import { cleanText, testimonialSchema } from "@/lib/validation/testimonial";
import { logActivity } from "@/lib/activity";
type Params = { id: string };

async function orderTakenBy(sortOrder: number, excludeId?: string) {
  return prisma.testimonial.findFirst({
    where: { sortOrder, ...(excludeId ? { id: { not: excludeId } } : {}) },
    select: { studentName: true },
  });
}

export const PATCH = adminRoute<Params>({ permission: "TESTIMONIALS" }, async ({ request, session, params: { id } }) => {
  const data = await readJson(request, testimonialSchema);

  const reviews = await prisma.testimonial.findMany({ select: { id: true, studentName: true, university: true } });
  assertNotDuplicate(
    reviews.map((r) => ({ id: r.id, value: `${r.studentName}|${r.university}` })),
    `${cleanText(data.studentName)}|${cleanText(data.university)}`,
    {
      excludeId: id,
      message: `There is already a review from ${cleanText(data.studentName)} (${cleanText(data.university)})`,
      field: "studentName",
    },
  );

  const taken = await orderTakenBy(data.sortOrder, id);
  if (taken) {
    throw new ApiError(
      409,
      `Display order ${data.sortOrder} is already used by ${taken.studentName}. Pick a free number.`,
      "sortOrder",
    );
  }

  const updated = await prisma.testimonial.update({
    where: { id },
    data: {
      studentName: cleanText(data.studentName),
      reviewImage: data.reviewImage,
      reviewImageAlt: data.reviewImageAlt,
      university: cleanText(data.university),
      country: cleanText(data.country) || null,
      sortOrder: data.sortOrder,
    },
  });

  revalidateTag("testimonials", { expire: 0 });
  await logActivity(session, { action: "UPDATED", entityType: "testimonial", entityId: id, label: updated.studentName });
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute<Params>({ permission: "TESTIMONIALS" }, async ({ session, params: { id } }) => {
  const removed = await prisma.testimonial.delete({ where: { id } });
  await logActivity(session, { action: "DELETED", entityType: "testimonial", entityId: id, label: removed.studentName });

  revalidateTag("testimonials", { expire: 0 });
  return NextResponse.json({ ok: true });
});
