import type { ActivityLog, AdminPermission } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { visibleEntityTypes } from "@/lib/activity";
import { PAGES, isPageKey } from "@/lib/pages";
import { formatDate, formatDhakaDateTime, timeAgo, todayInDhaka } from "@/lib/validation/dates";

/**
 * Data for the admin dashboard. Every part is limited to the sections the
 * signed-in admin can open (`can`).
 */

export type Can = (permission: AdminPermission) => boolean;

const DAY = 24 * 60 * 60 * 1000;
const WEEKS = 12;

export interface LeadStats {
  unread: number;
  last7: number;
  last30: number;
  /** Rolling 7-day windows, oldest first; the last one ends now. */
  weeks: { start: Date; end: Date; count: number }[];
}

export async function leadStats(now = Date.now()): Promise<LeadStats> {
  const [unread, recent] = await Promise.all([
    prisma.lead.count({ where: { readAt: null } }),
    prisma.lead.findMany({ where: { createdAt: { gte: new Date(now - WEEKS * 7 * DAY) } }, select: { createdAt: true } }),
  ]);
  const weeks = Array.from({ length: WEEKS }, (_, i) => ({
    start: new Date(now - (WEEKS - i) * 7 * DAY),
    end: new Date(now - (WEEKS - 1 - i) * 7 * DAY),
    count: 0,
  }));
  for (const lead of recent) {
    const weeksAgo = Math.floor((now - lead.createdAt.getTime()) / (7 * DAY));
    if (weeksAgo >= 0 && weeksAgo < WEEKS) weeks[WEEKS - 1 - weeksAgo].count++;
  }
  return {
    unread,
    last7: weeks[WEEKS - 1].count,
    last30: recent.filter((l) => now - l.createdAt.getTime() < 30 * DAY).length,
    weeks,
  };
}

export interface AttentionItem {
  key: string;
  /** Warnings (something is wrong on the site) come before reminders. */
  tone: "warning" | "info";
  title: string;
  detail?: string;
  href: string;
}

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** Things an editor should look at: stale events, drafts, unpublished page edits, missing SEO text. */
export async function needsAttention(can: Can): Promise<AttentionItem[]> {
  const items: AttentionItem[] = [];
  const now = new Date();
  const jobs: Promise<void>[] = [];

  if (can("EVENTS")) {
    jobs.push(
      (async () => {
        // Date-only column stored as UTC midnight: earlier than today (Bangladesh) = past.
        const stale = await prisma.eventItem.findMany({
          where: { status: "UPCOMING", date: { lt: new Date(`${todayInDhaka()}T00:00:00Z`) } },
          orderBy: { date: "asc" },
          select: { id: true, title: true, date: true },
        });
        for (const e of stale) {
          items.push({
            key: `event-${e.id}`,
            tone: "warning",
            title: `“${e.title}” is still marked Upcoming`,
            detail: `Its date (${formatDate(e.date.toISOString().slice(0, 10))}) has passed — set it to Previous.`,
            href: `/admin/events/${e.id}/edit`,
          });
        }
      })(),
    );
  }

  if (can("PAGES")) {
    jobs.push(
      (async () => {
        // A handful of rows; a draft is JSON (null when there is none).
        const pages = await prisma.sitePage.findMany({ select: { key: true, draft: true, updatedByName: true, updatedAt: true } });
        for (const p of pages.filter((p) => p.draft != null && isPageKey(p.key))) {
          items.push({
            key: `page-${p.key}`,
            tone: "info",
            title: `${PAGES[p.key as keyof typeof PAGES].title} has unpublished changes`,
            detail: `Saved as a draft by ${p.updatedByName}, ${timeAgo(p.updatedAt)}.`,
            href: `/admin/pages/${p.key}`,
          });
        }
      })(),
    );
  }

  if (can("BLOGS")) {
    jobs.push(
      (async () => {
        const [drafts, scheduled, next, noDescription] = await Promise.all([
          prisma.blogPost.count({ where: { publishStatus: "DRAFT" } }),
          prisma.blogPost.count({ where: { publishStatus: "PUBLISHED", publishedAt: { gt: now } } }),
          prisma.blogPost.findFirst({
            where: { publishStatus: "PUBLISHED", publishedAt: { gt: now } },
            orderBy: { publishedAt: "asc" },
            select: { title: true, publishedAt: true },
          }),
          prisma.blogPost.count({ where: { publishStatus: "PUBLISHED", metaDescription: "" } }),
        ]);
        if (drafts) items.push({ key: "blog-drafts", tone: "info", title: plural(drafts, "draft blog post"), href: "/admin/blogs?f_state=draft" });
        if (scheduled && next) {
          items.push({
            key: "blog-scheduled",
            tone: "info",
            title: plural(scheduled, "scheduled blog post"),
            detail: `Next: “${next.title}”, ${formatDhakaDateTime(next.publishedAt)}.`,
            href: "/admin/blogs?f_state=scheduled",
          });
        }
        if (noDescription) {
          items.push({
            key: "blog-seo",
            tone: "info",
            title: `${plural(noDescription, "blog post")} without a meta description`,
            detail: "Search results show the excerpt instead — add one in the SEO panel.",
            href: "/admin/blogs?f_seo=missing",
          });
        }
      })(),
    );
  }

  const drafts: { permission: AdminPermission; what: string; href: string; count: () => Promise<number> }[] = [
    { permission: "DESTINATIONS", what: "draft destination", href: "/admin/destinations?f_publishStatus=DRAFT", count: () => prisma.destination.count({ where: { publishStatus: "DRAFT" } }) },
    { permission: "COURSES", what: "draft course", href: "/admin/courses?f_publishStatus=DRAFT", count: () => prisma.course.count({ where: { publishStatus: "DRAFT" } }) },
    { permission: "EVENTS", what: "draft event", href: "/admin/events?f_publishStatus=DRAFT", count: () => prisma.eventItem.count({ where: { publishStatus: "DRAFT" } }) },
    { permission: "SERVICES", what: "draft service", href: "/admin/services?f_status=DRAFT", count: () => prisma.service.count({ where: { status: "DRAFT" } }) },
  ];
  for (const d of drafts.filter((d) => can(d.permission))) {
    jobs.push(
      (async () => {
        const n = await d.count();
        if (n) items.push({ key: d.href, tone: "info", title: plural(n, d.what), href: d.href });
      })(),
    );
  }

  await Promise.all(jobs);
  return items.sort((a, b) => (a.tone === b.tone ? 0 : a.tone === "warning" ? -1 : 1));
}

/** Latest changes in the sections this admin can see (sign-ins are left to the Activity page). */
export function recentActivity(role: "ADMIN" | "EDITOR", permissions: AdminPermission[], take = 8): Promise<ActivityLog[]> {
  return prisma.activityLog.findMany({
    where: { entityType: { in: visibleEntityTypes(role, permissions) }, action: { not: "SIGNED_IN" } },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export interface ContentCount {
  label: string;
  href: string;
  total: number;
  /** Drafts / hidden items among them, with what to call them. */
  aside?: string;
}

/** How much of each kind of content there is (published, plus drafts or hidden). */
export async function contentCounts(can: Can): Promise<ContentCount[]> {
  const rows: { permission: AdminPermission; get: () => Promise<ContentCount> }[] = [
    {
      permission: "DESTINATIONS",
      get: async () => {
        const [live, draft] = await Promise.all([
          prisma.destination.count({ where: { publishStatus: "PUBLISHED" } }),
          prisma.destination.count({ where: { publishStatus: "DRAFT" } }),
        ]);
        return { label: "Destinations", href: "/admin/destinations", total: live, aside: draft ? `${draft} draft` : undefined };
      },
    },
    {
      permission: "COURSES",
      get: async () => {
        const [live, draft] = await Promise.all([
          prisma.course.count({ where: { publishStatus: "PUBLISHED" } }),
          prisma.course.count({ where: { publishStatus: "DRAFT" } }),
        ]);
        return { label: "Courses", href: "/admin/courses", total: live, aside: draft ? `${draft} draft` : undefined };
      },
    },
    {
      permission: "BLOGS",
      get: async () => {
        const [live, draft] = await Promise.all([
          prisma.blogPost.count({ where: { publishStatus: "PUBLISHED", publishedAt: { lte: new Date() } } }),
          prisma.blogPost.count({ where: { OR: [{ publishStatus: "DRAFT" }, { publishedAt: { gt: new Date() } }] } }),
        ]);
        return { label: "Blog posts", href: "/admin/blogs", total: live, aside: draft ? `${draft} not live yet` : undefined };
      },
    },
    {
      permission: "EVENTS",
      get: async () => {
        const [upcoming, all] = await Promise.all([
          prisma.eventItem.count({ where: { publishStatus: "PUBLISHED", status: "UPCOMING" } }),
          prisma.eventItem.count({ where: { publishStatus: "PUBLISHED" } }),
        ]);
        return { label: "Events", href: "/admin/events", total: all, aside: `${upcoming} upcoming` };
      },
    },
    {
      permission: "SERVICES",
      get: async () => ({ label: "Services", href: "/admin/services", total: await prisma.service.count({ where: { status: "PUBLISHED" } }) }),
    },
    {
      permission: "TESTIMONIALS",
      get: async () => ({ label: "Reviews", href: "/admin/testimonials", total: await prisma.testimonial.count() }),
    },
    {
      permission: "FAQS",
      get: async () => ({ label: "FAQs", href: "/admin/faqs", total: await prisma.faq.count({ where: { shown: true } }) }),
    },
    {
      permission: "TEAM",
      get: async () => ({ label: "Team members", href: "/admin/team", total: await prisma.teamMember.count({ where: { shown: true } }) }),
    },
  ];
  return Promise.all(rows.filter((r) => can(r.permission)).map((r) => r.get()));
}
