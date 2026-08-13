import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/sections/PageHero";
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
      <PageHero
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
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {organization.boardOfDirectors.map((member) => (
              <div
                key={member.name}
                className="rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="relative mx-auto h-24 w-24 rounded-full overflow-hidden bg-neutral-100">
                  <Image
                    src={member.photo}
                    alt={`${member.name} photo`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-primary-900">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm text-primary-600">{member.designation}</p>
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
