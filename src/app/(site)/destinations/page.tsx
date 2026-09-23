import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import CtaBanner from "@/components/sections/CtaBanner";
import DestinationCard from "@/components/cards/DestinationCard";
import Container from "@/components/layout/Container";
import { getAllDestinations } from "@/lib/content/destinations";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/destinations",
  title: "Study Destinations",
  description:
    "Explore 13 study abroad destinations from Bangladesh — UK, USA, Canada, Australia, New Zealand, Europe, South Korea, and Malaysia with GlobalEd's free counselling.",
});

export default async function DestinationsPage() {
  const destinations = await getAllDestinations();
  return (
    <>
      <PageHero
        title="Study Abroad Destinations"
        description="Thirteen countries, hundreds of partner universities — find the destination that fits your goals and budget."
        breadcrumb={[{ label: "Destinations" }]}
      />
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
