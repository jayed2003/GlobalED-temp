import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import EventCard from "@/components/cards/EventCard";
import { ButtonLink } from "@/components/ui/Button";
import { getAllEvents } from "@/lib/content/events";

/** Home upcoming events teaser (PFEC pattern). */
export default async function EventsTeaser() {
  const events = await getAllEvents();
  const upcoming = events
    .filter((event) => event.status === "upcoming")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 2);

  if (upcoming.length === 0) return null;

  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Events"
          title="Upcoming Events"
          description="Meet university representatives, join free IELTS mock tests, and get on-spot assessments."
        />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
          {upcoming.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/events" variant="outline">
            View All Events
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
