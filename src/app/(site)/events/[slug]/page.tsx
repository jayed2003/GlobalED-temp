import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Container from "@/components/layout/Container";
import CtaBanner from "@/components/sections/CtaBanner";
import SectionHeading from "@/components/ui/SectionHeading";
import JsonLd from "@/components/ui/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { getEventSlugs, getEventBySlug } from "@/lib/content/events";
import { formatDate } from "@/lib/labels";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";
import { isOriginalUpload } from "@/lib/images";

export async function generateStaticParams() {
  const slugs = await getEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return pageMetadata({
    path: `/events/${event.slug}`,
    title: event.title,
    description: event.description,
    image: event.bannerImage,
    imageAlt: event.bannerImageAlt,
  });
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: event.title,
          description: event.description,
          startDate: event.date,
          location: {
            "@type": "Place",
            name: event.venue,
          },
          organizer: {
            "@type": "Organization",
            name: "GlobalEd",
            url: SITE_URL,
          },
        }}
      />

      {/* Banner */}
      <section className="relative overflow-hidden bg-primary-950">
        <div className="absolute inset-0">
          <Image
            src={event.bannerImage}
            unoptimized={isOriginalUpload(event.bannerImage)}
            alt={event.bannerImageAlt ?? event.title}
            fill
            priority
            className="object-cover opacity-40"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/60 to-primary-950/30" aria-hidden />
        </div>
        <Container className="relative py-16 sm:py-24">
          <Breadcrumb items={[{ label: "Events", href: "/events" }, { label: event.title }]} />
          <h1 className="mt-5 max-w-3xl font-heading text-3xl font-bold text-white sm:text-4xl">
            {event.title}
          </h1>
        </Container>
      </section>

      {/* Info + description */}
      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-heading text-2xl font-bold text-primary-900">
              About This Event
            </h2>
            <p className="mt-4 leading-relaxed text-neutral-600">{event.description}</p>

            {event.status === "upcoming" && (
              <div className="mt-8">
                <ButtonLink href="/consultation" size="lg">
                  Register for This Event
                </ButtonLink>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-xl border border-neutral-200 bg-primary-50 p-6">
            <h3 className="font-heading text-lg font-bold text-primary-900">Event Details</h3>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <CalendarDays size={18} aria-hidden className="text-primary-600" />
                <div>
                  <p className="text-neutral-500">Date</p>
                  <p className="font-semibold text-primary-900">{formatDate(event.date)}</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} aria-hidden className="text-primary-600" />
                <div>
                  <p className="text-neutral-500">Time</p>
                  <p className="font-semibold text-primary-900">{event.time}</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} aria-hidden className="text-primary-600" />
                <div>
                  <p className="text-neutral-500">Venue</p>
                  <p className="font-semibold text-primary-900">{event.venue}</p>
                </div>
              </li>
            </ul>
          </aside>
        </Container>
      </section>

      {/* Gallery for previous events */}
      {event.status === "previous" && event.gallery && event.gallery.length > 0 && (
        <section className="bg-primary-50 py-16 sm:py-20">
          <Container>
            <SectionHeading eyebrow="Gallery" title="Event Highlights" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {event.gallery.map((image, index) => (
                <div
                  key={image}
                  className="relative aspect-video overflow-hidden rounded-xl shadow-sm"
                >
                  <Image
                    src={image}
                    unoptimized={isOriginalUpload(image)}
                    alt={event.galleryAlts?.[index] ?? `${event.title} — photo ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
