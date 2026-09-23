import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";
import UnreadName from "@/components/admin/UnreadName";
import type { Prisma } from "@/generated/prisma/client";
import { messageStatusOptions, statusBadgeStyles, statusLabel } from "@/lib/inbox";
import { buildWhere, paging, parseListQuery } from "@/lib/admin-list/core";
import { messagesList } from "@/lib/admin-list/sections";
import { formatDhakaDate, listProps, type SearchParams } from "@/lib/admin-list/page";

export default async function AdminMessagesPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requirePermission("MESSAGES");
  if (!session) redirect("/admin");

  const query = parseListQuery(messagesList, await searchParams);
  const where = buildWhere(messagesList, query) as Prisma.ContactMessageWhereInput;
  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({ where, orderBy: { createdAt: "desc" }, ...paging(messagesList, query) }),
    prisma.contactMessage.count({ where }),
  ]);

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
      formatDhakaDate(m.createdAt),
    ],
    editHref: `/admin/messages/${m.id}`,
    deleteEndpoint: `/api/admin/messages/${m.id}`,
    label: `the message from ${m.name}`,
  }));

  return <AdminTable title="Contact Messages" editLabel="View" rows={rows} total={total} {...listProps(messagesList, query)} />;
}
