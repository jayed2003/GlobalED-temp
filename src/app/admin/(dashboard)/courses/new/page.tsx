import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/authz";
import CourseForm from "@/components/admin/CourseForm";

export default async function NewCoursePage() {
  const session = await requirePermission("COURSES");
  if (!session) redirect("/admin");

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-900">Add Course</h1>
      <div className="mt-6 max-w-2xl">
        <CourseForm mode="create" />
      </div>
    </div>
  );
}
