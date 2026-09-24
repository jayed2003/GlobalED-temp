import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { assertNotDuplicate } from "@/lib/api/duplicates";
import { destinationSchema } from "@/lib/validation/destination";
import { recordSeoFields } from "@/lib/api/publish";
import { logActivity, savedAction } from "@/lib/activity";

type Params = { id: string };

export const PATCH = adminRoute<Params>({ permission: "DESTINATIONS" }, async ({ request, session, params: { id } }) => {
  const data = await readJson(request, destinationSchema);
  const current = await prisma.destination.findUnique({ where: { id }, select: { publishStatus: true } });
  if (!current) throw new ApiError(404, "This destination no longer exists. It may have been deleted — refresh the page.");

  const existing = await prisma.destination.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) throw new ApiError(409, "A destination with this slug already exists", "slug");

  const others = await prisma.destination.findMany({ select: { id: true, name: true } });
  assertNotDuplicate(
    others.map((r) => ({ id: r.id, value: r.name })),
    data.name,
    { excludeId: id, message: `A destination called "${data.name.trim()}" already exists`, field: "name" },
  );

  const updated = await prisma.destination.update({
    where: { id },
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
      publishStatus: data.publishStatus,
      ...recordSeoFields(data),
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
  await logActivity(session, { action: savedAction(current.publishStatus, data.publishStatus), entityType: "destination", entityId: id, label: updated.name });
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute<Params>({ permission: "DESTINATIONS" }, async ({ session, params: { id } }) => {
  const removed = await prisma.destination.delete({ where: { id } });
  await logActivity(session, { action: "DELETED", entityType: "destination", entityId: id, label: removed.name });

  revalidateTag("destinations", { expire: 0 });
  return NextResponse.json({ ok: true });
});
