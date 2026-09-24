import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import CourseForm from "@/components/admin/CourseForm";
import { courseCategoryFromEnum } from "@/lib/content/courses";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import PreviewLink from "@/components/admin/ui/PreviewLink";
import { SITE_URL } from "@/lib/site-url";

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
        status={course.publishStatus === "DRAFT" ? "draft" : "published"}
        viewHref={course.publishStatus === "DRAFT" ? undefined : `/courses/${course.slug}`}
        actions={course.publishStatus === "DRAFT" ? <PreviewLink path={`/courses/${course.slug}`} /> : undefined}
      />
      <div className="max-w-3xl">
        <CourseForm
          mode="edit"
          courseId={course.id}
          siteUrl={SITE_URL}
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
            publishStatus: course.publishStatus,
            seoTitle: course.seoTitle,
            metaDescription: course.metaDescription,
            ogImage: course.ogImage,
            ogImageAlt: course.ogImageAlt,
          }}
        />
      </div>
    </div>
  );
}
