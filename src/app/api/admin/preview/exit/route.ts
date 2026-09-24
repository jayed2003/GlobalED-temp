import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { safeSitePath } from "@/lib/preview";

/**
 * GET /api/admin/preview/exit?path=/blogs/my-post
 * Turns preview off and returns to the page as visitors see it. Needs no
 * sign-in, so an expired session can always leave preview.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  (await draftMode()).disable();
  return NextResponse.redirect(new URL(safeSitePath(url.searchParams.get("path")) ?? "/", url));
}
