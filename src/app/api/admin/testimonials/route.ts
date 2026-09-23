import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { cleanText, testimonialSchema } from "@/lib/validation/testimonial";

async function orderTakenBy(sortOrder: number, excludeId?: string) {
  return prisma.testimonial.findFirst({
    where: { sortOrder, ...(excludeId ? { id: { not: excludeId } } : {}) },
    select: { studentName: true },
  });
}

export const POST = adminRoute({ permission: "TESTIMONIALS" }, async ({ request }) => {
  const data = await readJson(request, testimonialSchema);

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
      university: cleanText(data.university),
      country: cleanText(data.country) || null,
      sortOrder: data.sortOrder,
    },
  });

  revalidateTag("testimonials", { expire: 0 });
  return NextResponse.json({ id: created.id }, { status: 201 });
});
