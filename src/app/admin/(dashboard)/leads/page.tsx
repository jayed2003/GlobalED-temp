import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";

const statusLabels: Record<string, string> = { NEW: "New", CONTACTED: "Contacted", CLOSED: "Closed" };
const statusStyles: Record<string, string> = {
  NEW: "bg-amber-50 text-amber-700",
  CONTACTED: "bg-blue-50 text-blue-700",
  CLOSED: "bg-neutral-100 text-neutral-500",
};
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
    cells: [
      l.name,
      l.phone,
      formTypeLabels[l.formType],
      l.destination?.name ?? l.course?.title ?? l.destinationOther ?? "—",
      <span key="status" className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[l.status]}`}>
        {statusLabels[l.status]}
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
