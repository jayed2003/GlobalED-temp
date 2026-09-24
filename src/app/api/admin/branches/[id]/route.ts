import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { assertNotDuplicate } from "@/lib/api/duplicates";
import { branchSchema } from "@/lib/validation/branch";
import { logActivity } from "@/lib/activity";

type Params = { id: string };

const LAST_BRANCH = "At least one branch must stay on the site — visitors choose one in the booking form.";

/** Refuse to leave the site with no branch shown. */
async function assertAnotherShownBranch(id: string) {
  const others = await prisma.branch.count({ where: { shown: true, id: { not: id } } });
  if (others === 0) throw new ApiError(409, LAST_BRANCH);
}

export const PATCH = adminRoute<Params>({ permission: "SETTINGS" }, async ({ request, session, params: { id } }) => {
  const data = await readJson(request, branchSchema);
  const current = await prisma.branch.findUnique({ where: { id }, select: { shown: true } });
  if (!current) throw new ApiError(404, "This branch no longer exists. It may have been deleted — refresh the page.");
  if (current.shown && !data.shown) await assertAnotherShownBranch(id);

  const branches = await prisma.branch.findMany({ select: { id: true, name: true } });
  assertNotDuplicate(
    branches.map((b) => ({ id: b.id, value: b.name })),
    data.name,
    { excludeId: id, message: `There is already a branch called "${data.name}"`, field: "name" },
  );

  const updated = await prisma.branch.update({ where: { id }, data });

  revalidateTag("branches", { expire: 0 });
  await logActivity(session, { action: "UPDATED", entityType: "branch", entityId: id, label: updated.name });
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute<Params>({ permission: "SETTINGS" }, async ({ session, params: { id } }) => {
  const current = await prisma.branch.findUnique({ where: { id }, select: { shown: true } });
  if (current?.shown) await assertAnotherShownBranch(id);

  // Leads keep the branch name as text, so they are unaffected.
  const removed = await prisma.branch.delete({ where: { id } });

  revalidateTag("branches", { expire: 0 });
  await logActivity(session, { action: "DELETED", entityType: "branch", entityId: id, label: removed.name });
  return NextResponse.json({ ok: true });
});
