import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import EventForm from "@/components/admin/EventForm";
import { eventStatusFromEnum } from "@/lib/content/events";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("EVENTS");
  if (!session) redirect("/admin");

  const { id } = await params;
  const event = await prisma.eventItem.findUnique({ where: { id } });
  if (!event) notFound();

  return (
    <div>
      <AdminPageHeader
        title={event.title}
        breadcrumbs={[{ label: "Events", href: "/admin/events" }]}
        viewHref={`/events/${event.slug}`}
      />
      <div className="max-w-2xl">
        <EventForm
          mode="edit"
          eventId={event.id}
          defaultValues={{
            slug: event.slug,
            title: event.title,
            status: eventStatusFromEnum[event.status],
            date: event.date.toISOString().split("T")[0],
            time: event.time,
            venue: event.venue,
            bannerImage: event.bannerImage,
            bannerImageAlt: event.bannerImageAlt || event.title,
            description: event.description,
            gallery: event.gallery,
            galleryAlts: event.gallery.map((_, i) => event.galleryAlts[i] || `${event.title} — photo ${i + 1}`),
          }}
        />
      </div>
    </div>
  );
}
