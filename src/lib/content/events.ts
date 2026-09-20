import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import type { EventItem } from "@/types";
import type { EventItem as EventRow, EventStatus as EventStatusEnum } from "@prisma/client";

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
    description: e.description,
    gallery: e.gallery.length > 0 ? e.gallery : undefined,
  };
}

export const getAllEvents = unstable_cache(
  async (): Promise<EventItem[]> => {
    const rows = await prisma.eventItem.findMany({ orderBy: { date: "desc" } });
    return rows.map(mapEvent);
  },
  ["events-all"],
  { tags: ["events"] },
);

export const getEventSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const rows = await prisma.eventItem.findMany({ select: { slug: true } });
    return rows.map((r) => r.slug);
  },
  ["events-slugs"],
  { tags: ["events"] },
);

export const getEventBySlug = unstable_cache(
  async (slug: string): Promise<EventItem | undefined> => {
    const row = await prisma.eventItem.findUnique({ where: { slug } });
    return row ? mapEvent(row) : undefined;
  },
  ["event-by-slug"],
  { tags: ["events"] },
);

export { statusToEnum as eventStatusToEnum, statusFromEnum as eventStatusFromEnum };
