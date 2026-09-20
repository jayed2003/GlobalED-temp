import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requirePermission } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { eventSchema } from "@/lib/validation/event";
import { eventStatusToEnum } from "@/lib/content/events";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("EVENTS");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const data = parsed.data;

  const existing = await prisma.eventItem.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) {
    return NextResponse.json({ error: "An event with this slug already exists" }, { status: 409 });
  }

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

  revalidateTag("events");
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("EVENTS");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.eventItem.delete({ where: { id } });

  revalidateTag("events");
  return NextResponse.json({ ok: true });
}
