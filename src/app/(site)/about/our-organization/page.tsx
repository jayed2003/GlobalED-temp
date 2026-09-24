import type { Metadata } from "next";
import Image from "next/image";
import { Eye, Target } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CtaBanner from "@/components/sections/CtaBanner";
import SectionHeading from "@/components/ui/SectionHeading";
import Container from "@/components/layout/Container";
import { editablePageMetadata, getPage } from "@/lib/content/pages";
import { isOriginalUpload } from "@/lib/images";

export async function generateMetadata(): Promise<Metadata> {
  return editablePageMetadata("about-organization", await getPage("about-organization"));
}

export default async function OurOrganizationPage() {
  const page = await getPage("about-organization");
  return (
    <>
      <PageHero
        title={page.hero.title}
        description={page.hero.description}
        breadcrumb={[{ label: "About Us", href: "/about" }, { label: "Our Organization" }]}
      />

      {/* Our Story */}
      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow={page.story.eyebrow} title={page.story.title} />
            <div className="mt-6 space-y-4 leading-relaxed text-neutral-600">
              {page.story.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-neutral-200 bg-primary-50 p-6 sm:p-8">
            <h3 className="font-heading text-lg font-bold text-primary-900">{page.journey.title}</h3>
            <ol className="mt-6 space-y-6">
              {page.journey.milestones.map((entry, index) => (
                <li key={index} className="flex gap-4">
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
            <p className="mt-3 leading-relaxed text-primary-100">{page.missionVision.mission}</p>
          </div>
          <div className="rounded-xl bg-primary-800 p-8 text-white">
            <Eye size={32} aria-hidden className="text-accent-400" />
            <h2 className="mt-4 font-heading text-2xl font-bold">Our Vision</h2>
            <p className="mt-3 leading-relaxed text-primary-100">{page.missionVision.vision}</p>
          </div>
        </Container>
      </section>

      {/* Sister organizations */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow={page.sisters.eyebrow} title={page.sisters.title} />
          <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
            {page.sisters.organizations.map((org, index) => (
              <div
                key={index}
                className="rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-sm"
              >
                {org.logo.src && (
                  <div className="relative mx-auto mb-4 h-20 w-40">
                    <Image
                      src={org.logo.src}
                      alt={org.logo.alt}
                      fill
                      className="object-contain"
                      sizes="160px"
                      unoptimized={isOriginalUpload(org.logo.src)}
                    />
                  </div>
                )}
                <h3 className="font-heading text-lg font-semibold text-primary-900">
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
