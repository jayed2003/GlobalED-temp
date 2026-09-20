import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/authz";
import DestinationForm from "@/components/admin/DestinationForm";

export default async function NewDestinationPage() {
  const session = await requirePermission("DESTINATIONS");
  if (!session) redirect("/admin");

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-900">Add Destination</h1>
      <div className="mt-6 max-w-3xl">
        <DestinationForm mode="create" />
      </div>
    </div>
  );
}
