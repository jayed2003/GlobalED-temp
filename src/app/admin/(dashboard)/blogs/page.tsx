import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";
import type { Prisma } from "@/generated/prisma/client";
import { buildWhere, paging, parseListQuery } from "@/lib/admin-list/core";
import { blogsList } from "@/lib/admin-list/sections";
import { formatDayOnly, listProps, type SearchParams } from "@/lib/admin-list/page";
import { blogCategoryFromEnum } from "@/lib/content/blog";
import { blogCategoryLabels } from "@/lib/labels";

export default async function AdminBlogsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requirePermission("BLOGS");
  if (!session) redirect("/admin");

  const query = parseListQuery(blogsList, await searchParams);
  const where = buildWhere(blogsList, query) as Prisma.BlogPostWhereInput;
  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({ where, orderBy: { publishedAt: "desc" }, ...paging(blogsList, query) }),
    prisma.blogPost.count({ where }),
  ]);

  const rows = posts.map((p) => ({
    id: p.id,
    cells: [p.title, blogCategoryLabels[blogCategoryFromEnum[p.category]], p.author, formatDayOnly(p.publishedAt)],
    editHref: `/admin/blogs/${p.id}/edit`,
    deleteEndpoint: `/api/admin/blogs/${p.id}`,
    label: p.title,
  }));

  return (
    <AdminTable
      title="Blog Posts"
      newHref="/admin/blogs/new"
      newLabel="Add Post"
      rows={rows}
      total={total}
      {...listProps(blogsList, query)}
    />
  );
}
