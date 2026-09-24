import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { isPreview } from "@/lib/preview";
import type { EventItem } from "@/types";
import type { EventItem as EventRow, EventStatus as EventStatusEnum, Prisma } from "@/generated/prisma/client";

/**
 * Events. Visitors see published ones; an admin in preview also sees drafts.
 * (Upcoming / Previous is a separate thing: `status`.)
 */

type EventStatus = EventItem["status"];

const statusToEnum: Record<EventStatus, EventStatusEnum> = {
  upcoming: "UPCOMING",
  previous: "PREVIOUS",
};

const statusFromEnum: Record<EventStatusEnum, EventStatus> = {
  UPCOMING: "upcoming",
  PREVIOUS: "previous",
};

function mapEvent(e: EventRow): EventItem {
  return {
    slug: e.slug,
    title: e.title,
    status: statusFromEnum[e.status],
    date: e.date.toISOString().split("T")[0],
    time: e.time,
    venue: e.venue,
    bannerImage: e.bannerImage,
    bannerImageAlt: e.bannerImageAlt || e.title,
    description: e.description,
    gallery: e.gallery.length > 0 ? e.gallery : undefined,
    galleryAlts: e.gallery.map((_, i) => e.galleryAlts[i] || `${e.title} — photo ${i + 1}`),
    seoTitle: e.seoTitle,
    metaDescription: e.metaDescription,
    ogImage: e.ogImage,
    ogImageAlt: e.ogImageAlt,
  };
}

async function loadEvents(where: Prisma.EventItemWhereInput): Promise<EventItem[]> {
  const rows = await prisma.eventItem.findMany({ where, orderBy: { date: "desc" } });
  return rows.map(mapEvent);
}

const getPublishedEvents = unstable_cache(
  () => loadEvents({ publishStatus: "PUBLISHED" }),
  ["events-published"],
  { tags: ["events"] },
);

/** Events shown on the site, newest first (drafts too while previewing). */
export async function getAllEvents(): Promise<EventItem[]> {
  if (await isPreview()) return loadEvents({});
  return getPublishedEvents();
}

/** Published slugs, for pre-rendering the event pages. */
export const getEventSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const rows = await prisma.eventItem.findMany({ where: { publishStatus: "PUBLISHED" }, select: { slug: true } });
    return rows.map((r) => r.slug);
  },
  ["events-published-slugs"],
  { tags: ["events"] },
);

export async function getEventBySlug(slug: string): Promise<EventItem | undefined> {
  return (await getAllEvents()).find((e) => e.slug === slug);
}

export { statusToEnum as eventStatusToEnum, statusFromEnum as eventStatusFromEnum };
