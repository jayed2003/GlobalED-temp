import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";
import UnreadName from "@/components/admin/UnreadName";
import type { Prisma } from "@/generated/prisma/client";
import { leadStatusOptions, statusBadgeStyles, statusLabel } from "@/lib/inbox";
import { buildWhere, paging, parseListQuery } from "@/lib/admin-list/core";
import { leadsList } from "@/lib/admin-list/sections";
import { formatDhakaDate, listProps, type SearchParams } from "@/lib/admin-list/page";

/** Branch filter: today's branches, plus older names still on existing leads. */
async function leadBranchOptions() {
  const [current, used] = await Promise.all([
    prisma.branch.findMany({ select: { name: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    prisma.lead.findMany({ distinct: ["branch"], select: { branch: true }, orderBy: { branch: "asc" } }),
  ]);
  const names = [...new Set([...current.map((b) => b.name), ...used.map((l) => l.branch)])].filter(Boolean);
  return names.map((name) => ({ value: name, label: name }));
}

const formTypeLabels: Record<string, string> = { GENERAL: "Consultation", IELTS: "IELTS Booking" };

export default async function AdminLeadsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requirePermission("LEADS");
  if (!session) redirect("/admin");

  const query = parseListQuery(leadsList, await searchParams);
  const where = buildWhere(leadsList, query) as Prisma.LeadWhereInput;
  const [leads, total, branchOptions] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { destination: true, course: true },
      ...paging(leadsList, query),
    }),
    prisma.lead.count({ where }),
    leadBranchOptions(),
  ]);

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
      formatDhakaDate(l.createdAt),
    ],
    editHref: `/admin/leads/${l.id}`,
    deleteEndpoint: `/api/admin/leads/${l.id}`,
    label: l.name,
  }));

  return (
    <AdminTable
      title="Leads"
      editLabel="View"
      rows={rows}
      total={total}
      exportHref="/api/admin/leads/export"
      {...listProps(leadsList, query, { branch: branchOptions })}
    />
  );
}
