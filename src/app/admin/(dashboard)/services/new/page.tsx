import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/authz";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import ServiceForm from "@/components/admin/ServiceForm";
import { SITE_URL } from "@/lib/site-url";

export default async function NewServicePage() {
  const session = await requirePermission("SERVICES");
  if (!session) redirect("/admin");
  return (
    <div>
      <AdminPageHeader title="Add Service" breadcrumbs={[{ label: "Services", href: "/admin/services" }]} />
      <div className="max-w-4xl">
        <ServiceForm mode="create" siteUrl={SITE_URL} />
      </div>
    </div>
  );
}
