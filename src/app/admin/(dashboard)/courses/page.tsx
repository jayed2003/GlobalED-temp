import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";

const categoryLabels: Record<string, string> = {
  IELTS: "IELTS",
  ENGLISH: "English",
  OTHER_LANGUAGES: "Other Languages",
};

export default async function AdminCoursesPage() {
  const session = await requirePermission("COURSES");
  if (!session) redirect("/admin");

  const courses = await prisma.course.findMany({ orderBy: { sortOrder: "asc" } });

  const rows = courses.map((c) => ({
    id: c.id,
    cells: [c.title, c.slug, categoryLabels[c.category], c.price],
    editHref: `/admin/courses/${c.id}/edit`,
    deleteEndpoint: `/api/admin/courses/${c.id}`,
    label: c.title,
  }));

  return (
    <AdminTable
      title="Courses"
      newHref="/admin/courses/new"
      newLabel="Add Course"
      columnHeaders={["Title", "Slug", "Category", "Fee"]}
      rows={rows}
    />
  );
}
