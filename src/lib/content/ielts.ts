import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import type { IeltsContent, IeltsUsp, IeltsFreeService, IeltsSkillArea, IeltsAchievement } from "@/types";
import type { IeltsContent as IeltsContentRow } from "@prisma/client";

export function mapIeltsContent(row: IeltsContentRow, courseSlugs: string[]): IeltsContent {
  return {
    whatIsIelts: {
      title: row.whatIsIeltsTitle,
      body: row.whatIsIeltsBody,
      points: row.whatIsIeltsPoints,
    },
    whyIelts: {
      title: row.whyIeltsTitle,
      body: row.whyIeltsBody,
      reasons: row.whyIeltsReasons as unknown as IeltsUsp[],
    },
    whyGlobaled: {
      title: row.whyGlobaledTitle,
      body: row.whyGlobaledBody,
      usps: row.whyGlobaledUsps as unknown as IeltsUsp[],
      freeServices: row.whyGlobaledFreeServices as unknown as IeltsFreeService[],
    },
    preparation: {
      title: row.preparationTitle,
      body: row.preparationBody,
      skillAreas: row.preparationSkillAreas as unknown as IeltsSkillArea[],
      courseSlugs,
    },
    progressTracker: {
      title: row.progressTrackerTitle,
      body: row.progressTrackerBody,
      trackItems: row.progressTrackerTrackItems,
      benefits: row.progressTrackerBenefits,
    },
    successStories: {
      title: row.successStoriesTitle,
      body: row.successStoriesBody,
      achievements: row.successStoriesAchievements as unknown as IeltsAchievement[],
      quotes: row.successStoriesQuotes,
    },
  };
}

export const getIeltsContent = unstable_cache(
  async (): Promise<IeltsContent> => {
    const row = await prisma.ieltsContent.findUniqueOrThrow({
      where: { id: "main" },
      include: { preparationCourses: { orderBy: { sortOrder: "asc" }, include: { course: true } } },
    });
    const courseSlugs = row.preparationCourses.map((pc) => pc.course.slug);
    return mapIeltsContent(row, courseSlugs);
  },
  ["ielts-content-main"],
  { tags: ["ielts-content"] },
);
