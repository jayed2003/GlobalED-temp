import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import EventForm from "@/components/admin/EventForm";
import { eventStatusFromEnum } from "@/lib/content/events";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("EVENTS");
  if (!session) redirect("/admin");

  const { id } = await params;
  const event = await prisma.eventItem.findUnique({ where: { id } });
  if (!event) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-900">Edit {event.title}</h1>
      <div className="mt-6 max-w-2xl">
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
            description: event.description,
            gallery: event.gallery,
          }}
        />
      </div>
    </div>
  );
}
