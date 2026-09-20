import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";

const statusLabels: Record<string, string> = { UPCOMING: "Upcoming", PREVIOUS: "Previous" };

export default async function AdminEventsPage() {
  const session = await requirePermission("EVENTS");
  if (!session) redirect("/admin");

  const events = await prisma.eventItem.findMany({ orderBy: { date: "desc" } });

  const rows = events.map((e) => ({
    id: e.id,
    cells: [
      e.title,
      statusLabels[e.status],
      e.date.toLocaleDateString("en-GB"),
      <span key="venue" className="line-clamp-1 block max-w-xs text-neutral-500">{e.venue}</span>,
    ],
    editHref: `/admin/events/${e.id}/edit`,
    deleteEndpoint: `/api/admin/events/${e.id}`,
    label: e.title,
  }));

  return (
    <AdminTable
      title="Events"
      newHref="/admin/events/new"
      newLabel="Add Event"
      columnHeaders={["Title", "Status", "Date", "Venue"]}
      rows={rows}
    />
  );
}
