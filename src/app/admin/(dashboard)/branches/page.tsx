import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";
import ReorderButton from "@/components/admin/ui/ReorderButton";
import StatusPill from "@/components/admin/ui/StatusPill";
import type { Prisma } from "@/generated/prisma/client";
import { buildWhere, parseListQuery } from "@/lib/admin-list/core";
import { branchesList } from "@/lib/admin-list/sections";
import { listProps, type SearchParams } from "@/lib/admin-list/page";

export default async function AdminBranchesPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requirePermission("SETTINGS");
  if (!session) redirect("/admin");

  const query = parseListQuery(branchesList, await searchParams);
  const where = buildWhere(branchesList, query) as Prisma.BranchWhereInput;
  const order: Prisma.BranchOrderByWithRelationInput[] = [{ sortOrder: "asc" }, { createdAt: "asc" }];
  const [branches, total, all] = await Promise.all([
    prisma.branch.findMany({ where, orderBy: order }),
    prisma.branch.count({ where }),
    prisma.branch.findMany({ orderBy: order, select: { id: true, name: true, shown: true } }),
  ]);

  const rows = branches.map((b) => ({
    id: b.id,
    cells: [
      <span key="name" className="font-medium text-primary-900">{b.name}</span>,
      <span key="address" className="line-clamp-2 block max-w-xs text-neutral-500">{b.address}</span>,
      b.phones.join(", "),
      <StatusPill key="shown" state={b.shown ? "published" : "hidden"} label={b.shown ? "Shown" : "Hidden"} />,
    ],
    editHref: `/admin/branches/${b.id}/edit`,
    deleteEndpoint: `/api/admin/branches/${b.id}`,
    label: b.name,
  }));

  return (
    <AdminTable
      title="Branches"
      newHref="/admin/branches/new"
      newLabel="Add Branch"
      actions={
        <ReorderButton
          endpoint="/api/admin/branches/reorder"
          title="Reorder branches"
          what="branches"
          items={all.map((b) => ({ id: b.id, label: b.name, hint: b.shown ? undefined : "Hidden" }))}
        />
      }
      rows={rows}
      total={total}
      {...listProps(branchesList, query)}
    />
  );
}
