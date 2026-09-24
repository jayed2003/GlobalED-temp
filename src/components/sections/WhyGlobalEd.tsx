import { ShieldCheck, Users, Globe2, HeartHandshake } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { getSiteSettings } from "@/lib/content/settings";
import type { SiteSettings } from "@/types";

const reasons = (site: SiteSettings) => [
  {
    icon: ShieldCheck,
    title: "Proven Visa Success",
    description: `A ${site.stats.visaSuccessRate} visa success rate built on honest guidance and airtight documentation.`,
  },
  {
    icon: Users,
    title: "Certified Counsellors",
    description: "Certified counsellors, experienced IELTS instructors, and visa documentation experts guide every step.",
  },
  {
    icon: Globe2,
    title: "Global Partner Network",
    description: `${site.stats.partnerUniversities} partner universities across thirteen countries, matched to your goals and budget.`,
  },
  {
    icon: HeartHandshake,
    title: "Support Beyond the Visa",
    description: "From application to arrival, we stay with you through pre-departure briefings and settling in abroad.",
  },
];

/** Home "Why GlobalEd" USP section — sits between Destinations and Success Stories. */
export default async function WhyGlobalEd() {
  const site = await getSiteSettings();
  return (
    <section className="bg-primary-50 py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Why GlobalEd"
          title="Your Trusted Partner for Studying Abroad"
          description={`${site.stats.studentsPlaced} students placed over ${site.stats.yearsOfExperience} years — here's why families across Bangladesh choose GlobalEd.`}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons(site).map((reason, index) => (
            <Reveal key={reason.title} delay={index * 80}>
              <div className="h-full rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-700 text-white">
                  <reason.icon size={22} aria-hidden />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-primary-900">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {reason.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
