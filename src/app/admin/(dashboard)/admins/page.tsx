import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";
import { adminPermissionLabels } from "@/lib/validation/admin-user";

export default async function AdminAdminsPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin");

  const admins = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });

  const rows = admins.map((a) => ({
    id: a.id,
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
      columnHeaders={["Name", "Email", "Role", "Permissions"]}
      rows={rows}
    />
  );
}
