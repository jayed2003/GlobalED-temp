import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpenCheck, FileQuestion, Globe2, GraduationCap, Quote } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { getIeltsContent } from "@/lib/content/ielts";
import { editablePageMetadata, getPage } from "@/lib/content/pages";
import BrandTitle from "@/components/ui/BrandTitle";

export async function generateMetadata(): Promise<Metadata> {
  return editablePageMetadata("ielts", await getPage("ielts"));
}

export default async function IeltsPage() {
  const [ielts, page] = await Promise.all([getIeltsContent(), getPage("ielts")]);

  const links = [
    {
      href: "/ielts/what-is-ielts",
      icon: FileQuestion,
      title: ielts.whatIsIelts.title,
      description: page.cards.whatText,
    },
    {
      href: "/ielts/why-ielts",
      icon: Globe2,
      title: ielts.whyIelts.title,
      description: page.cards.whyText,
    },
    {
      href: "/ielts/with-globaled",
      icon: BadgeCheck,
      title: ielts.whyGlobaled.title,
      description: page.cards.withText,
    },
    {
      href: "/ielts/preparation",
      icon: GraduationCap,
      title: ielts.preparation.title,
      description: page.cards.preparationText,
    },
    {
      href: "/consultation",
      icon: BookOpenCheck,
      title: page.cards.bookTitle,
      description: page.cards.bookText,
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 py-14 sm:py-20">
        <Container>
          <Breadcrumb items={[{ label: "IELTS" }]} />
          <h1 className="mt-5 max-w-3xl font-heading text-4xl font-bold text-white sm:text-5xl">
            <BrandTitle text={page.hero.title} />
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-primary-100">{page.hero.description}</p>
          <div className="mt-8">
            <ButtonLink href="/consultation" size="lg">
              <BookOpenCheck size={18} aria-hidden />
              Book a Free IELTS Consultation
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

      {/* Student Success Stories */}
      <section className="bg-primary-50 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow={page.stories.eyebrow}
            title={ielts.successStories.title}
            description={ielts.successStories.body}
          />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {ielts.successStories.achievements.map((achievement) => (
              <div
                key={achievement.outcome}
                className="rounded-xl border border-neutral-200 bg-white p-5 text-center shadow-sm"
              >
                <p className="font-heading text-2xl font-bold text-primary-700">
                  Band {achievement.band}
                </p>
                <p className="mt-1 text-xs text-neutral-500">{achievement.outcome}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {ielts.successStories.quotes.map((quote) => (
              <div
                key={quote}
                className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <Quote size={22} aria-hidden className="text-accent-600" />
                <p className="mt-3 text-sm leading-relaxed text-neutral-700">{quote}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
