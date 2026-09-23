import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { adminRoute, ApiError, readJson } from "@/lib/api/admin-route";
import { blogSchema } from "@/lib/validation/blog";
import { blogCategoryToEnum } from "@/lib/content/blog";

type Params = { id: string };

export const PATCH = adminRoute<Params>({ permission: "BLOGS" }, async ({ request, params: { id } }) => {
  const data = await readJson(request, blogSchema);

  const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) throw new ApiError(409, "A post with this slug already exists", "slug");

  await prisma.blogPost.update({
    where: { id },
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
  return NextResponse.json({ ok: true });
});

export const DELETE = adminRoute<Params>({ permission: "BLOGS" }, async ({ params: { id } }) => {
  await prisma.blogPost.delete({ where: { id } });

  revalidateTag("blog-posts", { expire: 0 });
  return NextResponse.json({ ok: true });
});
