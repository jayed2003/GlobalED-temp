import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { assertNotDuplicate } from "@/lib/api/duplicates";
import { destinationSchema } from "@/lib/validation/destination";

type Params = { id: string };

export const PATCH = adminRoute<Params>({ permission: "DESTINATIONS" }, async ({ request, params: { id } }) => {
  const data = await readJson(request, destinationSchema);

  const existing = await prisma.destination.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) throw new ApiError(409, "A destination with this slug already exists", "slug");

  const others = await prisma.destination.findMany({ select: { id: true, name: true } });
  assertNotDuplicate(
    others.map((r) => ({ id: r.id, value: r.name })),
    data.name,
    { excludeId: id, message: `A destination called "${data.name.trim()}" already exists`, field: "name" },
  );

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
});

export const DELETE = adminRoute<Params>({ permission: "DESTINATIONS" }, async ({ params: { id } }) => {
  await prisma.destination.delete({ where: { id } });

  revalidateTag("destinations", { expire: 0 });
  return NextResponse.json({ ok: true });
});
