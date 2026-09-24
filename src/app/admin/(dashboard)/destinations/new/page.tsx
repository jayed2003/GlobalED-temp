import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/authz";
import DestinationForm from "@/components/admin/DestinationForm";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import { SITE_URL } from "@/lib/site-url";

export default async function NewDestinationPage() {
  const session = await requirePermission("DESTINATIONS");
  if (!session) redirect("/admin");

  return (
    <div>
      <AdminPageHeader
        title="Add Destination"
        breadcrumbs={[{ label: "Destinations", href: "/admin/destinations" }]}
      />
      <div className="max-w-3xl">
        <DestinationForm mode="create" siteUrl={SITE_URL} />
      </div>
    </div>
  );
}
