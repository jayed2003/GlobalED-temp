import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import BlogForm from "@/components/admin/BlogForm";
import { blogCategoryFromEnum } from "@/lib/content/blog";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("BLOGS");
  if (!session) redirect("/admin");

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-900">Edit {post.title}</h1>
      <div className="mt-6 max-w-2xl">
        <BlogForm
          mode="edit"
          postId={post.id}
          defaultValues={{
            slug: post.slug,
            title: post.title,
            category: blogCategoryFromEnum[post.category],
            coverImage: post.coverImage,
            excerpt: post.excerpt,
            content: post.content,
            author: post.author,
            publishedAt: post.publishedAt.toISOString().split("T")[0],
            featured: post.featured,
          }}
        />
      </div>
    </div>
  );
}
