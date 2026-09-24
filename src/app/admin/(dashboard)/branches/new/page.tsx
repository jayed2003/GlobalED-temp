import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/authz";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import BranchForm from "@/components/admin/BranchForm";

export default async function NewBranchPage() {
  const session = await requirePermission("SETTINGS");
  if (!session) redirect("/admin");

  return (
    <div>
      <AdminPageHeader title="Add Branch" breadcrumbs={[{ label: "Branches", href: "/admin/branches" }]} />
      <div className="max-w-3xl">
        <BranchForm mode="create" />
      </div>
    </div>
  );
}
