import { draftMode } from "next/headers";
import type { Session } from "next-auth";
import type { AdminPermission } from "@/generated/prisma/client";

/**
 * Preview: an admin sees unpublished changes (drafts) on the real site before
 * publishing. Built on Next.js draft mode — the cookie is signed by Next.js
 * and only set by /api/admin/preview for a signed-in admin, so visitors can
 * never turn it on. Content getters (src/lib/content/*) check isPreview() and
 * then skip the cache and include drafts.
 */

/** True while the current request is an admin preview. */
export async function isPreview(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    // Outside a request (e.g. generateStaticParams at build time).
    return false;
  }
}

/**
 * A site path that's safe to redirect to: same-origin, not the admin area or
 * the API. Returns null for anything else ("//evil.com", "https://…", "/admin").
 */
export function safeSitePath(value: string | null): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return null;
  let url: URL;
  try {
    url = new URL(value, "https://site.invalid");
  } catch {
    return null;
  }
  if (url.origin !== "https://site.invalid") return null;
  if (/^\/(admin|api)(\/|$)/.test(url.pathname)) return null;
  return url.pathname + url.search;
}

/** Which admin permissions can preview a path (any one is enough). */
function permissionsFor(path: string): AdminPermission[] {
  const section = path.split("/")[1] ?? "";
  switch (section) {
    case "blogs":
      return ["BLOGS", "PAGES"];
    case "destinations":
      return ["DESTINATIONS", "PAGES"];
    case "courses":
      return ["COURSES", "PAGES"];
    case "events":
      return ["EVENTS", "PAGES"];
    case "services":
      return ["SERVICES", "PAGES"];
    case "ielts":
      return ["IELTS", "PAGES"];
    default:
      return ["PAGES"];
  }
}

export function canPreview(session: Session, path: string): boolean {
  if (session.user.role === "ADMIN") return true;
  const mine = session.user.permissions ?? [];
  return permissionsFor(path).some((p) => mine.includes(p));
}
