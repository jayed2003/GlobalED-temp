import { prisma } from "@/lib/db";
import { isPageKey } from "@/lib/pages";

/**
 * Where an activity entry's item is edited in the admin panel — only for
 * items that still exist (a deleted post's entry keeps its name, unlinked).
 */

type Entry = { id: string; entityType: string; entityId: string | null };

/** Admin URL per type; `null` = the type has no page of its own. */
const EDIT_URL: Record<string, ((id: string) => string) | null> = {
  destination: (id) => `/admin/destinations/${id}/edit`,
  course: (id) => `/admin/courses/${id}/edit`,
  blog: (id) => `/admin/blogs/${id}/edit`,
  event: (id) => `/admin/events/${id}/edit`,
  testimonial: (id) => `/admin/testimonials/${id}/edit`,
  lead: (id) => `/admin/leads/${id}`,
  message: (id) => `/admin/messages/${id}`,
  admin: (id) => `/admin/admins/${id}/edit`,
  branch: (id) => `/admin/branches/${id}/edit`,
  service: (id) => `/admin/services/${id}/edit`,
  faq: (id) => `/admin/faqs/${id}/edit`,
  team: (id) => `/admin/team/${id}/edit`,
  page: (key) => `/admin/pages/${key}`,
  settings: null,
  ielts: null,
  session: null,
};

/** Singletons that always exist. */
const FIXED_URL: Record<string, string> = { settings: "/admin/settings", ielts: "/admin/ielts" };

/** Which of these ids still exist, per type. */
async function existing(type: string, ids: string[]): Promise<Set<string>> {
  const where = { id: { in: ids } };
  const select = { id: true } as const;
  const rows: { id: string }[] = await (() => {
    switch (type) {
      case "destination": return prisma.destination.findMany({ where, select });
      case "course": return prisma.course.findMany({ where, select });
      case "blog": return prisma.blogPost.findMany({ where, select });
      case "event": return prisma.eventItem.findMany({ where, select });
      case "testimonial": return prisma.testimonial.findMany({ where, select });
      case "lead": return prisma.lead.findMany({ where, select });
      case "message": return prisma.contactMessage.findMany({ where, select });
      case "admin": return prisma.adminUser.findMany({ where, select });
      case "branch": return prisma.branch.findMany({ where, select });
      case "service": return prisma.service.findMany({ where, select });
      case "faq": return prisma.faq.findMany({ where, select });
      case "team": return prisma.teamMember.findMany({ where, select });
      case "page": return Promise.resolve(ids.filter(isPageKey).map((id) => ({ id })));
      default: return Promise.resolve([]);
    }
  })();
  return new Set(rows.map((r) => r.id));
}

/** entry id → admin URL, for the entries whose item can still be opened. */
export async function activityLinks(entries: Entry[]): Promise<Map<string, string>> {
  const idsByType = new Map<string, Set<string>>();
  for (const e of entries) {
    if (!e.entityId || !EDIT_URL[e.entityType]) continue;
    if (!idsByType.has(e.entityType)) idsByType.set(e.entityType, new Set());
    idsByType.get(e.entityType)!.add(e.entityId);
  }
  const found = new Map(
    await Promise.all([...idsByType].map(async ([type, ids]) => [type, await existing(type, [...ids])] as const)),
  );

  const links = new Map<string, string>();
  for (const e of entries) {
    const fixed = FIXED_URL[e.entityType];
    if (fixed) links.set(e.id, fixed);
    else if (e.entityId && found.get(e.entityType)?.has(e.entityId)) links.set(e.id, EDIT_URL[e.entityType]!(e.entityId));
  }
  return links;
}
