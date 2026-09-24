import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { assertNotDuplicate } from "@/lib/api/duplicates";
import { publishTimestamp, seoFields } from "@/lib/api/publish";
import { blogSchema } from "@/lib/validation/blog";
import { sanitizeBlogHtml } from "@/lib/sanitize-html";
import { htmlToText } from "@/lib/rich-text";
import { blogCategoryToEnum } from "@/lib/content/blog";
import { logActivity } from "@/lib/activity";

export const POST = adminRoute({ permission: "BLOGS" }, async ({ request, session }) => {
  const data = await readJson(request, blogSchema);
  // Only the allowed formatting is ever stored.
  const content = sanitizeBlogHtml(data.content);
  if (!htmlToText(content)) throw new ApiError(400, "Content is required", "content");

  const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
  if (existing) throw new ApiError(409, "A post with this slug already exists", "slug");

  const others = await prisma.blogPost.findMany({ select: { id: true, title: true } });
  assertNotDuplicate(
    others.map((r) => ({ id: r.id, value: r.title })),
    data.title,
    { message: `A post titled "${data.title.trim()}" already exists`, field: "title" },
  );

  const created = await prisma.blogPost.create({
    data: {
      slug: data.slug,
      title: data.title,
      category: blogCategoryToEnum[data.category],
      coverImage: data.coverImage,
      coverImageAlt: data.coverImageAlt,
      excerpt: data.excerpt,
      content,
      author: data.author,
      publishedAt: publishTimestamp(data),
      featured: data.featured,
      ...seoFields(data),
    },
  });

  revalidateTag("blog-posts", { expire: 0 });
  await logActivity(session, { action: "CREATED", entityType: "blog", entityId: created.id, label: created.title });
  return NextResponse.json({ id: created.id }, { status: 201 });
});
