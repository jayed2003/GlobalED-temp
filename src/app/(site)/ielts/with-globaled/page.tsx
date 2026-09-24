import type { Metadata } from "next";
import { BadgeCheck, CheckCircle2 } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Container from "@/components/layout/Container";
import CtaBanner from "@/components/sections/CtaBanner";
import SectionHeading from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { getIeltsContent } from "@/lib/content/ielts";
import { editablePageMetadata, getPage } from "@/lib/content/pages";

export async function generateMetadata(): Promise<Metadata> {
  const [page, ielts] = await Promise.all([getPage("ielts-with-globaled"), getIeltsContent()]);
  // An empty SEO title falls back to the title from IELTS Content.
  return editablePageMetadata("ielts-with-globaled", page, { title: ielts.whyGlobaled.title });
}

export default async function IeltsWithGlobaledPage() {
  const ielts = await getIeltsContent();
  return (
    <>
      <PageHero
        title={ielts.whyGlobaled.title}
        description={ielts.whyGlobaled.body}
        breadcrumb={[{ label: "IELTS", href: "/ielts" }, { label: "IELTS with GlobalEd" }]}
        bannerImage="/images/hero/ielts-passport-banner.jpg"
        bannerAlt="Your passport to IELTS success — free mock test, exclusive learning resources and guidance from IELTS experts"
        bannerWidth={3091}
        bannerHeight={1356}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
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

      <section className="bg-primary-50 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Try Before You Commit"
            title="Free Exclusive Services"
            description="Get a real feel for GlobalEd and the official IELTS exam before you commit to anything."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {ielts.whyGlobaled.freeServices.map((service) => (
              <div
                key={service.title}
                className="flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <h3 className="font-heading text-lg font-semibold text-primary-900">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {service.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {service.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2 text-sm leading-relaxed text-neutral-700"
                    >
                      <CheckCircle2
                        size={16}
                        aria-hidden
                        className="mt-0.5 shrink-0 text-green-600"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
                <ButtonLink href="/consultation" size="sm" className="mt-6">
                  {service.ctaLabel}
                </ButtonLink>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
