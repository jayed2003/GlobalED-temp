import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requirePermission } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { courseSchema } from "@/lib/validation/course";
import { courseCategoryToEnum } from "@/lib/content/courses";

export async function POST(request: Request) {
  const session = await requirePermission("COURSES");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = courseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const data = parsed.data;

  const existing = await prisma.course.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A course with this slug already exists" }, { status: 409 });
  }

  const count = await prisma.course.count();

  const created = await prisma.course.create({
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
      sortOrder: count,
    },
  });

  revalidateTag("courses");
  revalidateTag("ielts-content");
  return NextResponse.json({ id: created.id }, { status: 201 });
}
