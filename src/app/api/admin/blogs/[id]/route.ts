import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requirePermission } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { blogSchema } from "@/lib/validation/blog";
import { blogCategoryToEnum } from "@/lib/content/blog";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("BLOGS");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = blogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const data = parsed.data;

  const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) {
    return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
  }

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
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("BLOGS");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });

  revalidateTag("blog-posts", { expire: 0 });
  return NextResponse.json({ ok: true });
}
