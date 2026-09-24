import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import CtaBanner from "@/components/sections/CtaBanner";
import FaqFilter from "@/components/sections/FaqFilter";
import Container from "@/components/layout/Container";
import { faqs } from "@/data/faqs";
import { editablePageMetadata, getPage } from "@/lib/content/pages";

export async function generateMetadata(): Promise<Metadata> {
  return editablePageMetadata("faqs", await getPage("faqs"));
}

export default async function FaqsPage() {
  const page = await getPage("faqs");
  return (
    <>
      <PageHero
        title={page.hero.title}
        description={page.hero.description}
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