import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requirePermission } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { eventSchema } from "@/lib/validation/event";
import { eventStatusToEnum } from "@/lib/content/events";

export async function POST(request: Request) {
  const session = await requirePermission("EVENTS");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const data = parsed.data;

  const existing = await prisma.eventItem.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return NextResponse.json({ error: "An event with this slug already exists" }, { status: 409 });
  }

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
}
