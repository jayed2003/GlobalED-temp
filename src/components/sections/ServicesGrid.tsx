import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/cards/ServiceCard";
import Reveal from "@/components/ui/Reveal";
import { services } from "@/data/services";
import type { HeadingContent } from "@/lib/pages";

/** Home "Our Services" section — 6 numbered service cards. */
export default function ServicesGrid({ heading }: { heading: HeadingContent }) {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={heading.eyebrow}
          title={heading.title}
          description={heading.description}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={index * 80}>
              <ServiceCard service={service} index={index} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
