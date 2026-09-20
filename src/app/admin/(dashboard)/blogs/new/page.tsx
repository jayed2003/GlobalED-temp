import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/authz";
import BlogForm from "@/components/admin/BlogForm";

export default async function NewBlogPage() {
  const session = await requirePermission("BLOGS");
  if (!session) redirect("/admin");

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-900">Add Blog Post</h1>
      <div className="mt-6 max-w-2xl">
        <BlogForm mode="create" />
      </div>
    </div>
  );
}
