import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import type { BlogPost, BlogCategory } from "@/types";
import type { BlogPost as BlogPostRow, BlogCategory as BlogCategoryEnum } from "@prisma/client";

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
    excerpt: p.excerpt,
    content: p.content,
    author: p.author,
    publishedAt: p.publishedAt.toISOString().split("T")[0],
    featured: p.featured,
  };
}

export const getAllPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const rows = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
    return rows.map(mapPost);
  },
  ["blog-posts-all"],
  { tags: ["blog-posts"] },
);

export const getPostSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const rows = await prisma.blogPost.findMany({ select: { slug: true } });
    return rows.map((r) => r.slug);
  },
  ["blog-posts-slugs"],
  { tags: ["blog-posts"] },
);

export const getPostBySlug = unstable_cache(
  async (slug: string): Promise<BlogPost | undefined> => {
    const row = await prisma.blogPost.findUnique({ where: { slug } });
    return row ? mapPost(row) : undefined;
  },
  ["blog-post-by-slug"],
  { tags: ["blog-posts"] },
);

export { categoryToEnum as blogCategoryToEnum, categoryFromEnum as blogCategoryFromEnum };
