import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/sections/PageHero";
import CtaBanner from "@/components/sections/CtaBanner";
import DestinationCard from "@/components/cards/DestinationCard";
import Container from "@/components/layout/Container";
import Pagination from "@/components/ui/Pagination";
import { getAllDestinations } from "@/lib/content/destinations";
import { editablePageMetadata, getPage } from "@/lib/content/pages";
import { paginate, parsePage } from "@/lib/pagination";
import { pagedMetadata } from "@/lib/seo";

const PER_PAGE = 16;

type SearchParams = Promise<{ page?: string | string[] }>;

/** Page 1 is /destinations; the rest are /destinations?page=N, starting at the list. */
const pageHref = (page: number) => (page === 1 ? "/destinations#all-destinations" : `/destinations?page=${page}#all-destinations`);

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const meta = editablePageMetadata("destinations", await getPage("destinations"));
  return pagedMetadata(meta, parsePage((await searchParams).page) ?? 1, "/destinations");
}

export default async function DestinationsPage({ searchParams }: { searchParams: SearchParams }) {
  const requested = parsePage((await searchParams).page);
  if (requested === null) notFound();
  const [page, destinations] = await Promise.all([getPage("destinations"), getAllDestinations()]);
  const { items, totalPages } = paginate(destinations, requested, PER_PAGE);
  if (requested > totalPages) notFound();

  return (
    <>
      <PageHero
        title={page.hero.title}
        description={page.hero.description}
        breadcrumb={[{ label: "Destinations" }]}
      />
      <section id="all-destinations" className="scroll-mt-12 py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
          <Pagination page={requested} totalPages={totalPages} href={pageHref} label="Destination pages" />
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
