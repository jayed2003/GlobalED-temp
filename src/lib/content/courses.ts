import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { isPreview } from "@/lib/preview";
import type { Course, CourseCategory } from "@/types";
import type { Course as CourseRow, CourseCategory as CourseCategoryEnum, Prisma } from "@/generated/prisma/client";

/**
 * Courses. Visitors see published ones (pages, menu, footer, IELTS page,
 * booking form, sitemap); an admin in preview also sees drafts.
 */

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
    imageAlt: c.imageAlt || c.title,
    overview: c.overview,
    curriculum: c.curriculum,
    duration: c.duration,
    schedule: c.schedule,
    price: c.price,
    badge: c.badge ?? undefined,
    seoTitle: c.seoTitle,
    metaDescription: c.metaDescription,
    ogImage: c.ogImage,
    ogImageAlt: c.ogImageAlt,
  };
}

async function loadCourses(where: Prisma.CourseWhereInput): Promise<Course[]> {
  const rows = await prisma.course.findMany({ where, orderBy: { sortOrder: "asc" } });
  return rows.map(mapCourse);
}

const getPublishedCourses = unstable_cache(
  () => loadCourses({ publishStatus: "PUBLISHED" }),
  ["courses-published"],
  { tags: ["courses"] },
);

/** Courses shown on the site, in order (drafts too while previewing). */
export async function getAllCourses(): Promise<Course[]> {
  if (await isPreview()) return loadCourses({});
  return getPublishedCourses();
}

/** Published slugs, for pre-rendering the course pages. */
export const getCourseSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const rows = await prisma.course.findMany({
      where: { publishStatus: "PUBLISHED" },
      select: { slug: true },
      orderBy: { sortOrder: "asc" },
    });
    return rows.map((r) => r.slug);
  },
  ["courses-published-slugs"],
  { tags: ["courses"] },
);

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  return (await getAllCourses()).find((c) => c.slug === slug);
}

export async function getCoursesByCategory(category: CourseCategory): Promise<Course[]> {
  return (await getAllCourses()).filter((c) => c.category === category);
}

export { categoryToEnum as courseCategoryToEnum, categoryFromEnum as courseCategoryFromEnum };
