import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/authz";
import EventForm from "@/components/admin/EventForm";

export default async function NewEventPage() {
  const session = await requirePermission("EVENTS");
  if (!session) redirect("/admin");

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-900">Add Event</h1>
      <div className="mt-6 max-w-2xl">
        <EventForm mode="create" />
      </div>
    </div>
  );
}
