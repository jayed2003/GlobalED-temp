import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requirePermission } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { courseSchema } from "@/lib/validation/course";
import { courseCategoryToEnum } from "@/lib/content/courses";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("COURSES");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = courseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const data = parsed.data;

  const existing = await prisma.course.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) {
    return NextResponse.json({ error: "A course with this slug already exists" }, { status: 409 });
  }

  await prisma.course.update({
    where: { id },
    data: {
      slug: data.slug,
      title: data.title,
      category: courseCategoryToEnum[data.category],
      image: data.image,
      overview: data.overview,
      curriculum: data.curriculum,
      duration: data.duration,
      schedule: data.schedule,
      price: data.price,
      badge: data.badge || null,
    },
  });

  revalidateTag("courses", { expire: 0 });
  revalidateTag("ielts-content", { expire: 0 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("COURSES");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.course.delete({ where: { id } });

  revalidateTag("courses", { expire: 0 });
  revalidateTag("ielts-content", { expire: 0 });
  return NextResponse.json({ ok: true });
}
