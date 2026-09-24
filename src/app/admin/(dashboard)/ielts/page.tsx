import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import IeltsContentForm from "@/components/admin/IeltsContentForm";
import { mapIeltsContent } from "@/lib/content/ielts";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";

export default async function AdminIeltsPage() {
  const session = await requirePermission("IELTS");
  if (!session) redirect("/admin");

  const [row, courses] = await Promise.all([
    prisma.ieltsContent.findUniqueOrThrow({
      where: { id: "main" },
      include: { preparationCourses: { orderBy: { sortOrder: "asc" }, include: { course: true } } },
    }),
    prisma.course.findMany({ orderBy: { sortOrder: "asc" }, select: { slug: true, title: true } }),
  ]);

  const courseSlugs = row.preparationCourses.map((pc) => pc.course.slug);
  const content = mapIeltsContent(row, courseSlugs);

  return (
    <div>
      <AdminPageHeader
        title="IELTS Content"
        description="The text shown across the IELTS pages: What is IELTS, Why IELTS, IELTS with GlobalEd and Preparation."
        viewHref="/ielts"
      />
      <div className="max-w-3xl">
        <IeltsContentForm defaultValues={content} courses={courses} />
      </div>
    </div>
  );
}
