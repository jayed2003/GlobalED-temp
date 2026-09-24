import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/authz";
import EventForm from "@/components/admin/EventForm";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import { SITE_URL } from "@/lib/site-url";

export default async function NewEventPage() {
  const session = await requirePermission("EVENTS");
  if (!session) redirect("/admin");

  return (
    <div>
      <AdminPageHeader
        title="Add Event"
        breadcrumbs={[{ label: "Events", href: "/admin/events" }]}
      />
      <div className="max-w-3xl">
        <EventForm mode="create" siteUrl={SITE_URL} />
      </div>
    </div>
  );
}
