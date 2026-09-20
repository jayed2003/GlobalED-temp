import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/authz";
import AdminUserForm from "@/components/admin/AdminUserForm";

export default async function EditAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) redirect("/admin");

  const { id } = await params;
  const admin = await prisma.adminUser.findUnique({ where: { id } });
  if (!admin) notFound();

  // Defense in depth: only the master admin can view/edit their own record.
  if (admin.role === "ADMIN" && session.user.id !== admin.id) {
    redirect("/admin/admins");
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-900">Edit {admin.name}</h1>
      <div className="mt-6 max-w-xl">
        <AdminUserForm
          mode="edit"
          adminId={admin.id}
          isMasterAccount={admin.role === "ADMIN"}
          defaultValues={{
            name: admin.name,
            email: admin.email,
            permissions: admin.permissions,
            password: "",
          }}
        />
      </div>
    </div>
  );
}
