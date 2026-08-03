import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import CtaBanner from "@/components/sections/CtaBanner";
import ServiceCard from "@/components/cards/ServiceCard";
import FaqAccordion from "@/components/ui/FaqAccordion";
import SectionHeading from "@/components/ui/SectionHeading";
import Container from "@/components/layout/Container";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "University admission support, scholarship guidance, documentation, visa application, pre & post departure guidance, and language support from GlobalEd Bangladesh.",
};

const faqs = [
  {
    q: "Is GlobalEd's counselling really free?",
    a: "Yes — counselling, university shortlisting, and application support are completely free for students. We are compensated by our partner universities, never by hidden charges to you.",
  },
  {
    q: "Which countries does GlobalEd cover?",
    a: "We cover 13 destinations: UK, USA, Canada, Australia, New Zealand, Sweden, Finland, Denmark, Greece, Malta, Cyprus, South Korea, and Malaysia.",
  },
  {
    q: "Can you help if I have a study gap?",
    a: "Yes. Many of our successful students had study gaps. We build a strong, honest case around your work experience and motivation.",
  },
  {
    q: "How long does the whole process take?",
    a: "Typically 3–6 months from first counselling to visa decision, depending on your destination and intake. Starting early always helps.",
  },
];

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
            <FaqAccordion faqs={faqs} />
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
