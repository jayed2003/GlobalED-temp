import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import CtaBanner from "@/components/sections/CtaBanner";
import DestinationCard from "@/components/cards/DestinationCard";
import Container from "@/components/layout/Container";
import { getAllDestinations } from "@/lib/content/destinations";
import { editablePageMetadata, getPage } from "@/lib/content/pages";

export async function generateMetadata(): Promise<Metadata> {
  return editablePageMetadata("destinations", await getPage("destinations"));
}

export default async function DestinationsPage() {
  const page = await getPage("destinations");
  const destinations = await getAllDestinations();
  return (
    <>
      <PageHero
        title={page.hero.title}
        description={page.hero.description}
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
