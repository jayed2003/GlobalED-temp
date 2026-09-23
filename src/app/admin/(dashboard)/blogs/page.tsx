import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";
import type { Prisma } from "@/generated/prisma/client";
import { buildWhere, paging, parseListQuery } from "@/lib/admin-list/core";
import { blogsList } from "@/lib/admin-list/sections";
import { listProps, type SearchParams } from "@/lib/admin-list/page";
import { formatDhakaDateTime, isInFuture } from "@/lib/validation/dates";
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
    cells: [
      p.title,
      blogCategoryLabels[blogCategoryFromEnum[p.category]],
      p.author,
      <span key="published" className="inline-flex flex-wrap items-center gap-2">
        {formatDhakaDateTime(p.publishedAt)}
        {isInFuture(p.publishedAt) && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">Scheduled</span>
        )}
      </span>,
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
      rows={rows}
      total={total}
      {...listProps(blogsList, query)}
    />
  );
}
