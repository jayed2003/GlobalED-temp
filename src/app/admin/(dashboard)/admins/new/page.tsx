import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/authz";
import AdminUserForm from "@/components/admin/AdminUserForm";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";

export default async function NewAdminPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin");

  return (
    <div>
      <AdminPageHeader
        title="Add Admin"
        breadcrumbs={[{ label: "Manage Admins", href: "/admin/admins" }]}
      />
      <div className="max-w-xl">
        <AdminUserForm mode="create" />
      </div>
    </div>
  );
}
