import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";

export default async function SiteSettingsPage() {
  const session = await requirePermission("SETTINGS");
  if (!session) redirect("/admin");

  const values = await prisma.siteSettings.findUnique({ where: { id: "main" }, omit: { id: true, updatedAt: true } });
  if (!values) notFound();

  return (
    <div>
      <AdminPageHeader
        title="Site Settings"
        description="Contact details, social links, key numbers, footer text and the call-to-action banner — used across the whole site."
        viewHref="/"
      />
      <div className="max-w-4xl">
        <SiteSettingsForm defaultValues={values} />
      </div>
    </div>
  );
}
