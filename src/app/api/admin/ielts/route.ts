import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { adminRoute, readJson } from "@/lib/api/admin-route";
import { ieltsContentSchema } from "@/lib/validation/ielts";
import { logActivity } from "@/lib/activity";

export const PATCH = adminRoute({ permission: "IELTS" }, async ({ request, session }) => {
  const data = await readJson(request, ieltsContentSchema);

  const courses = await prisma.course.findMany({ where: { slug: { in: data.preparation.courseSlugs } } });
  const courseIdBySlug = new Map(courses.map((c) => [c.slug, c.id]));

  await prisma.$transaction([
    prisma.ieltsContent.update({
      where: { id: "main" },
      data: {
        whatIsIeltsTitle: data.whatIsIelts.title,
        whatIsIeltsBody: data.whatIsIelts.body,
        whatIsIeltsPoints: data.whatIsIelts.points,
        whyIeltsTitle: data.whyIelts.title,
        whyIeltsBody: data.whyIelts.body,
        whyIeltsReasons: data.whyIelts.reasons as unknown as Prisma.InputJsonValue,
        whyGlobaledTitle: data.whyGlobaled.title,
        whyGlobaledBody: data.whyGlobaled.body,
        whyGlobaledUsps: data.whyGlobaled.usps as unknown as Prisma.InputJsonValue,
        whyGlobaledFreeServices: data.whyGlobaled.freeServices as unknown as Prisma.InputJsonValue,
        preparationTitle: data.preparation.title,
        preparationBody: data.preparation.body,
        preparationSkillAreas: data.preparation.skillAreas as unknown as Prisma.InputJsonValue,
        progressTrackerTitle: data.progressTracker.title,
        progressTrackerBody: data.progressTracker.body,
        progressTrackerTrackItems: data.progressTracker.trackItems,
        progressTrackerBenefits: data.progressTracker.benefits,
        successStoriesTitle: data.successStories.title,
        successStoriesBody: data.successStories.body,
        successStoriesAchievements: data.successStories.achievements as unknown as Prisma.InputJsonValue,
        successStoriesQuotes: data.successStories.quotes,
      },
    }),
    prisma.ieltsPreparationCourse.deleteMany({ where: { ieltsContentId: "main" } }),
    ...data.preparation.courseSlugs
      .map((slug, index) => {
        const courseId = courseIdBySlug.get(slug);
        if (!courseId) return null;
        return prisma.ieltsPreparationCourse.create({ data: { ieltsContentId: "main", courseId, sortOrder: index } });
      })
      .filter((op): op is NonNullable<typeof op> => op !== null),
  ]);

  revalidateTag("ielts-content", { expire: 0 });
  revalidateTag("courses", { expire: 0 });
  await logActivity(session, { action: "UPDATED", entityType: "ielts", entityId: "main", label: "IELTS pages" });
  return NextResponse.json({ ok: true });
});
