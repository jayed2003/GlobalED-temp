import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import CtaBanner from "@/components/sections/CtaBanner";
import EventsTabs from "@/components/sections/EventsTabs";
import Container from "@/components/layout/Container";
import { getAllEvents } from "@/lib/content/events";
import { editablePageMetadata, getPage } from "@/lib/content/pages";

export async function generateMetadata(): Promise<Metadata> {
  return editablePageMetadata("events", await getPage("events"));
}

export default async function EventsPage() {
  const page = await getPage("events");
  const events = await getAllEvents();
  return (
    <>
      <PageHero
        title={page.hero.title}
        description={page.hero.description}
        breadcrumb={[{ label: "Blogs & Events" }, { label: "Events" }]}
      />
      <section className="py-16 sm:py-20">
        <Container>
          <EventsTabs events={events} />
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
