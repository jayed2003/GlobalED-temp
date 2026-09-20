import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/authz";
import AdminUserForm from "@/components/admin/AdminUserForm";

export default async function NewAdminPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin");

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-900">Add Admin</h1>
      <div className="mt-6 max-w-xl">
        <AdminUserForm mode="create" />
      </div>
    </div>
  );
}
