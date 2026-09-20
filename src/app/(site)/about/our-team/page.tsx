import type { Metadata } from "next";
import PhotoHero from "@/components/sections/PhotoHero";
import CtaBanner from "@/components/sections/CtaBanner";
import SectionHeading from "@/components/ui/SectionHeading";
import TeamCard from "@/components/cards/TeamCard";
import Container from "@/components/layout/Container";
import { organization } from "@/data/organization";
import { team } from "@/data/team";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet GlobalEd's Board of Directors and the certified counsellors, IELTS instructors, and visa experts behind your success.",
};

export default function OurTeamPage() {
  return (
    <>
      <PhotoHero
        image="/images/hero/our-team.jpg"
        imageAlt="The GlobalEd team and partners gathered at a British Council IELTS event"
        title="Our Team"
        description="The leadership and people behind thousands of study abroad successes."
        breadcrumb={[{ label: "About Us", href: "/about" }, { label: "Our Team" }]}
      />

      {/* Board of Directors */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Leadership"
            title="Board of Directors"
            description="The visionary leaders guiding Global Citizen Limited and GlobalEd."
          />
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
          <SectionHeading
            eyebrow="Our Team"
            title="Meet the People Behind Your Success"
            description="Certified counsellors, experienced IELTS instructors, and visa documentation experts."
          />
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
