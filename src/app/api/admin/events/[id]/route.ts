import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { eventSchema } from "@/lib/validation/event";
import { eventStatusToEnum } from "@/lib/content/events";

type Params = { id: string };

export const PATCH = adminRoute<Params>({ permission: "EVENTS" }, async ({ request, params: { id } }) => {
  const data = await readJson(request, eventSchema);

  const existing = await prisma.eventItem.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) throw new ApiError(409, "An event with this slug already exists", "slug");

  await prisma.eventItem.update({
    where: { id },
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
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute<Params>({ permission: "EVENTS" }, async ({ params: { id } }) => {
  await prisma.eventItem.delete({ where: { id } });

  revalidateTag("events", { expire: 0 });
  return NextResponse.json({ ok: true });
});
