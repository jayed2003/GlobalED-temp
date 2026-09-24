import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, readJson } from "@/lib/api/admin-route";
import { assertNotDuplicate } from "@/lib/api/duplicates";
import { branchSchema } from "@/lib/validation/branch";
import { logActivity } from "@/lib/activity";

export const POST = adminRoute({ permission: "SETTINGS" }, async ({ request, session }) => {
  const data = await readJson(request, branchSchema);

  const branches = await prisma.branch.findMany({ select: { id: true, name: true, sortOrder: true } });
  assertNotDuplicate(
    branches.map((b) => ({ id: b.id, value: b.name })),
    data.name,
    { message: `There is already a branch called "${data.name}"`, field: "name" },
  );

  const created = await prisma.branch.create({
    data: { ...data, sortOrder: branches.reduce((max, b) => Math.max(max, b.sortOrder + 1), 0) },
  });

  revalidateTag("branches", { expire: 0 });
  await logActivity(session, { action: "CREATED", entityType: "branch", entityId: created.id, label: created.name });
  return NextResponse.json({ id: created.id }, { status: 201 });
});
