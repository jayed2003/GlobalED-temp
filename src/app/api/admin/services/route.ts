import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { assertNotDuplicate } from "@/lib/api/duplicates";
import { serviceSchema } from "@/lib/validation/service";
import { recordSeoFields } from "@/lib/api/publish";
import { createdAction, logActivity } from "@/lib/activity";

export const POST = adminRoute({ permission: "SERVICES" }, async ({ request, session }) => {
  const data = await readJson(request, serviceSchema);

  if (await prisma.service.findUnique({ where: { slug: data.slug } })) {
    throw new ApiError(409, "Another service already uses this slug", "slug");
  }
  const services = await prisma.service.findMany({ select: { id: true, title: true, sortOrder: true } });
  assertNotDuplicate(
    services.map((s) => ({ id: s.id, value: s.title })),
    data.title,
    { message: `There is already a service called "${data.title}"`, field: "title" },
  );

  const created = await prisma.service.create({
    data: { ...data, ...recordSeoFields(data), sortOrder: services.reduce((max, s) => Math.max(max, s.sortOrder + 1), 0) },
  });

  revalidateTag("services", { expire: 0 });
  await logActivity(session, {
    ...createdAction(data.status),
    entityType: "service",
    entityId: created.id,
    label: created.title,
  });
  return NextResponse.json({ id: created.id }, { status: 201 });
});
