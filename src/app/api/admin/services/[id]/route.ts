import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { assertNotDuplicate } from "@/lib/api/duplicates";
import { serviceSchema } from "@/lib/validation/service";
import { logActivity } from "@/lib/activity";

type Params = { id: string };

export const PATCH = adminRoute<Params>({ permission: "SERVICES" }, async ({ request, session, params: { id } }) => {
  const data = await readJson(request, serviceSchema);
  const current = await prisma.service.findUnique({ where: { id }, select: { status: true } });
  if (!current) throw new ApiError(404, "This service no longer exists. It may have been deleted — refresh the page.");

  const sameSlug = await prisma.service.findUnique({ where: { slug: data.slug } });
  if (sameSlug && sameSlug.id !== id) throw new ApiError(409, "Another service already uses this slug", "slug");
  const services = await prisma.service.findMany({ select: { id: true, title: true } });
  assertNotDuplicate(
    services.map((s) => ({ id: s.id, value: s.title })),
    data.title,
    { excludeId: id, message: `There is already a service called "${data.title}"`, field: "title" },
  );

  const updated = await prisma.service.update({ where: { id }, data });

  revalidateTag("services", { expire: 0 });
  const action =
    current.status !== data.status ? (data.status === "PUBLISHED" ? "PUBLISHED" : "UNPUBLISHED") : "UPDATED";
  await logActivity(session, { action, entityType: "service", entityId: id, label: updated.title });
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute<Params>({ permission: "SERVICES" }, async ({ session, params: { id } }) => {
  const removed = await prisma.service.delete({ where: { id } });
  revalidateTag("services", { expire: 0 });
  await logActivity(session, { action: "DELETED", entityType: "service", entityId: id, label: removed.title });
  return NextResponse.json({ ok: true });
});
