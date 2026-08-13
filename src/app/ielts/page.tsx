import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpenCheck, FileQuestion, Globe2, GraduationCap } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Container from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ielts } from "@/data/ielts";

export const metadata: Metadata = {
  title: "IELTS with GlobalEd",
  description:
    "What is IELTS, why it matters, why prepare with GlobalEd, our IELTS preparation courses, and IELTS test booking for students in Bangladesh.",
};

const links = [
  {
    href: "/ielts/what-is-ielts",
    icon: FileQuestion,
    title: ielts.whatIsIelts.title,
    description: "Formats, modules, and scoring — the basics of the test.",
  },
  {
    href: "/ielts/why-ielts",
    icon: Globe2,
    title: ielts.whyIelts.title,
    description: "Why IELTS matters for study, work, and migration abroad.",
  },
  {
    href: "/ielts/with-globaled",
    icon: BadgeCheck,
    title: ielts.whyGlobaled.title,
    description: "British Council authorized testing and band 7+ instructors.",
  },
  {
    href: "/ielts/preparation",
    icon: GraduationCap,
    title: ielts.preparation.title,
    description: "Regular, executive, and master class preparation batches.",
  },
  {
    href: "/ielts-registration",
    icon: BookOpenCheck,
    title: "Book an IELTS Test",
    description: "Register for your official IELTS test or preparation course.",
  },
];

export default function IeltsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 py-14 sm:py-20">
        <Container>
          <Breadcrumb items={[{ label: "IELTS" }]} />
          <h1 className="mt-5 max-w-3xl font-heading text-4xl font-bold text-white sm:text-5xl">
            IELTS with Global<span className="text-accent-500">Ed</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-primary-100">
            Bangladesh&apos;s trusted IELTS preparation center — expert
            instructors, real mock tests, and official test booking support.
          </p>
          <div className="mt-8">
            <ButtonLink href="/ielts-registration" size="lg">
              <BookOpenCheck size={18} aria-hidden />
              Book an IELTS Test
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Section links */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-colors hover:border-primary-200 hover:bg-primary-50"
              >
                <link.icon size={28} aria-hidden className="text-accent-600" />
                <h2 className="mt-3 font-heading text-lg font-semibold text-primary-900">
                  {link.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {link.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-700">
                  Learn more
                  <ArrowRight
                    size={14}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
