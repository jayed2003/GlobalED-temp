import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import type { AdminPermission } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { buildWhere, parseListQuery, type Where } from "@/lib/admin-list/core";
import { listConfigs, type ListSection } from "@/lib/admin-list/sections";

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
  { permission: AdminPermission | "MASTER"; tags: string[]; count: (w: Where) => Promise<number>; remove: (w: Where) => Promise<{ count: number }> }
> = {
  destinations: { permission: "DESTINATIONS", tags: ["destinations"], count: (w) => prisma.destination.count({ where: w }), remove: (w) => prisma.destination.deleteMany({ where: w }) },
  courses: { permission: "COURSES", tags: ["courses", "ielts-content"], count: (w) => prisma.course.count({ where: w }), remove: (w) => prisma.course.deleteMany({ where: w }) },
  blogs: { permission: "BLOGS", tags: ["blog-posts"], count: (w) => prisma.blogPost.count({ where: w }), remove: (w) => prisma.blogPost.deleteMany({ where: w }) },
  events: { permission: "EVENTS", tags: ["events"], count: (w) => prisma.eventItem.count({ where: w }), remove: (w) => prisma.eventItem.deleteMany({ where: w }) },
  testimonials: { permission: "TESTIMONIALS", tags: ["testimonials"], count: (w) => prisma.testimonial.count({ where: w }), remove: (w) => prisma.testimonial.deleteMany({ where: w }) },
  leads: { permission: "LEADS", tags: [], count: (w) => prisma.lead.count({ where: w }), remove: (w) => prisma.lead.deleteMany({ where: w }) },
  messages: { permission: "MESSAGES", tags: [], count: (w) => prisma.contactMessage.count({ where: w }), remove: (w) => prisma.contactMessage.deleteMany({ where: w }) },
  admins: { permission: "MASTER", tags: [], count: (w) => prisma.adminUser.count({ where: w }), remove: (w) => prisma.adminUser.deleteMany({ where: w }) },
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

  const { count } = await section.remove(where);
  for (const tag of section.tags) revalidateTag(tag, { expire: 0 });

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
