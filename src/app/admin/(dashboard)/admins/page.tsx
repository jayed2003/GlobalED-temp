import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";
import type { Prisma } from "@/generated/prisma/client";
import { buildWhere, paging, parseListQuery } from "@/lib/admin-list/core";
import { adminsList } from "@/lib/admin-list/sections";
import { formatDhakaDate, listProps, type SearchParams } from "@/lib/admin-list/page";
import { adminPermissionLabels } from "@/lib/validation/admin-user";

export default async function AdminAdminsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requireAdmin();
  if (!session) redirect("/admin");

  const query = parseListQuery(adminsList, await searchParams);
  const where = buildWhere(adminsList, query) as Prisma.AdminUserWhereInput;
  const [admins, total] = await Promise.all([
    prisma.adminUser.findMany({ where, orderBy: { createdAt: "asc" }, ...paging(adminsList, query) }),
    prisma.adminUser.count({ where }),
  ]);

  const rows = admins.map((a) => ({
    id: a.id,
    // The master admin and your own account can't be deleted.
    selectable: a.role !== "ADMIN" && a.id !== session.user.id,
    cells: [
      a.name,
      a.email,
      <span
        key="role"
        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
          a.role === "ADMIN" ? "bg-primary-50 text-primary-700" : "bg-neutral-100 text-neutral-600"
        }`}
      >
        {a.role === "ADMIN" ? "Master Admin" : "Editor"}
      </span>,
      a.role === "ADMIN" ? (
        "All"
      ) : a.permissions.length > 0 ? (
        <span key="permissions" className="text-neutral-500">{a.permissions.map((p) => adminPermissionLabels[p]).join(", ")}</span>
      ) : (
        <span key="permissions" className="text-neutral-400">None</span>
      ),
      formatDhakaDate(a.createdAt),
    ],
    editHref: `/admin/admins/${a.id}/edit`,
    deleteEndpoint: `/api/admin/admins/${a.id}`,
    label: a.name,
  }));

  return (
    <AdminTable
      title="Manage Admins"
      newHref="/admin/admins/new"
      newLabel="Add Admin"
      rows={rows}
      total={total}
      {...listProps(adminsList, query)}
    />
  );
}
