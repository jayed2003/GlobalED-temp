import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";

export default async function AdminDestinationsPage() {
  const session = await requirePermission("DESTINATIONS");
  if (!session) redirect("/admin");

  const destinations = await prisma.destination.findMany({ orderBy: { sortOrder: "asc" } });

  const rows = destinations.map((d) => ({
    id: d.id,
    cells: [d.name, d.slug, <span key="tagline" className="line-clamp-1 block max-w-xs text-neutral-500">{d.tagline}</span>],
    editHref: `/admin/destinations/${d.id}/edit`,
    deleteEndpoint: `/api/admin/destinations/${d.id}`,
    label: d.name,
  }));

  return (
    <AdminTable
      title="Destinations"
      newHref="/admin/destinations/new"
      newLabel="Add Destination"
      columnHeaders={["Name", "Slug", "Tagline"]}
      rows={rows}
    />
  );
}
