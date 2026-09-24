import { unstable_cache } from "next/cache";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { isPreview } from "@/lib/preview";
import { PAGES, type PageContent, type PageKey } from "@/lib/pages";
import { pageMetadata, SITE_NAME } from "@/lib/seo";

/**
 * Page content edited in Admin → Pages. Visitors get the published version
 * (cached, refreshed on publish); an admin previewing gets the saved draft.
 */

const getPublishedRow = unstable_cache(
  async (key: string) => prisma.sitePage.findUnique({ where: { key }, select: { published: true } }),
  ["site-page"],
  { tags: ["pages"] },
);

function parse<K extends PageKey>(key: K, raw: unknown, which: string): PageContent<K> {
  const parsed = PAGES[key].schema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    throw new Error(`Page "${key}" (${which}) doesn't match its definition: ${issue?.path.join(".")} — ${issue?.message}`);
  }
  return parsed.data as PageContent<K>;
}

export async function getPage<K extends PageKey>(key: K): Promise<PageContent<K>> {
  if (await isPreview()) {
    const row = await prisma.sitePage.findUnique({ where: { key }, select: { published: true, draft: true } });
    if (!row) throw new Error(`Page "${key}" is missing — run \`npx prisma migrate deploy\`.`);
    // A draft that no longer fits the page (e.g. saved before a change) falls back to published.
    if (row.draft) {
      const draft = PAGES[key].schema.safeParse(row.draft);
      if (draft.success) return draft.data as PageContent<K>;
    }
    return parse(key, row.published, "published");
  }
  const row = await getPublishedRow(key);
  if (!row) throw new Error(`Page "${key}" is missing — run \`npx prisma migrate deploy\`.`);
  return parse(key, row.published, "published");
}

/**
 * Metadata for an editable page from its SEO fields. The SEO title is the
 * full title as it appears in Google; empty fields fall back to the page
 * header (or the page's name).
 */
export function editablePageMetadata(
  key: PageKey,
  content: { seo: { title: string; description: string; ogImage: string; ogImageAlt: string } },
  fallback: { title?: string; description?: string } = {},
): Metadata {
  const def = PAGES[key];
  // Most pages have a header with a title and intro; use them as fallbacks.
  const hero = (content as { hero?: { title?: unknown; description?: unknown } }).hero;
  const heroTitle = typeof hero?.title === "string" ? hero.title : undefined;
  const heroDescription = typeof hero?.description === "string" ? hero.description : undefined;
  const titleBase = fallback.title ?? heroTitle ?? def.title;
  return pageMetadata({
    path: def.path,
    title: { absolute: content.seo.title || `${titleBase} | ${SITE_NAME}` },
    description: content.seo.description || fallback.description || heroDescription || "",
    image: content.seo.ogImage || null,
    imageAlt: content.seo.ogImageAlt || null,
  });
}
