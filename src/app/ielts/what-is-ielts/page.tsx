import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Container from "@/components/layout/Container";
import CtaBanner from "@/components/sections/CtaBanner";
import { ielts } from "@/data/ielts";

export const metadata: Metadata = {
  title: "What is IELTS?",
  description:
    "Learn what IELTS is, its formats, modules, and scoring — the world's most widely accepted English proficiency test.",
};

export default function WhatIsIeltsPage() {
  return (
    <>
      <PageHero
        title={ielts.whatIsIelts.title}
        description="A quick primer on the world's most widely accepted English proficiency test."
        breadcrumb={[{ label: "IELTS", href: "/ielts" }, { label: "What is IELTS?" }]}
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
