import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import CtaBanner from "@/components/sections/CtaBanner";
import ServiceCard from "@/components/cards/ServiceCard";
import FaqAccordion from "@/components/ui/FaqAccordion";
import SectionHeading from "@/components/ui/SectionHeading";
import Container from "@/components/layout/Container";
import { getServices } from "@/lib/content/services";
import { getServiceFaqs } from "@/lib/content/faqs";
import { editablePageMetadata, getPage } from "@/lib/content/pages";

export async function generateMetadata(): Promise<Metadata> {
  return editablePageMetadata("services", await getPage("services"));
}


export default async function ServicesPage() {
  const [page, services, serviceFaqs] = await Promise.all([getPage("services"), getServices(), getServiceFaqs()]);
  return (
    <>
      <PageHero
        title={page.hero.title}
        description={page.hero.description}
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
          <SectionHeading eyebrow={page.faqs.eyebrow} title={page.faqs.title} />
          <div className="mt-10">
            <FaqAccordion faqs={serviceFaqs} />
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
