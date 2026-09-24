import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/authz";
import { canPreview, safeSitePath } from "@/lib/preview";

/**
 * GET /api/admin/preview?path=/blogs/my-post
 * Turns on preview (Next.js draft mode) for this browser and opens the page,
 * showing unpublished changes. Only for a signed-in admin allowed to edit
 * that part of the site.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = safeSitePath(url.searchParams.get("path"));
  if (!path) return NextResponse.json({ error: "Invalid preview address." }, { status: 400 });

  const session = await requireSession();
  if (!session) {
    const login = new URL("/admin/login", url);
    login.searchParams.set("callbackUrl", url.href);
    return NextResponse.redirect(login);
  }
  if (!canPreview(session, path)) {
    return NextResponse.json({ error: "You don't have access to preview this page." }, { status: 403 });
  }

  (await draftMode()).enable();
  return NextResponse.redirect(new URL(path, url));
}
