import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import BlogForm from "@/components/admin/BlogForm";
import { SITE_URL } from "@/lib/site-url";
import { blogCategoryFromEnum } from "@/lib/content/blog";
import { dhakaParts, formatDhakaDateTime, isInFuture } from "@/lib/validation/dates";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";

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
      <AdminPageHeader
        title={post.title}
        breadcrumbs={[{ label: "Blogs", href: "/admin/blogs" }]}
        status={scheduled ? "scheduled" : "published"}
        viewHref={scheduled ? undefined : `/blogs/${post.slug}`}
      />
      <div className="max-w-5xl">
        <BlogForm
          mode="edit"
          postId={post.id}
          siteUrl={SITE_URL}
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
            focusKeyword: post.focusKeyword,
            seoTitle: post.seoTitle,
            metaDescription: post.metaDescription,
            ogImage: post.ogImage,
            ogImageAlt: post.ogImageAlt,
          }}
        />
      </div>
    </div>
  );
}
