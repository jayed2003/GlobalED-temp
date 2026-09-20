import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import CtaBanner from "@/components/sections/CtaBanner";
import EventsTabs from "@/components/sections/EventsTabs";
import Container from "@/components/layout/Container";
import { getAllEvents } from "@/lib/content/events";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming and previous GlobalEd events — education expos, university admission days, free IELTS mock tests, and more across Bangladesh.",
};

export default async function EventsPage() {
  const events = await getAllEvents();
  return (
    <>
      <PageHero
        title="Events"
        description="Meet university representatives, join free IELTS mock tests, and get on-spot admission assessments."
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
