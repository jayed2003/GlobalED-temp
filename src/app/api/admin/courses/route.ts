import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { assertNotDuplicate } from "@/lib/api/duplicates";
import { courseSchema } from "@/lib/validation/course";
import { courseCategoryToEnum } from "@/lib/content/courses";

export const POST = adminRoute({ permission: "COURSES" }, async ({ request }) => {
  const data = await readJson(request, courseSchema);

  const existing = await prisma.course.findUnique({ where: { slug: data.slug } });
  if (existing) throw new ApiError(409, "A course with this slug already exists", "slug");

  const others = await prisma.course.findMany({ select: { id: true, title: true } });
  assertNotDuplicate(
    others.map((r) => ({ id: r.id, value: r.title })),
    data.title,
    { message: `A course called "${data.title.trim()}" already exists`, field: "title" },
  );

  const count = await prisma.course.count();

  const created = await prisma.course.create({
    data: {
      slug: data.slug,
      title: data.title,
      category: courseCategoryToEnum[data.category],
      image: data.image,
      imageAlt: data.imageAlt,
      overview: data.overview,
      curriculum: data.curriculum,
      duration: data.duration,
      schedule: data.schedule,
      price: data.price,
      badge: data.badge || null,
      sortOrder: count,
    },
  });

  revalidateTag("courses", { expire: 0 });
  revalidateTag("ielts-content", { expire: 0 });
  return NextResponse.json({ id: created.id }, { status: 201 });
});
