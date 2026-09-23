import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import type { Destination } from "@/types";
import type { Destination as DestinationRow, DestinationUniversity, DestinationFaq } from "@/generated/prisma/client";

type DestinationWithRelations = DestinationRow & {
  universities: DestinationUniversity[];
  faqs: DestinationFaq[];
};

function mapDestination(d: DestinationWithRelations): Destination {
  return {
    slug: d.slug,
    name: d.name,
    tagline: d.tagline,
    heroImage: d.heroImage,
    flagImage: d.flagImage,
    overview: d.overview,
    whyStudyHere: d.whyStudyHere,
    popularUniversities: d.universities.map((u) => ({ name: u.name, city: u.city })),
    tuitionRange: d.tuitionRange,
    livingCost: d.livingCost,
    scholarships: d.scholarships,
    visaInfo: d.visaInfo,
    faqs: d.faqs.map((f) => ({ q: f.q, a: f.a })),
  };
}

const include = {
  universities: { orderBy: { sortOrder: "asc" as const } },
  faqs: { orderBy: { sortOrder: "asc" as const } },
};

export const getAllDestinations = unstable_cache(
  async (): Promise<Destination[]> => {
    const rows = await prisma.destination.findMany({ orderBy: { sortOrder: "asc" }, include });
    return rows.map(mapDestination);
  },
  ["destinations-all"],
  { tags: ["destinations"] },
);

export const getDestinationSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const rows = await prisma.destination.findMany({
      select: { slug: true },
      orderBy: { sortOrder: "asc" },
    });
    return rows.map((r) => r.slug);
  },
  ["destinations-slugs"],
  { tags: ["destinations"] },
);

export const getDestinationBySlug = unstable_cache(
  async (slug: string): Promise<Destination | undefined> => {
    const row = await prisma.destination.findUnique({ where: { slug }, include });
    return row ? mapDestination(row) : undefined;
  },
  ["destination-by-slug"],
  { tags: ["destinations"] },
);
