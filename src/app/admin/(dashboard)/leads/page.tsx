import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";
import UnreadName from "@/components/admin/UnreadName";
import { leadStatusOptions, statusBadgeStyles, statusLabel } from "@/lib/inbox";

const formTypeLabels: Record<string, string> = { GENERAL: "Consultation", IELTS: "IELTS Booking" };

export default async function AdminLeadsPage() {
  const session = await requirePermission("LEADS");
  if (!session) redirect("/admin");

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { destination: true, course: true },
  });

  const rows = leads.map((l) => ({
    id: l.id,
    unread: !l.readAt,
    cells: [
      <UnreadName key="name" name={l.name} unread={!l.readAt} />,
      l.phone,
      formTypeLabels[l.formType],
      l.destination?.name ?? l.course?.title ?? l.destinationOther ?? "—",
      <span key="status" className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeStyles[l.status]}`}>
        {statusLabel(leadStatusOptions, l.status)}
      </span>,
      l.createdAt.toLocaleDateString("en-GB"),
    ],
    editHref: `/admin/leads/${l.id}`,
    deleteEndpoint: `/api/admin/leads/${l.id}`,
    label: l.name,
  }));

  return (
    <AdminTable
      title="Leads"
      editLabel="View"
      columnHeaders={["Name", "Phone", "Type", "Destination / Course", "Status", "Received"]}
      rows={rows}
    />
  );
}
