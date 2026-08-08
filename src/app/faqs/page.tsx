import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import CtaBanner from "@/components/sections/CtaBanner";
import FaqFilter from "@/components/sections/FaqFilter";
import Container from "@/components/layout/Container";
import { faqs } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about GlobalEd's study abroad services, IELTS preparation, university admissions, visa processing, and more.",
};

export default function FaqsPage() {
  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        description="Quick answers to common questions about studying abroad, IELTS, visas, and our services."
        breadcrumb={[{ label: "FAQs" }]}
      />

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <FaqFilter faqs={faqs} />
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}