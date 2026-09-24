import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { isPreview } from "@/lib/preview";
import type { BlogPost, BlogCategory } from "@/types";
import type { BlogPost as BlogPostRow, BlogCategory as BlogCategoryEnum, Prisma } from "@/generated/prisma/client";
import { dhakaParts } from "@/lib/validation/dates";

const categoryToEnum: Record<BlogCategory, BlogCategoryEnum> = {
  "country-wise": "COUNTRY_WISE",
  scholarships: "SCHOLARSHIPS",
  ielts: "IELTS",
  english: "ENGLISH",
};

const categoryFromEnum: Record<BlogCategoryEnum, BlogCategory> = {
  COUNTRY_WISE: "country-wise",
  SCHOLARSHIPS: "scholarships",
  IELTS: "ielts",
  ENGLISH: "english",
};

function mapPost(p: BlogPostRow): BlogPost {
  return {
    slug: p.slug,
    title: p.title,
    category: categoryFromEnum[p.category],
    coverImage: p.coverImage,
    coverImageAlt: p.coverImageAlt || p.title,
    excerpt: p.excerpt,
    content: p.content,
    author: p.author,
    publishedAt: dhakaParts(p.publishedAt).date,
    publishedAtIso: p.publishedAt.toISOString(),
    featured: p.featured,
    seoTitle: p.seoTitle,
    metaDescription: p.metaDescription,
    ogImage: p.ogImage,
    ogImageAlt: p.ogImageAlt,
  };
}

/**
 * Scheduled posts are stored like any other but stay hidden until their
 * publish time. The check runs on every request (after the cache), so a post
 * appears the minute it's due — no cache refresh needed. Drafts are left out
 * whatever their date. An admin in preview sees drafts and scheduled posts.
 */
function isLive(post: BlogPost): boolean {
  return Date.parse(post.publishedAtIso ?? post.publishedAt) <= Date.now();
}

async function loadPosts(where: Prisma.BlogPostWhereInput): Promise<BlogPost[]> {
  const rows = await prisma.blogPost.findMany({ where, orderBy: { publishedAt: "desc" } });
  return rows.map(mapPost);
}

const getPublishedPostsIncludingScheduled = unstable_cache(
  () => loadPosts({ publishStatus: "PUBLISHED" }),
  ["blog-posts-published"],
  { tags: ["blog-posts"] },
);

/** Live posts, newest first (drafts and scheduled posts too while previewing). */
export async function getAllPosts(): Promise<BlogPost[]> {
  if (await isPreview()) return loadPosts({});
  return (await getPublishedPostsIncludingScheduled()).filter(isLive);
}

/** Published slugs, for pre-rendering the post pages. */
export const getPostSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const rows = await prisma.blogPost.findMany({ where: { publishStatus: "PUBLISHED" }, select: { slug: true } });
    return rows.map((r) => r.slug);
  },
  ["blog-posts-published-slugs"],
  { tags: ["blog-posts"] },
);

const getPublishedPostBySlug = unstable_cache(
  async (slug: string): Promise<BlogPost | undefined> => {
    const row = await prisma.blogPost.findFirst({ where: { slug, publishStatus: "PUBLISHED" } });
    return row ? mapPost(row) : undefined;
  },
  ["blog-post-published-by-slug"],
  { tags: ["blog-posts"] },
);

/** A live post by slug; drafts and scheduled posts count as not found (except in preview). */
export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  if (await isPreview()) return (await getAllPosts()).find((p) => p.slug === slug);
  const post = await getPublishedPostBySlug(slug);
  return post && isLive(post) ? post : undefined;
}

export { categoryToEnum as blogCategoryToEnum, categoryFromEnum as blogCategoryFromEnum };
