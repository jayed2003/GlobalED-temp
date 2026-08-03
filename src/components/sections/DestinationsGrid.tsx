import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import DestinationCard from "@/components/cards/DestinationCard";
import { destinations } from "@/data/destinations";

/** Home "Best Study Abroad Destinations from Bangladesh" — all 13 countries. */
export default function DestinationsGrid() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Study Destinations"
          title="Best Study Abroad Destinations from Bangladesh"
          description="Thirteen countries, hundreds of partner universities, one counsellor guiding you to the right choice."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>
      </Container>
    </section>
  );
}
