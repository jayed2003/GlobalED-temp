import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/authz";
import CourseForm from "@/components/admin/CourseForm";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";

export default async function NewCoursePage() {
  const session = await requirePermission("COURSES");
  if (!session) redirect("/admin");

  return (
    <div>
      <AdminPageHeader
        title="Add Course"
        breadcrumbs={[{ label: "Courses", href: "/admin/courses" }]}
      />
      <div className="max-w-2xl">
        <CourseForm mode="create" />
      </div>
    </div>
  );
}
