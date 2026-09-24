import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/authz";
import BlogForm from "@/components/admin/BlogForm";
import { SITE_URL } from "@/lib/site-url";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";

export default async function NewBlogPage() {
  const session = await requirePermission("BLOGS");
  if (!session) redirect("/admin");

  return (
    <div>
      <AdminPageHeader
        title="Add Blog Post"
        breadcrumbs={[{ label: "Blogs", href: "/admin/blogs" }]}
      />
      <div className="max-w-5xl">
        <BlogForm mode="create" siteUrl={SITE_URL} />
      </div>
    </div>
  );
}
