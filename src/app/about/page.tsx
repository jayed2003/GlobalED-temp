import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, TrendingUp, Users2 } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about GlobalEd — our history since 2013, our mission and vision, our sister educational organizations, board of directors, and the team behind thousands of study abroad successes.",
};

const links = [
  {
    href: "/about/our-success",
    icon: TrendingUp,
    title: "Our Success",
    description: "Milestones since 2013, students placed, and real student success stories.",
  },
  {
    href: "/about/our-organization",
    icon: Building2,
    title: "Our Organization",
    description: "Our story, mission, vision, and sister educational organizations.",
  },
  {
    href: "/about/our-team",
    icon: Users2,
    title: "Our Team",
    description: "Board of Directors and the people behind your success.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title={
          <>
            About Global<span className="text-accent-500">Ed</span>
          </>
        }
        description="From a single IELTS classroom to one of Bangladesh's most trusted study abroad consultancies."
        breadcrumb={[{ label: "About Us" }]}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-3">
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
