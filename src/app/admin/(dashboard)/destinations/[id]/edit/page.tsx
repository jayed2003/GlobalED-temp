import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import DestinationForm from "@/components/admin/DestinationForm";

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
      <h1 className="font-heading text-2xl font-bold text-primary-900">Edit {destination.name}</h1>
      <div className="mt-6 max-w-3xl">
        <DestinationForm
          mode="edit"
          destinationId={destination.id}
          defaultValues={{
            slug: destination.slug,
            name: destination.name,
            tagline: destination.tagline,
            heroImage: destination.heroImage,
            flagImage: destination.flagImage,
            overview: destination.overview,
            whyStudyHere: destination.whyStudyHere,
            tuitionRange: destination.tuitionRange,
            livingCost: destination.livingCost,
            scholarships: destination.scholarships,
            visaInfo: destination.visaInfo,
            popularUniversities: destination.universities.map((u) => ({ name: u.name, city: u.city })),
            faqs: destination.faqs.map((f) => ({ q: f.q, a: f.a })),
          }}
        />
      </div>
    </div>
  );
}
