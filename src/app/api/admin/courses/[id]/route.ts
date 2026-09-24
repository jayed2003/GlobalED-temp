import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { assertNotDuplicate } from "@/lib/api/duplicates";
import { courseSchema } from "@/lib/validation/course";
import { courseCategoryToEnum } from "@/lib/content/courses";
import { logActivity } from "@/lib/activity";

type Params = { id: string };

export const PATCH = adminRoute<Params>({ permission: "COURSES" }, async ({ request, session, params: { id } }) => {
  const data = await readJson(request, courseSchema);

  const existing = await prisma.course.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) throw new ApiError(409, "A course with this slug already exists", "slug");

  const others = await prisma.course.findMany({ select: { id: true, title: true } });
  assertNotDuplicate(
    others.map((r) => ({ id: r.id, value: r.title })),
    data.title,
    { excludeId: id, message: `A course called "${data.title.trim()}" already exists`, field: "title" },
  );

  const updated = await prisma.course.update({
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
  await logActivity(session, { action: "UPDATED", entityType: "course", entityId: id, label: updated.title });
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute<Params>({ permission: "COURSES" }, async ({ session, params: { id } }) => {
  const removed = await prisma.course.delete({ where: { id } });
  await logActivity(session, { action: "DELETED", entityType: "course", entityId: id, label: removed.title });

  revalidateTag("courses", { expire: 0 });
  revalidateTag("ielts-content", { expire: 0 });
  return NextResponse.json({ ok: true });
});
