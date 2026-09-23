import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import type { Course, CourseCategory } from "@/types";
import type { Course as CourseRow, CourseCategory as CourseCategoryEnum } from "@/generated/prisma/client";

const categoryToEnum: Record<CourseCategory, CourseCategoryEnum> = {
  ielts: "IELTS",
  english: "ENGLISH",
  "other-languages": "OTHER_LANGUAGES",
};

const categoryFromEnum: Record<CourseCategoryEnum, CourseCategory> = {
  IELTS: "ielts",
  ENGLISH: "english",
  OTHER_LANGUAGES: "other-languages",
};

function mapCourse(c: CourseRow): Course {
  return {
    slug: c.slug,
    title: c.title,
    category: categoryFromEnum[c.category],
    image: c.image,
    overview: c.overview,
    curriculum: c.curriculum,
    duration: c.duration,
    schedule: c.schedule,
    price: c.price,
    badge: c.badge ?? undefined,
  };
}

export const getAllCourses = unstable_cache(
  async (): Promise<Course[]> => {
    const rows = await prisma.course.findMany({ orderBy: { sortOrder: "asc" } });
    return rows.map(mapCourse);
  },
  ["courses-all"],
  { tags: ["courses"] },
);

export const getCourseSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const rows = await prisma.course.findMany({ select: { slug: true }, orderBy: { sortOrder: "asc" } });
    return rows.map((r) => r.slug);
  },
  ["courses-slugs"],
  { tags: ["courses"] },
);

export const getCourseBySlug = unstable_cache(
  async (slug: string): Promise<Course | undefined> => {
    const row = await prisma.course.findUnique({ where: { slug } });
    return row ? mapCourse(row) : undefined;
  },
  ["course-by-slug"],
  { tags: ["courses"] },
);

export const getCoursesByCategory = unstable_cache(
  async (category: CourseCategory): Promise<Course[]> => {
    const rows = await prisma.course.findMany({
      where: { category: categoryToEnum[category] },
      orderBy: { sortOrder: "asc" },
    });
    return rows.map(mapCourse);
  },
  ["courses-by-category"],
  { tags: ["courses"] },
);

export { categoryToEnum as courseCategoryToEnum, categoryFromEnum as courseCategoryFromEnum };
