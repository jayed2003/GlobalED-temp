import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/authz";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import TeamMemberForm from "@/components/admin/TeamMemberForm";

export default async function NewTeamMemberPage() {
  const session = await requirePermission("TEAM");
  if (!session) redirect("/admin");
  return (
    <div>
      <AdminPageHeader title="Add Person" breadcrumbs={[{ label: "Team", href: "/admin/team" }]} />
      <div className="max-w-3xl">
        <TeamMemberForm mode="create" />
      </div>
    </div>
  );
}
