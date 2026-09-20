import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import DestinationCard from "@/components/cards/DestinationCard";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { getAllDestinations } from "@/lib/content/destinations";

const MOBILE_LIMIT = 4;
const DESKTOP_LIMIT = 8;

/** Home "Best Study Abroad Destinations from Bangladesh" — 4 on mobile, 8 on desktop. */
export default async function DestinationsGrid() {
  const destinations = await getAllDestinations();
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Study Destinations"
          title="Best Study Abroad Destinations from Bangladesh"
          description="Thirteen countries, hundreds of partner universities, one counsellor guiding you to the right choice."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((destination, index) => (
            <Reveal
              key={destination.slug}
              delay={(index % 4) * 80}
              className={cn(
                index >= MOBILE_LIMIT && index < DESKTOP_LIMIT && "hidden sm:block",
                index >= DESKTOP_LIMIT && "hidden",
              )}
            >
              <DestinationCard destination={destination} />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-sm transition-colors hover:bg-primary-700 hover:text-white"
          >
            View All Destinations
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </Container>
    </section>
  );
}
