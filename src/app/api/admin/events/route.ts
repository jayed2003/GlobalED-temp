import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { assertNotDuplicate } from "@/lib/api/duplicates";
import { eventSchema } from "@/lib/validation/event";
import { eventStatusToEnum } from "@/lib/content/events";

export const POST = adminRoute({ permission: "EVENTS" }, async ({ request }) => {
  const data = await readJson(request, eventSchema);

  const existing = await prisma.eventItem.findUnique({ where: { slug: data.slug } });
  if (existing) throw new ApiError(409, "An event with this slug already exists", "slug");

  const sameDay = await prisma.eventItem.findMany({ where: { date: new Date(data.date) }, select: { id: true, title: true } });
  assertNotDuplicate(
    sameDay.map((r) => ({ id: r.id, value: r.title })),
    data.title,
    { message: `An event titled "${data.title.trim()}" already exists on ${data.date}`, field: "title" },
  );

  const created = await prisma.eventItem.create({
    data: {
      slug: data.slug,
      title: data.title,
      status: eventStatusToEnum[data.status],
      date: new Date(data.date),
      time: data.time,
      venue: data.venue,
      bannerImage: data.bannerImage,
      description: data.description,
      gallery: data.gallery,
    },
  });

  revalidateTag("events", { expire: 0 });
  return NextResponse.json({ id: created.id }, { status: 201 });
});
