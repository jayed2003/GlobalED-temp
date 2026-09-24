import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { assertNotDuplicate } from "@/lib/api/duplicates";
import { cleanText, testimonialSchema } from "@/lib/validation/testimonial";
import { logActivity } from "@/lib/activity";

async function orderTakenBy(sortOrder: number, excludeId?: string) {
  return prisma.testimonial.findFirst({
    where: { sortOrder, ...(excludeId ? { id: { not: excludeId } } : {}) },
    select: { studentName: true },
  });
}

export const POST = adminRoute({ permission: "TESTIMONIALS" }, async ({ request, session }) => {
  const data = await readJson(request, testimonialSchema);

  const reviews = await prisma.testimonial.findMany({ select: { id: true, studentName: true, university: true } });
  assertNotDuplicate(
    reviews.map((r) => ({ id: r.id, value: `${r.studentName}|${r.university}` })),
    `${cleanText(data.studentName)}|${cleanText(data.university)}`,
    {
      message: `There is already a review from ${cleanText(data.studentName)} (${cleanText(data.university)})`,
      field: "studentName",
    },
  );

  const taken = await orderTakenBy(data.sortOrder);
  if (taken) {
    throw new ApiError(
      409,
      `Display order ${data.sortOrder} is already used by ${taken.studentName}. Pick a free number.`,
      "sortOrder",
    );
  }

  const created = await prisma.testimonial.create({
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
  await logActivity(session, { action: "CREATED", entityType: "testimonial", entityId: created.id, label: created.studentName });
  return NextResponse.json({ id: created.id }, { status: 201 });
});
