import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { assertNotDuplicate } from "@/lib/api/duplicates";
import { destinationSchema } from "@/lib/validation/destination";

export const POST = adminRoute({ permission: "DESTINATIONS" }, async ({ request }) => {
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
      universities: { create: data.popularUniversities.map((u, i) => ({ ...u, sortOrder: i })) },
      faqs: { create: data.faqs.map((f, i) => ({ ...f, sortOrder: i })) },
    },
  });

  revalidateTag("destinations", { expire: 0 });
  return NextResponse.json({ id: created.id }, { status: 201 });
});
