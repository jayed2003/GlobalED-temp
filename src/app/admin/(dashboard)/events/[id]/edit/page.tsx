import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import EventForm from "@/components/admin/EventForm";
import { eventStatusFromEnum } from "@/lib/content/events";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import PreviewLink from "@/components/admin/ui/PreviewLink";
import { SITE_URL } from "@/lib/site-url";

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
        status={event.publishStatus === "DRAFT" ? "draft" : "published"}
        viewHref={event.publishStatus === "DRAFT" ? undefined : `/events/${event.slug}`}
        actions={event.publishStatus === "DRAFT" ? <PreviewLink path={`/events/${event.slug}`} /> : undefined}
      />
      <div className="max-w-3xl">
        <EventForm
          mode="edit"
          eventId={event.id}
          siteUrl={SITE_URL}
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
            publishStatus: event.publishStatus,
            seoTitle: event.seoTitle,
            metaDescription: event.metaDescription,
            ogImage: event.ogImage,
            ogImageAlt: event.ogImageAlt,
          }}
        />
      </div>
    </div>
  );
}
