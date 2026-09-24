import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/authz";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import FaqForm from "@/components/admin/FaqForm";

export default async function NewFaqPage() {
  const session = await requirePermission("FAQS");
  if (!session) redirect("/admin");
  return (
    <div>
      <AdminPageHeader title="Add Question" breadcrumbs={[{ label: "FAQs", href: "/admin/faqs" }]} />
      <div className="max-w-3xl">
        <FaqForm mode="create" />
      </div>
    </div>
  );
}
