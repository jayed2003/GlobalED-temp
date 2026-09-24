import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { assertNotDuplicate } from "@/lib/api/duplicates";
import { destinationSchema } from "@/lib/validation/destination";
import { recordSeoFields } from "@/lib/api/publish";
import { createdAction, logActivity } from "@/lib/activity";

export const POST = adminRoute({ permission: "DESTINATIONS" }, async ({ request, session }) => {
  const data = await readJson(request, destinationSchema);

  const existing = await prisma.destination.findUnique({ where: { slug: data.slug } });
  if (existing) throw new ApiError(409, "A destination with this slug already exists", "slug");

  const others = await prisma.destination.findMany({ select: { id: true, name: true } });
  assertNotDuplicate(
    others.map((r) => ({ id: r.id, value: r.name })),
    data.name,
    { message: `A destination called "${data.name.trim()}" already exists`, field: "name" },
  );

  const count = await prisma.destination.count();

  const created = await prisma.destination.create({
    data: {
      slug: data.slug,
      name: data.name,
      tagline: data.tagline,
      heroImage: data.heroImage,
      heroImageAlt: data.heroImageAlt,
      flagImage: data.flagImage,
      flagImageAlt: data.flagImageAlt,
      overview: data.overview,
      whyStudyHere: data.whyStudyHere,
      tuitionRange: data.tuitionRange,
      livingCost: data.livingCost,
      scholarships: data.scholarships,
      visaInfo: data.visaInfo,
      sortOrder: count,
      publishStatus: data.publishStatus,
      ...recordSeoFields(data),
      universities: { create: data.popularUniversities.map((u, i) => ({ ...u, sortOrder: i })) },
      faqs: { create: data.faqs.map((f, i) => ({ ...f, sortOrder: i })) },
    },
  });

  revalidateTag("destinations", { expire: 0 });
  await logActivity(session, { ...createdAction(data.publishStatus), entityType: "destination", entityId: created.id, label: created.name });
  return NextResponse.json({ id: created.id }, { status: 201 });
});
