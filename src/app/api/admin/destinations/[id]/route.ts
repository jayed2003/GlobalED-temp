import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requirePermission } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { destinationSchema } from "@/lib/validation/destination";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("DESTINATIONS");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = destinationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const data = parsed.data;

  const existing = await prisma.destination.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) {
    return NextResponse.json({ error: "A destination with this slug already exists" }, { status: 409 });
  }

  await prisma.destination.update({
    where: { id },
    data: {
      slug: data.slug,
      name: data.name,
      tagline: data.tagline,
      heroImage: data.heroImage,
      flagImage: data.flagImage,
      overview: data.overview,
      whyStudyHere: data.whyStudyHere,
      tuitionRange: data.tuitionRange,
      livingCost: data.livingCost,
      scholarships: data.scholarships,
      visaInfo: data.visaInfo,
      universities: {
        deleteMany: {},
        create: data.popularUniversities.map((u, i) => ({ ...u, sortOrder: i })),
      },
      faqs: {
        deleteMany: {},
        create: data.faqs.map((f, i) => ({ ...f, sortOrder: i })),
      },
    },
  });

  revalidateTag("destinations", { expire: 0 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("DESTINATIONS");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.destination.delete({ where: { id } });

  revalidateTag("destinations", { expire: 0 });
  return NextResponse.json({ ok: true });
}
