import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { isPageKey, pageDef } from "@/lib/pages";
import { logActivity } from "@/lib/activity";

type Params = { key: string };

const bodySchema = z.discriminatedUnion("action", [
  z.strictObject({ action: z.literal("draft"), content: z.unknown() }),
  z.strictObject({ action: z.literal("publish"), content: z.unknown() }),
  z.strictObject({ action: z.literal("discard") }),
]);

/**
 * Edit a page (Admin → Pages):
 *   draft   — save changes without publishing (visible only in preview)
 *   publish — make the content live and clear the draft
 *   discard — throw the draft away
 */
export const POST = adminRoute<Params>({ permission: "PAGES" }, async ({ request, session, params: { key } }) => {
  if (!isPageKey(key)) throw new ApiError(404, "There is no such page.");
  const def = pageDef(key);
  const body = await readJson(request, bodySchema);
  const updatedByName = session.user.name || session.user.email || "Admin";

  if (body.action === "discard") {
    // Nothing to discard → nothing changes (and nobody is recorded as the last editor).
    const current = await prisma.sitePage.findUnique({ where: { key }, select: { draft: true } });
    if (!current || current.draft === null) return NextResponse.json({ ok: true });
    await prisma.sitePage.update({ where: { key }, data: { draft: Prisma.DbNull, updatedByName } });
    await logActivity(session, { action: "UPDATED", entityType: "page", entityId: key, label: def.title, details: "Draft discarded" });
    return NextResponse.json({ ok: true });
  }

  const parsed = def.schema.safeParse(body.content);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    // The path matches the editor's field names (e.g. "howItWorks.steps.2.title").
    throw new ApiError(400, issue?.message ?? "Some of the content is invalid.", issue?.path.length ? issue.path.join(".") : undefined);
  }
  const content = parsed.data as Prisma.InputJsonValue;

  if (body.action === "draft") {
    await prisma.sitePage.update({ where: { key }, data: { draft: content, updatedByName } });
    await logActivity(session, { action: "UPDATED", entityType: "page", entityId: key, label: def.title, details: "Draft saved" });
    return NextResponse.json({ ok: true });
  }

  await prisma.sitePage.update({
    where: { key },
    data: { published: content, draft: Prisma.DbNull, publishedAt: new Date(), updatedByName },
  });
  revalidateTag("pages", { expire: 0 });
  await logActivity(session, { action: "PUBLISHED", entityType: "page", entityId: key, label: def.title });
  return NextResponse.json({ ok: true });
});
