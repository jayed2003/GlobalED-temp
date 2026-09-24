import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import TeamMemberForm from "@/components/admin/TeamMemberForm";

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("TEAM");
  if (!session) redirect("/admin");

  const { id } = await params;
  const person = await prisma.teamMember.findUnique({ where: { id } });
  if (!person) notFound();

  return (
    <div>
      <AdminPageHeader
        title={person.name}
        breadcrumbs={[{ label: "Team", href: "/admin/team" }]}
        status={person.shown ? "published" : "hidden"}
        viewHref={person.shown ? "/about/our-team" : undefined}
      />
      <div className="max-w-3xl">
        <TeamMemberForm
          mode="edit"
          memberId={person.id}
          defaultValues={{
            name: person.name,
            role: person.role,
            photo: person.photo,
            photoAlt: person.photoAlt,
            bio: person.bio,
            group: person.group,
            shown: person.shown,
          }}
        />
      </div>
    </div>
  );
}
