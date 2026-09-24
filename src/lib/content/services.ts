import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { isPreview } from "@/lib/preview";
import type { Service, ServiceStep } from "@/types";
import type { Service as ServiceRow } from "@/generated/prisma/client";

/**
 * Services (Admin → Services). Visitors see published ones; an admin in
 * preview also sees drafts.
 */

function mapService(row: ServiceRow): Service {
  return {
    slug: row.slug,
    title: row.title,
    icon: row.icon,
    shortDescription: row.shortDescription,
    description: row.description,
    benefits: row.benefits,
    process: row.process as unknown as ServiceStep[],
    seoTitle: row.seoTitle,
    metaDescription: row.metaDescription,
    ogImage: row.ogImage,
    ogImageAlt: row.ogImageAlt,
  };
}

const ORDER = [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }];

const getPublishedServices = unstable_cache(
  async (): Promise<Service[]> =>
    (await prisma.service.findMany({ where: { status: "PUBLISHED" }, orderBy: ORDER })).map(mapService),
  ["services-published"],
  { tags: ["services"] },
);

/** Services shown on the site, in order (drafts too while previewing). */
export async function getServices(): Promise<Service[]> {
  if (await isPreview()) return (await prisma.service.findMany({ orderBy: ORDER })).map(mapService);
  return getPublishedServices();
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  return (await getServices()).find((s) => s.slug === slug);
}

/** For the menu, footer and sitemap. */
export async function getServiceLinks(): Promise<{ slug: string; title: string }[]> {
  return (await getServices()).map(({ slug, title }) => ({ slug, title }));
}
