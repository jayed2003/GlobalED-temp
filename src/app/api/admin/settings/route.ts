import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, readJson } from "@/lib/api/admin-route";
import { siteSettingsSchema } from "@/lib/validation/settings";
import { logActivity } from "@/lib/activity";

/** Save Site settings (contact details, social links, key numbers, footer, CTA banner). */
export const PATCH = adminRoute({ permission: "SETTINGS" }, async ({ request, session }) => {
  const data = await readJson(request, siteSettingsSchema);

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: data,
    create: { id: "main", ...data },
  });

  revalidateTag("site-settings", { expire: 0 });
  await logActivity(session, { action: "UPDATED", entityType: "settings", entityId: "main", label: "Site settings" });
  return NextResponse.json({ ok: true });
});
