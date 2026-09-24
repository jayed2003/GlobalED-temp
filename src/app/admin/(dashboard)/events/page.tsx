import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";
import StatusPill from "@/components/admin/ui/StatusPill";
import type { Prisma } from "@/generated/prisma/client";
import { buildWhere, paging, parseListQuery } from "@/lib/admin-list/core";
import { eventsList } from "@/lib/admin-list/sections";
import { formatDayOnly, listProps, type SearchParams } from "@/lib/admin-list/page";

const statusLabels: Record<string, string> = { UPCOMING: "Upcoming", PREVIOUS: "Previous" };

export default async function AdminEventsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requirePermission("EVENTS");
  if (!session) redirect("/admin");

  const query = parseListQuery(eventsList, await searchParams);
  const where = buildWhere(eventsList, query) as Prisma.EventItemWhereInput;
  const [events, total] = await Promise.all([
    prisma.eventItem.findMany({ where, orderBy: { date: "desc" }, ...paging(eventsList, query) }),
    prisma.eventItem.count({ where }),
  ]);

  const rows = events.map((e) => ({
    id: e.id,
    cells: [
      e.title,
      statusLabels[e.status],
      formatDayOnly(e.date),
      <span key="venue" className="line-clamp-1 block max-w-xs text-neutral-500">{e.venue}</span>,
      <StatusPill key="state" state={e.publishStatus === "DRAFT" ? "draft" : "published"} />,
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
      rows={rows}
      total={total}
      {...listProps(eventsList, query)}
    />
  );
}
