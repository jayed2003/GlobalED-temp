import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { blogSchema } from "@/lib/validation/blog";
import { blogCategoryToEnum } from "@/lib/content/blog";

export const POST = adminRoute({ permission: "BLOGS" }, async ({ request }) => {
  const data = await readJson(request, blogSchema);

  const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
  if (existing) throw new ApiError(409, "A post with this slug already exists", "slug");

  const created = await prisma.blogPost.create({
    data: {
      slug: data.slug,
      title: data.title,
      category: blogCategoryToEnum[data.category],
      coverImage: data.coverImage,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author,
      publishedAt: new Date(data.publishedAt),
      featured: data.featured,
    },
  });

  revalidateTag("blog-posts", { expire: 0 });
  return NextResponse.json({ id: created.id }, { status: 201 });
});
