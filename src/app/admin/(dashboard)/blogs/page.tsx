import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";
import { blogCategoryFromEnum } from "@/lib/content/blog";
import { blogCategoryLabels } from "@/lib/labels";

export default async function AdminBlogsPage() {
  const session = await requirePermission("BLOGS");
  if (!session) redirect("/admin");

  const posts = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });

  const rows = posts.map((p) => ({
    id: p.id,
    cells: [
      p.title,
      blogCategoryLabels[blogCategoryFromEnum[p.category]],
      p.author,
      p.publishedAt.toLocaleDateString("en-GB"),
    ],
    editHref: `/admin/blogs/${p.id}/edit`,
    deleteEndpoint: `/api/admin/blogs/${p.id}`,
    label: p.title,
  }));

  return (
    <AdminTable
      title="Blog Posts"
      newHref="/admin/blogs/new"
      newLabel="Add Post"
      columnHeaders={["Title", "Category", "Author", "Published"]}
      rows={rows}
    />
  );
}
