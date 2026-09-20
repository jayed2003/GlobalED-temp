import type { Metadata } from "next";
import Image from "next/image";
import { Eye, Target } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CtaBanner from "@/components/sections/CtaBanner";
import SectionHeading from "@/components/ui/SectionHeading";
import Container from "@/components/layout/Container";
import { organization } from "@/data/organization";

export const metadata: Metadata = {
  title: "Our Organization",
  description:
    "GlobalEd's story, mission, vision, and our sister educational organizations under Global Citizen Limited.",
};

export default function OurOrganizationPage() {
  return (
    <>
      <PageHero
        title="Our Organization"
        description="From a single IELTS classroom to one of Bangladesh's most trusted study abroad consultancies."
        breadcrumb={[{ label: "About Us", href: "/about" }, { label: "Our Organization" }]}
      />

      {/* Our Story */}
      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="Our Organization" title="Our Story" />
            <div className="mt-6 space-y-4 leading-relaxed text-neutral-600">
              {organization.history.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-neutral-200 bg-primary-50 p-6 sm:p-8">
            <h3 className="font-heading text-lg font-bold text-primary-900">Our Journey</h3>
            <ol className="mt-6 space-y-6">
              {organization.timeline.map((entry) => (
                <li key={entry.year} className="flex gap-4">
                  <span className="flex h-12 w-14 shrink-0 items-center justify-center rounded-lg bg-primary-700 font-heading text-sm font-bold text-white">
                    {entry.year}
                  </span>
                  <p className="pt-2 text-sm leading-relaxed text-neutral-700">{entry.milestone}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="bg-primary-50 py-16 sm:py-20">
        <Container className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-primary-700 p-8 text-white">
            <Target size={32} aria-hidden className="text-accent-400" />
            <h2 className="mt-4 font-heading text-2xl font-bold">Our Mission</h2>
            <p className="mt-3 leading-relaxed text-primary-100">{organization.mission}</p>
          </div>
          <div className="rounded-xl bg-primary-800 p-8 text-white">
            <Eye size={32} aria-hidden className="text-accent-400" />
            <h2 className="mt-4 font-heading text-2xl font-bold">Our Vision</h2>
            <p className="mt-3 leading-relaxed text-primary-100">{organization.vision}</p>
          </div>
        </Container>
      </section>

      {/* Sister organizations */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Our Family" title="Our Sister Educational Organizations" />
          <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
            {organization.sisterOrganizations.map((org) => (
              <div
                key={org.name}
                className="rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="relative mx-auto h-20 w-40">
                  <Image
                    src={org.logo}
                    alt={`${org.name} logo`}
                    fill
                    className="object-contain"
                    sizes="160px"
                  />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-primary-900">
                  {org.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{org.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
