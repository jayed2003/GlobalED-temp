import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import StatsBand from "@/components/sections/StatsBand";
import Testimonials from "@/components/sections/Testimonials";
import SectionHeading from "@/components/ui/SectionHeading";
import Container from "@/components/layout/Container";
import CtaBanner from "@/components/sections/CtaBanner";
import { organization } from "@/data/organization";

export const metadata: Metadata = {
  title: "Our Success",
  description:
    "GlobalEd's track record — milestones since 2013, students placed, visa success rate, and real student success stories.",
};

export default function OurSuccessPage() {
  return (
    <>
      <PageHero
        title="Our Success"
        description="Since 2013, we've grown from a single IELTS classroom into a track record thousands of students trust."
        breadcrumb={[{ label: "About Us", href: "/about" }, { label: "Our Success" }]}
      />

      <StatsBand />

      {/* Milestones */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Our Journey" title="Milestones Along the Way" />
          <ol className="mx-auto mt-12 max-w-2xl space-y-6">
            {organization.timeline.map((entry) => (
              <li key={entry.year} className="flex gap-4">
                <span className="flex h-12 w-14 shrink-0 items-center justify-center rounded-lg bg-primary-700 font-heading text-sm font-bold text-white">
                  {entry.year}
                </span>
                <p className="pt-2 text-sm leading-relaxed text-neutral-700">{entry.milestone}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Testimonials />

      <CtaBanner />
    </>
  );
}
