import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, GraduationCap } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Get Started",
  description:
    "Tell us what you need help with — a free study abroad consultation or IELTS test registration — and we'll take you straight to the right form.",
};

const choices = [
  {
    href: "/consultation",
    icon: GraduationCap,
    title: "Study Abroad Consultation",
    description:
      "Get free, personalized guidance on destinations, universities, scholarships, and visas.",
  },
  {
    href: "/ielts-registration",
    icon: BookOpenCheck,
    title: "IELTS Registration",
    description:
      "Book your IELTS test or preparation course with Bangladesh's trusted IELTS center.",
  },
];

export default function GetStartedPage() {
  return (
    <>
      <PageHero
        title="Let's Get Started"
        description="Tell us what you're here for, and we'll take you straight to the right form."
        breadcrumb={[{ label: "Get Started" }]}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            {choices.map((choice) => {
              const Icon = choice.icon;
              return (
                <Link
                  key={choice.href}
                  href={choice.href}
                  className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition-colors group-hover:bg-primary-700 group-hover:text-white">
                    <Icon size={28} aria-hidden />
                  </span>
                  <h2 className="mt-5 font-heading text-xl font-bold text-primary-900">
                    {choice.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
                    {choice.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary-700">
                    Continue
                    <ArrowRight
                      size={14}
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
