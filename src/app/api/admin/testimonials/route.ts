import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requirePermission } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { cleanText, testimonialSchema } from "@/lib/validation/testimonial";

async function orderTakenBy(sortOrder: number, excludeId?: string) {
  return prisma.testimonial.findFirst({
    where: { sortOrder, ...(excludeId ? { id: { not: excludeId } } : {}) },
    select: { studentName: true },
  });
}

export async function POST(request: Request) {
  const session = await requirePermission("TESTIMONIALS");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const data = parsed.data;

  const taken = await orderTakenBy(data.sortOrder);
  if (taken) {
    return NextResponse.json(
      { error: `Display order ${data.sortOrder} is already used by ${taken.studentName}. Pick a free number.` },
      { status: 409 },
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
}
