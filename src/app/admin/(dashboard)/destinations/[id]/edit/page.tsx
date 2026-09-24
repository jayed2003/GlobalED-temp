import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import DestinationForm from "@/components/admin/DestinationForm";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import PreviewLink from "@/components/admin/ui/PreviewLink";
import { SITE_URL } from "@/lib/site-url";

export default async function EditDestinationPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("DESTINATIONS");
  if (!session) redirect("/admin");

  const { id } = await params;
  const destination = await prisma.destination.findUnique({
    where: { id },
    include: {
      universities: { orderBy: { sortOrder: "asc" } },
      faqs: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!destination) notFound();

  return (
    <div>
      <AdminPageHeader
        title={destination.name}
        breadcrumbs={[{ label: "Destinations", href: "/admin/destinations" }]}
        status={destination.publishStatus === "DRAFT" ? "draft" : "published"}
        viewHref={destination.publishStatus === "DRAFT" ? undefined : `/destinations/${destination.slug}`}
        actions={destination.publishStatus === "DRAFT" ? <PreviewLink path={`/destinations/${destination.slug}`} /> : undefined}
      />
      <div className="max-w-3xl">
        <DestinationForm
          mode="edit"
          destinationId={destination.id}
          siteUrl={SITE_URL}
          defaultValues={{
            slug: destination.slug,
            name: destination.name,
            tagline: destination.tagline,
            heroImage: destination.heroImage,
            heroImageAlt: destination.heroImageAlt || `Study in ${destination.name}`,
            flagImage: destination.flagImage,
            flagImageAlt: destination.flagImageAlt,
            overview: destination.overview,
            whyStudyHere: destination.whyStudyHere,
            tuitionRange: destination.tuitionRange,
            livingCost: destination.livingCost,
            scholarships: destination.scholarships,
            visaInfo: destination.visaInfo,
            popularUniversities: destination.universities.map((u) => ({ name: u.name, city: u.city })),
            faqs: destination.faqs.map((f) => ({ q: f.q, a: f.a })),
            publishStatus: destination.publishStatus,
            seoTitle: destination.seoTitle,
            metaDescription: destination.metaDescription,
            ogImage: destination.ogImage,
            ogImageAlt: destination.ogImageAlt,
          }}
        />
      </div>
    </div>
  );
}
