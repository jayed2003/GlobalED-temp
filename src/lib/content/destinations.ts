import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { isPreview } from "@/lib/preview";
import type { Destination } from "@/types";
import type { Destination as DestinationRow, DestinationUniversity, DestinationFaq, Prisma } from "@/generated/prisma/client";

/**
 * Destinations. Visitors see published ones (pages, menu, footer, booking
 * form, sitemap); an admin in preview also sees drafts.
 */

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
    heroImageAlt: d.heroImageAlt || `Study in ${d.name}`,
    flagImage: d.flagImage,
    flagImageAlt: d.flagImageAlt || `Flag of ${d.name}`,
    overview: d.overview,
    whyStudyHere: d.whyStudyHere,
    popularUniversities: d.universities.map((u) => ({ name: u.name, city: u.city })),
    tuitionRange: d.tuitionRange,
    livingCost: d.livingCost,
    scholarships: d.scholarships,
    visaInfo: d.visaInfo,
    faqs: d.faqs.map((f) => ({ q: f.q, a: f.a })),
    seoTitle: d.seoTitle,
    metaDescription: d.metaDescription,
    ogImage: d.ogImage,
    ogImageAlt: d.ogImageAlt,
  };
}

const include = {
  universities: { orderBy: { sortOrder: "asc" as const } },
  faqs: { orderBy: { sortOrder: "asc" as const } },
};

async function loadDestinations(where: Prisma.DestinationWhereInput): Promise<Destination[]> {
  const rows = await prisma.destination.findMany({ where, orderBy: { sortOrder: "asc" }, include });
  return rows.map(mapDestination);
}

const getPublishedDestinations = unstable_cache(
  () => loadDestinations({ publishStatus: "PUBLISHED" }),
  ["destinations-published"],
  { tags: ["destinations"] },
);

/** Destinations shown on the site, in order (drafts too while previewing). */
export async function getAllDestinations(): Promise<Destination[]> {
  if (await isPreview()) return loadDestinations({});
  return getPublishedDestinations();
}

/** Published slugs, for pre-rendering the destination pages. */
export const getDestinationSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const rows = await prisma.destination.findMany({
      where: { publishStatus: "PUBLISHED" },
      select: { slug: true },
      orderBy: { sortOrder: "asc" },
    });
    return rows.map((r) => r.slug);
  },
  ["destinations-published-slugs"],
  { tags: ["destinations"] },
);

export async function getDestinationBySlug(slug: string): Promise<Destination | undefined> {
  return (await getAllDestinations()).find((d) => d.slug === slug);
}
