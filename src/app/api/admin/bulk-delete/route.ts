import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import type { AdminPermission } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { buildWhere, parseListQuery, type Where } from "@/lib/admin-list/core";
import { listConfigs, type ListSection } from "@/lib/admin-list/sections";
import { logActivity, type EntityType } from "@/lib/activity";

/**
 * "Delete selected" for every admin list: either explicit ids, or everything
 * matching the list's current search/filters (`query` is the list's URL query
 * string, rebuilt with the same config the list page used).
 */

const MAX_DELETE = 500;

const bodySchema = z
  .strictObject({
    section: z.enum(Object.keys(listConfigs) as [ListSection, ...ListSection[]]),
    ids: z.array(z.string().min(1).max(64)).max(MAX_DELETE).optional(),
    query: z.string().max(4000).optional(),
  })
  .refine((b) => (b.ids?.length ?? 0) > 0 || b.query !== undefined, "Nothing selected");

const sections: Record<
  ListSection,
  {
    permission: AdminPermission | "MASTER";
    tags: string[];
    count: (w: Where) => Promise<number>;
    remove: (w: Where) => Promise<{ count: number }>;
    /** Throws if deleting these would break the site. */
    guard?: (w: Where) => Promise<void>;
  }
> = {
  destinations: { permission: "DESTINATIONS", tags: ["destinations"], count: (w) => prisma.destination.count({ where: w }), remove: (w) => prisma.destination.deleteMany({ where: w }) },
  courses: { permission: "COURSES", tags: ["courses", "ielts-content"], count: (w) => prisma.course.count({ where: w }), remove: (w) => prisma.course.deleteMany({ where: w }) },
  blogs: { permission: "BLOGS", tags: ["blog-posts"], count: (w) => prisma.blogPost.count({ where: w }), remove: (w) => prisma.blogPost.deleteMany({ where: w }) },
  events: { permission: "EVENTS", tags: ["events"], count: (w) => prisma.eventItem.count({ where: w }), remove: (w) => prisma.eventItem.deleteMany({ where: w }) },
  testimonials: { permission: "TESTIMONIALS", tags: ["testimonials"], count: (w) => prisma.testimonial.count({ where: w }), remove: (w) => prisma.testimonial.deleteMany({ where: w }) },
  leads: { permission: "LEADS", tags: [], count: (w) => prisma.lead.count({ where: w }), remove: (w) => prisma.lead.deleteMany({ where: w }) },
  messages: { permission: "MESSAGES", tags: [], count: (w) => prisma.contactMessage.count({ where: w }), remove: (w) => prisma.contactMessage.deleteMany({ where: w }) },
  admins: { permission: "MASTER", tags: [], count: (w) => prisma.adminUser.count({ where: w }), remove: (w) => prisma.adminUser.deleteMany({ where: w }) },
  services: { permission: "SERVICES", tags: ["services"], count: (w) => prisma.service.count({ where: w }), remove: (w) => prisma.service.deleteMany({ where: w }) },
  faqs: { permission: "FAQS", tags: ["faqs"], count: (w) => prisma.faq.count({ where: w }), remove: (w) => prisma.faq.deleteMany({ where: w }) },
  team: { permission: "TEAM", tags: ["team"], count: (w) => prisma.teamMember.count({ where: w }), remove: (w) => prisma.teamMember.deleteMany({ where: w }) },
  branches: {
    permission: "SETTINGS",
    tags: ["branches"],
    count: (w) => prisma.branch.count({ where: w }),
    remove: (w) => prisma.branch.deleteMany({ where: w }),
    // Visitors choose a branch in the booking form, so one must stay shown.
    guard: async (w) => {
      const remaining = await prisma.branch.count({ where: { AND: [{ shown: true }, { NOT: w }] } });
      if (remaining === 0) {
        throw new ApiError(409, "At least one branch must stay on the site — visitors choose one in the booking form.");
      }
    },
  },
};

/** Activity-log entity for each bulk-delete section. */
const BULK_ENTITY: Record<keyof typeof sections, EntityType> = {
  destinations: "destination",
  courses: "course",
  blogs: "blog",
  events: "event",
  testimonials: "testimonial",
  leads: "lead",
  messages: "message",
  admins: "admin",
  branches: "branch",
  services: "service",
  faqs: "faq",
  team: "team",
};

export const POST = adminRoute({ anyAdmin: true }, async ({ request, session }) => {
  const body = await readJson(request, bodySchema);
  const section = sections[body.section];

  const isMaster = session.user.role === "ADMIN";
  const allowed = section.permission === "MASTER" ? isMaster : isMaster || session.user.permissions.includes(section.permission);
  if (!allowed) throw new ApiError(403, "You don't have permission to delete these.");

  // Admins: the master account and your own account are never deleted.
  const protectedWhere: Where | undefined =
    body.section === "admins" ? { role: "EDITOR", id: { not: session.user.id } } : undefined;

  const config = listConfigs[body.section];
  const selection: Where = body.ids?.length
    ? { id: { in: body.ids } }
    : buildWhere(config, parseListQuery(config, new URLSearchParams(body.query ?? "")));
  const where: Where = protectedWhere ? { AND: [selection, protectedWhere] } : selection;

  const requested = body.ids?.length ?? (await section.count(selection));
  const matching = await section.count(where);
  if (matching > MAX_DELETE) {
    throw new ApiError(400, `That's ${matching} items — delete at most ${MAX_DELETE} at a time. Narrow the filters first.`);
  }

  await section.guard?.(where);
  const { count } = await section.remove(where);
  for (const tag of section.tags) revalidateTag(tag, { expire: 0 });

  if (count > 0) {
    await logActivity(session, { action: "BULK_DELETED", entityType: BULK_ENTITY[body.section], label: `${count} ${count === 1 ? "item" : "items"}`, details: `${count} deleted` });
  }
  const skipped = requested - count;
  return NextResponse.json({
    deleted: count,
    skipped,
    message:
      skipped > 0 && body.section === "admins"
        ? `Deleted ${count}. Skipped ${skipped}: the master admin and your own account can't be deleted.`
        : `Deleted ${count}.`,
  });
});
