import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";
import UnreadName from "@/components/admin/UnreadName";
import { messageStatusOptions, statusBadgeStyles, statusLabel } from "@/lib/inbox";

export default async function AdminMessagesPage() {
  const session = await requirePermission("MESSAGES");
  if (!session) redirect("/admin");

  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  const rows = messages.map((m) => ({
    id: m.id,
    unread: !m.readAt,
    cells: [
      <UnreadName key="name" name={m.name} unread={!m.readAt} />,
      m.email,
      m.subject.length > 60 ? `${m.subject.slice(0, 57)}…` : m.subject,
      <span key="status" className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeStyles[m.status]}`}>
        {statusLabel(messageStatusOptions, m.status)}
      </span>,
      m.createdAt.toLocaleDateString("en-GB"),
    ],
    editHref: `/admin/messages/${m.id}`,
    deleteEndpoint: `/api/admin/messages/${m.id}`,
    label: `the message from ${m.name}`,
  }));

  return (
    <AdminTable
      title="Contact Messages"
      editLabel="View"
      columnHeaders={["Name", "Email", "Subject", "Status", "Received"]}
      rows={rows}
    />
  );
}
