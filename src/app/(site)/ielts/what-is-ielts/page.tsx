import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Container from "@/components/layout/Container";
import CtaBanner from "@/components/sections/CtaBanner";
import { getIeltsContent } from "@/lib/content/ielts";
import { editablePageMetadata, getPage } from "@/lib/content/pages";

export async function generateMetadata(): Promise<Metadata> {
  const [page, ielts] = await Promise.all([getPage("ielts-what"), getIeltsContent()]);
  // An empty SEO title falls back to the title from IELTS Content.
  return editablePageMetadata("ielts-what", page, { title: ielts.whatIsIelts.title });
}

export default async function WhatIsIeltsPage() {
  const [ielts, page] = await Promise.all([getIeltsContent(), getPage("ielts-what")]);
  return (
    <>
      <PageHero
        title={ielts.whatIsIelts.title}
        description={page.hero.description}
        breadcrumb={[{ label: "IELTS", href: "/ielts" }, { label: "What is IELTS?" }]}
        bannerImage="/images/hero/what-is-ielts.jpg"
        bannerAlt="A student climbing a bar chart towards a graduation-capped globe — GlobalEd, Believe in yourself"
        bannerWidth={1376}
        bannerHeight={768}
        bannerUniformHeight
        bannerFadeLeft={12}
        bannerFadeY={6}
      />

      <section className="py-16 sm:py-20">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <p className="leading-relaxed text-neutral-600">{ielts.whatIsIelts.body}</p>
          <ul className="space-y-3">
            {ielts.whatIsIelts.points.map((point) => (
              <li
                key={point}
                className="flex gap-3 rounded-lg border border-neutral-200 bg-white p-4 text-sm leading-relaxed text-neutral-700 shadow-sm"
              >
                <CheckCircle2 size={18} aria-hidden className="mt-0.5 shrink-0 text-green-600" />
                {point}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
