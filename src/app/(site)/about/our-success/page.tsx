import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import StatsBand from "@/components/sections/StatsBand";
import PhotoCollage from "@/components/sections/PhotoCollage";
import Testimonials from "@/components/sections/Testimonials";
import SectionHeading from "@/components/ui/SectionHeading";
import Container from "@/components/layout/Container";
import CtaBanner from "@/components/sections/CtaBanner";
import { editablePageMetadata, getPage } from "@/lib/content/pages";

export async function generateMetadata(): Promise<Metadata> {
  return editablePageMetadata("about-success", await getPage("about-success"));
}

export default async function OurSuccessPage() {
  // Milestones are edited on Our Organization; the reviews heading on Home.
  const [page, organization, home] = await Promise.all([getPage("about-success"), getPage("about-organization"), getPage("home")]);
  return (
    <>
      <PageHero
        title={page.hero.title}
        description={page.hero.description}
        breadcrumb={[{ label: "About Us", href: "/about" }, { label: "Our Success" }]}
      />

      <StatsBand />

      {/* Milestones */}
      <section className="py-16 sm:py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <PhotoCollage photos={page.photos.photos.map((p) => p.photo)} />
          <div>
            <SectionHeading eyebrow={page.milestones.eyebrow} title={page.milestones.title} align="left" />
            <ol className="mt-10 space-y-6">
              {organization.journey.milestones.map((entry, index) => (
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

      <Testimonials heading={home.reviews} />

      <CtaBanner />
    </>
  );
}
