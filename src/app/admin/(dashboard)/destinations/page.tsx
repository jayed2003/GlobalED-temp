import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";
import StatusPill from "@/components/admin/ui/StatusPill";
import type { Prisma } from "@/generated/prisma/client";
import { buildWhere, paging, parseListQuery } from "@/lib/admin-list/core";
import { destinationsList } from "@/lib/admin-list/sections";
import { formatDhakaDate, listProps, type SearchParams } from "@/lib/admin-list/page";

export default async function AdminDestinationsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requirePermission("DESTINATIONS");
  if (!session) redirect("/admin");

  const query = parseListQuery(destinationsList, await searchParams);
  const where = buildWhere(destinationsList, query) as Prisma.DestinationWhereInput;
  const [destinations, total] = await Promise.all([
    prisma.destination.findMany({ where, orderBy: { sortOrder: "asc" }, ...paging(destinationsList, query) }),
    prisma.destination.count({ where }),
  ]);

  const rows = destinations.map((d) => ({
    id: d.id,
    cells: [
      d.name,
      d.slug,
      <span key="tagline" className="line-clamp-1 block max-w-xs text-neutral-500">{d.tagline}</span>,
      <StatusPill key="state" state={d.publishStatus === "DRAFT" ? "draft" : "published"} />,
      formatDhakaDate(d.createdAt),
    ],
    editHref: `/admin/destinations/${d.id}/edit`,
    deleteEndpoint: `/api/admin/destinations/${d.id}`,
    label: d.name,
  }));

  return (
    <AdminTable
      title="Destinations"
      newHref="/admin/destinations/new"
      newLabel="Add Destination"
      rows={rows}
      total={total}
      {...listProps(destinationsList, query)}
    />
  );
}
