import type { Metadata } from "next";
import PhotoHero from "@/components/sections/PhotoHero";
import CtaBanner from "@/components/sections/CtaBanner";
import SectionHeading from "@/components/ui/SectionHeading";
import TeamCard from "@/components/cards/TeamCard";
import Container from "@/components/layout/Container";
import { organization } from "@/data/organization";
import { team } from "@/data/team";
import { editablePageMetadata, getPage } from "@/lib/content/pages";

export async function generateMetadata(): Promise<Metadata> {
  return editablePageMetadata("about-team", await getPage("about-team"));
}

export default async function OurTeamPage() {
  const page = await getPage("about-team");
  return (
    <>
      <PhotoHero
        image={page.hero.image.src}
        imageAlt={page.hero.image.alt}
        title={page.hero.title}
        description={page.hero.description}
        breadcrumb={[{ label: "About Us", href: "/about" }, { label: "Our Team" }]}
      />

      {/* Board of Directors */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow={page.board.eyebrow} title={page.board.title} description={page.board.description} />
          {/* One row of 5 on desktop; wraps (centered) on smaller screens. Every card
              has the same width and the same 24px gap, so spacing stays consistent. */}
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {organization.boardOfDirectors.map((member) => (
              <div
                key={member.name}
                className="w-[calc((100%_-_24px)/2)] sm:w-[calc((100%_-_48px)/3)] lg:w-[calc((100%_-_96px)/5)]"
              >
                <TeamCard member={member} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="bg-primary-50 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow={page.team.eyebrow} title={page.team.title} description={page.team.description} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
