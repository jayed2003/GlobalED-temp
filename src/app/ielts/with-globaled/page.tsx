import type { Metadata } from "next";
import { BadgeCheck } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Container from "@/components/layout/Container";
import CtaBanner from "@/components/sections/CtaBanner";
import { ielts } from "@/data/ielts";

export const metadata: Metadata = {
  title: "IELTS with GlobalEd",
  description:
    "Why prepare for IELTS with GlobalEd — British Council authorized testing, band 7+ instructors, and real mock tests.",
};

export default function IeltsWithGlobaledPage() {
  return (
    <>
      <PageHero
        title={ielts.whyGlobaled.title}
        description="Bangladesh's trusted IELTS preparation center — expert instructors, real mock tests, and official test booking support."
        breadcrumb={[{ label: "IELTS", href: "/ielts" }, { label: "IELTS with GlobalEd" }]}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ielts.whyGlobaled.usps.map((usp) => (
              <div
                key={usp.title}
                className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <BadgeCheck size={28} aria-hidden className="text-accent-600" />
                <h3 className="mt-3 font-heading text-base font-semibold text-primary-900">
                  {usp.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{usp.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
