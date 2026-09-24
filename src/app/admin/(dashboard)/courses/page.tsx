import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";
import StatusPill from "@/components/admin/ui/StatusPill";
import type { Prisma } from "@/generated/prisma/client";
import { buildWhere, paging, parseListQuery } from "@/lib/admin-list/core";
import { coursesList } from "@/lib/admin-list/sections";
import { formatDhakaDate, listProps, type SearchParams } from "@/lib/admin-list/page";

const categoryLabels: Record<string, string> = {
  IELTS: "IELTS",
  ENGLISH: "English",
  OTHER_LANGUAGES: "Other Languages",
};

export default async function AdminCoursesPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requirePermission("COURSES");
  if (!session) redirect("/admin");

  const query = parseListQuery(coursesList, await searchParams);
  const where = buildWhere(coursesList, query) as Prisma.CourseWhereInput;
  const [courses, total] = await Promise.all([
    prisma.course.findMany({ where, orderBy: { sortOrder: "asc" }, ...paging(coursesList, query) }),
    prisma.course.count({ where }),
  ]);

  const rows = courses.map((c) => ({
    id: c.id,
    cells: [
      c.title,
      c.slug,
      categoryLabels[c.category],
      c.price,
      <StatusPill key="state" state={c.publishStatus === "DRAFT" ? "draft" : "published"} />,
      formatDhakaDate(c.createdAt),
    ],
    editHref: `/admin/courses/${c.id}/edit`,
    deleteEndpoint: `/api/admin/courses/${c.id}`,
    label: c.title,
  }));

  return (
    <AdminTable
      title="Courses"
      newHref="/admin/courses/new"
      newLabel="Add Course"
      rows={rows}
      total={total}
      {...listProps(coursesList, query)}
    />
  );
}
