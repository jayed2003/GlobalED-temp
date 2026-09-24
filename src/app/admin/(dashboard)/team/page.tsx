import Image from "next/image";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";
import ReorderButton from "@/components/admin/ui/ReorderButton";
import StatusPill from "@/components/admin/ui/StatusPill";
import type { Prisma } from "@/generated/prisma/client";
import { buildWhere, parseListQuery } from "@/lib/admin-list/core";
import { teamList } from "@/lib/admin-list/sections";
import { listProps, type SearchParams } from "@/lib/admin-list/page";
import { isOriginalUpload } from "@/lib/images";

export default async function AdminTeamPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requirePermission("TEAM");
  if (!session) redirect("/admin");

  const query = parseListQuery(teamList, await searchParams);
  const where = buildWhere(teamList, query) as Prisma.TeamMemberWhereInput;
  const order: Prisma.TeamMemberOrderByWithRelationInput[] = [{ group: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }];
  const [people, total, all] = await Promise.all([
    prisma.teamMember.findMany({ where, orderBy: order }),
    prisma.teamMember.count({ where }),
    prisma.teamMember.findMany({ orderBy: order, select: { id: true, name: true, role: true, group: true, shown: true } }),
  ]);

  const rows = people.map((p) => ({
    id: p.id,
    cells: [
      <span key="photo" className="relative block h-12 w-12 overflow-hidden rounded-md bg-neutral-100">
        <Image src={p.photo} alt={p.photoAlt || p.name} fill className="object-cover" sizes="48px" unoptimized={isOriginalUpload(p.photo)} />
      </span>,
      <span key="name" className="font-medium text-primary-900">{p.name}</span>,
      p.role,
      p.group === "BOARD" ? "Board of Directors" : "Team",
      <StatusPill key="shown" state={p.shown ? "published" : "hidden"} label={p.shown ? "Shown" : "Hidden"} />,
    ],
    editHref: `/admin/team/${p.id}/edit`,
    deleteEndpoint: `/api/admin/team/${p.id}`,
    label: p.name,
  }));

  // Each group has its own order on the Our Team page.
  const reorderItems = (group: "BOARD" | "TEAM") =>
    all.filter((p) => p.group === group).map((p) => ({ id: p.id, label: p.name, hint: p.shown ? p.role : `${p.role} · Hidden` }));

  return (
    <AdminTable
      title="Team"
      newHref="/admin/team/new"
      newLabel="Add Person"
      actions={
        <>
          <ReorderButton endpoint="/api/admin/team/reorder" label="Reorder board" title="Reorder the Board of Directors" what="board members" items={reorderItems("BOARD")} />
          <ReorderButton endpoint="/api/admin/team/reorder" label="Reorder team" title="Reorder the team" what="team members" items={reorderItems("TEAM")} />
        </>
      }
      rows={rows}
      total={total}
      {...listProps(teamList, query)}
    />
  );
}
