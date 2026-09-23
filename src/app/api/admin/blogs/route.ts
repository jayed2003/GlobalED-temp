import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requirePermission } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { blogSchema } from "@/lib/validation/blog";
import { blogCategoryToEnum } from "@/lib/content/blog";

export async function POST(request: Request) {
  const session = await requirePermission("BLOGS");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = blogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const data = parsed.data;

  const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
  }

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
}
