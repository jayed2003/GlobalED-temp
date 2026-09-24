import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { assertNotDuplicate } from "@/lib/api/duplicates";
import { eventSchema } from "@/lib/validation/event";
import { eventStatusToEnum } from "@/lib/content/events";
import { logActivity } from "@/lib/activity";

type Params = { id: string };

export const PATCH = adminRoute<Params>({ permission: "EVENTS" }, async ({ request, session, params: { id } }) => {
  const data = await readJson(request, eventSchema);

  const existing = await prisma.eventItem.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) throw new ApiError(409, "An event with this slug already exists", "slug");

  const sameDay = await prisma.eventItem.findMany({ where: { date: new Date(data.date) }, select: { id: true, title: true } });
  assertNotDuplicate(
    sameDay.map((r) => ({ id: r.id, value: r.title })),
    data.title,
    { excludeId: id, message: `An event titled "${data.title.trim()}" already exists on ${data.date}`, field: "title" },
  );

  const updated = await prisma.eventItem.update({
    where: { id },
    data: {
      slug: data.slug,
      title: data.title,
      status: eventStatusToEnum[data.status],
      date: new Date(data.date),
      time: data.time,
      venue: data.venue,
      bannerImage: data.bannerImage,
      bannerImageAlt: data.bannerImageAlt,
      description: data.description,
      gallery: data.gallery,
      // Kept exactly parallel to `gallery`.
      galleryAlts: data.gallery.map((_, i) => data.galleryAlts[i] ?? ""),
    },
  });

  revalidateTag("events", { expire: 0 });
  await logActivity(session, { action: "UPDATED", entityType: "event", entityId: id, label: updated.title });
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute<Params>({ permission: "EVENTS" }, async ({ session, params: { id } }) => {
  const removed = await prisma.eventItem.delete({ where: { id } });
  await logActivity(session, { action: "DELETED", entityType: "event", entityId: id, label: removed.title });

  revalidateTag("events", { expire: 0 });
  return NextResponse.json({ ok: true });
});
