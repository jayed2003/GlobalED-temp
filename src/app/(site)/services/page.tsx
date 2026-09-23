import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import CtaBanner from "@/components/sections/CtaBanner";
import ServiceCard from "@/components/cards/ServiceCard";
import FaqAccordion from "@/components/ui/FaqAccordion";
import SectionHeading from "@/components/ui/SectionHeading";
import Container from "@/components/layout/Container";
import { services } from "@/data/services";
import { faqs } from "@/data/faqs";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/services",
  title: "Our Services",
  description:
    "University admission support, scholarship guidance, documentation, visa application, pre & post departure guidance, and language support from GlobalEd Bangladesh.",
});

const serviceFaqs = faqs.slice(-4); // Last 4 are service-related FAQs

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Services"
        description="End-to-end study abroad support — from choosing the right university to settling into your new campus."
        breadcrumb={[{ label: "Services" }]}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-primary-50 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="FAQs" title="Common Questions About Our Services" />
          <div className="mt-10">
            <FaqAccordion faqs={serviceFaqs} />
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
