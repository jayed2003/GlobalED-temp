import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import IeltsContentForm from "@/components/admin/IeltsContentForm";
import { mapIeltsContent } from "@/lib/content/ielts";

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
      <h1 className="font-heading text-2xl font-bold text-primary-900">IELTS Hub Content</h1>
      <p className="mt-1 text-sm text-neutral-500">
        This edits the singleton IELTS content shown across the 5 pages under /ielts.
      </p>
      <div className="mt-6 max-w-3xl">
        <IeltsContentForm defaultValues={content} courses={courses} />
      </div>
    </div>
  );
}
