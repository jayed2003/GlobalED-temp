import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import BlogForm from "@/components/admin/BlogForm";
import { blogCategoryFromEnum } from "@/lib/content/blog";
import { dhakaParts, formatDhakaDateTime, isInFuture } from "@/lib/validation/dates";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("BLOGS");
  if (!session) redirect("/admin");

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  const scheduled = isInFuture(post.publishedAt);
  const publishParts = dhakaParts(post.publishedAt);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-900">Edit {post.title}</h1>
      <div className="mt-6 max-w-2xl">
        <BlogForm
          mode="edit"
          postId={post.id}
          currentPublish={{
            scheduled,
            label: `${scheduled ? "Scheduled for" : "Published"} ${formatDhakaDateTime(post.publishedAt)}`,
          }}
          defaultValues={{
            slug: post.slug,
            title: post.title,
            category: blogCategoryFromEnum[post.category],
            coverImage: post.coverImage,
            coverImageAlt: post.coverImageAlt || post.title,
            excerpt: post.excerpt,
            content: post.content,
            author: post.author,
            publishMode: "keep",
            publishDate: publishParts.date,
            publishTime: publishParts.time,
            featured: post.featured,
          }}
        />
      </div>
    </div>
  );
}
