import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import PreviewLink from "@/components/admin/ui/PreviewLink";
import ServiceForm from "@/components/admin/ServiceForm";
import type { ServiceFormValues } from "@/lib/validation/service";
import { SITE_URL } from "@/lib/site-url";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("SERVICES");
  if (!session) redirect("/admin");

  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();
  const draft = service.status === "DRAFT";

  return (
    <div>
      <AdminPageHeader
        title={service.title}
        breadcrumbs={[{ label: "Services", href: "/admin/services" }]}
        status={draft ? "draft" : "published"}
        viewHref={draft ? undefined : `/services/${service.slug}`}
        actions={draft ? <PreviewLink path={`/services/${service.slug}`} /> : undefined}
      />
      <div className="max-w-4xl">
        <ServiceForm
          mode="edit"
          serviceId={service.id}
          siteUrl={SITE_URL}
          defaultValues={{
            slug: service.slug,
            title: service.title,
            icon: service.icon,
            shortDescription: service.shortDescription,
            description: service.description,
            benefits: service.benefits,
            process: service.process as ServiceFormValues["process"],
            status: service.status,
            seoTitle: service.seoTitle,
            metaDescription: service.metaDescription,
            ogImage: service.ogImage,
            ogImageAlt: service.ogImageAlt,
          }}
        />
      </div>
    </div>
  );
}
