import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import BranchForm from "@/components/admin/BranchForm";

export default async function EditBranchPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("SETTINGS");
  if (!session) redirect("/admin");

  const { id } = await params;
  const branch = await prisma.branch.findUnique({ where: { id } });
  if (!branch) notFound();

  return (
    <div>
      <AdminPageHeader
        title={branch.name}
        breadcrumbs={[{ label: "Branches", href: "/admin/branches" }]}
        status={branch.shown ? "published" : "hidden"}
        viewHref="/contact"
      />
      <div className="max-w-3xl">
        <BranchForm
          mode="edit"
          branchId={branch.id}
          defaultValues={{
            name: branch.name,
            address: branch.address,
            phones: branch.phones,
            email: branch.email,
            hours: branch.hours,
            mapEmbedUrl: branch.mapEmbedUrl,
            shown: branch.shown,
          }}
        />
      </div>
    </div>
  );
}
