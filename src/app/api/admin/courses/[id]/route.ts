import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { assertNotDuplicate } from "@/lib/api/duplicates";
import { courseSchema } from "@/lib/validation/course";
import { courseCategoryToEnum } from "@/lib/content/courses";

type Params = { id: string };

export const PATCH = adminRoute<Params>({ permission: "COURSES" }, async ({ request, params: { id } }) => {
  const data = await readJson(request, courseSchema);

  const existing = await prisma.course.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) throw new ApiError(409, "A course with this slug already exists", "slug");

  const others = await prisma.course.findMany({ select: { id: true, title: true } });
  assertNotDuplicate(
    others.map((r) => ({ id: r.id, value: r.title })),
    data.title,
    { excludeId: id, message: `A course called "${data.title.trim()}" already exists`, field: "title" },
  );

  await prisma.course.update({
    where: { id },
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
    },
  });

  revalidateTag("courses", { expire: 0 });
  revalidateTag("ielts-content", { expire: 0 });
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute<Params>({ permission: "COURSES" }, async ({ params: { id } }) => {
  await prisma.course.delete({ where: { id } });

  revalidateTag("courses", { expire: 0 });
  revalidateTag("ielts-content", { expire: 0 });
  return NextResponse.json({ ok: true });
});
