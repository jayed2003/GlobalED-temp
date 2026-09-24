import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import CourseForm from "@/components/admin/CourseForm";
import { courseCategoryFromEnum } from "@/lib/content/courses";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("COURSES");
  if (!session) redirect("/admin");

  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) notFound();

  return (
    <div>
      <AdminPageHeader
        title={course.title}
        breadcrumbs={[{ label: "Courses", href: "/admin/courses" }]}
        viewHref={`/courses/${course.slug}`}
      />
      <div className="max-w-2xl">
        <CourseForm
          mode="edit"
          courseId={course.id}
          defaultValues={{
            slug: course.slug,
            title: course.title,
            category: courseCategoryFromEnum[course.category],
            image: course.image,
            imageAlt: course.imageAlt || course.title,
            overview: course.overview,
            curriculum: course.curriculum,
            duration: course.duration,
            schedule: course.schedule,
            price: course.price,
            badge: course.badge ?? "",
          }}
        />
      </div>
    </div>
  );
}
