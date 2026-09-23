import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import type { BlogPost, BlogCategory } from "@/types";
import type { BlogPost as BlogPostRow, BlogCategory as BlogCategoryEnum } from "@/generated/prisma/client";
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
  };
}

/**
 * Scheduled posts are stored like any other but stay hidden until their
 * publish time. The check runs on every request (after the cache), so a post
 * appears the minute it's due — no cache refresh needed.
 */
function isLive(post: BlogPost): boolean {
  return Date.parse(post.publishedAtIso ?? post.publishedAt) <= Date.now();
}

const getAllPostsIncludingScheduled = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const rows = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
    return rows.map(mapPost);
  },
  ["blog-posts-all"],
  { tags: ["blog-posts"] },
);

/** Published posts, newest first. */
export async function getAllPosts(): Promise<BlogPost[]> {
  return (await getAllPostsIncludingScheduled()).filter(isLive);
}

export const getPostSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const rows = await prisma.blogPost.findMany({ select: { slug: true } });
    return rows.map((r) => r.slug);
  },
  ["blog-posts-slugs"],
  { tags: ["blog-posts"] },
);

const getPostBySlugIncludingScheduled = unstable_cache(
  async (slug: string): Promise<BlogPost | undefined> => {
    const row = await prisma.blogPost.findUnique({ where: { slug } });
    return row ? mapPost(row) : undefined;
  },
  ["blog-post-by-slug"],
  { tags: ["blog-posts"] },
);

/** A published post by slug; scheduled (not yet live) posts count as not found. */
export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const post = await getPostBySlugIncludingScheduled(slug);
  return post && isLive(post) ? post : undefined;
}

export { categoryToEnum as blogCategoryToEnum, categoryFromEnum as blogCategoryFromEnum };
