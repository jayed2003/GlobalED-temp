import type { Metadata } from "next";
import { Globe2 } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Container from "@/components/layout/Container";
import CtaBanner from "@/components/sections/CtaBanner";
import { ielts } from "@/data/ielts";

export const metadata: Metadata = {
  title: "Why IELTS?",
  description:
    "Why IELTS matters for study, work, and migration abroad — global acceptance, visa requirements, and fair assessment.",
};

export default function WhyIeltsPage() {
  return (
    <>
      <PageHero
        title={ielts.whyIelts.title}
        description={ielts.whyIelts.body}
        breadcrumb={[{ label: "IELTS", href: "/ielts" }, { label: "Why IELTS?" }]}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {ielts.whyIelts.reasons.map((reason) => (
              <div
                key={reason.title}
                className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <Globe2 size={28} aria-hidden className="text-accent-600" />
                <h3 className="mt-3 font-heading text-base font-semibold text-primary-900">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
