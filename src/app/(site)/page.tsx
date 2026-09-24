import Hero from "@/components/sections/Hero";
import StatsBand from "@/components/sections/StatsBand";
import ServicesGrid from "@/components/sections/ServicesGrid";
import StepsTimeline from "@/components/sections/StepsTimeline";
import DestinationsGrid from "@/components/sections/DestinationsGrid";
import WhyGlobalEd from "@/components/sections/WhyGlobalEd";
import Testimonials from "@/components/sections/Testimonials";
import BlogsPreview from "@/components/sections/BlogsPreview";
import EventsTeaser from "@/components/sections/EventsTeaser";
import PartnerMarquee from "@/components/sections/PartnerMarquee";
import CtaBanner from "@/components/sections/CtaBanner";
import JsonLd from "@/components/ui/JsonLd";
import Reveal from "@/components/ui/Reveal";
import { getSiteSettings } from "@/lib/content/settings";
import { editablePageMetadata, getPage } from "@/lib/content/pages";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  return editablePageMetadata("home", await getPage("home"));
}

/** Home page — every section's text is edited in Admin → Pages → Home, and sections can be hidden there. */
export default async function Home() {
  const [site, page] = await Promise.all([getSiteSettings(), getPage("home")]);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: site.brandName,
          url: SITE_URL,
          description:
            "GlobalEd is a study abroad and IELTS preparation consultancy in Bangladesh.",
          email: site.email,
          telephone: site.phone,
          sameAs: Object.values(site.socials).filter(Boolean),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.brandName,
          url: SITE_URL,
        }}
      />
      {page.hero.shown && <Hero content={page.hero} />}
      {page.stats.shown && <StatsBand />}
      {page.services.shown && <ServicesGrid heading={page.services} />}
      {page.howItWorks.shown && <StepsTimeline content={page.howItWorks} />}
      {page.destinations.shown && <DestinationsGrid heading={page.destinations} />}
      {page.whyUs.shown && (
        <Reveal>
          <WhyGlobalEd content={page.whyUs} />
        </Reveal>
      )}
      {page.reviews.shown && (
        <Reveal>
          <Testimonials heading={page.reviews} />
        </Reveal>
      )}
      {page.blogs.shown && (
        <Reveal>
          <BlogsPreview heading={page.blogs} />
        </Reveal>
      )}
      {page.events.shown && (
        <Reveal>
          <EventsTeaser heading={page.events} />
        </Reveal>
      )}
      {page.partners.shown && (
        <Reveal>
          <PartnerMarquee title={page.partners.title} />
        </Reveal>
      )}
      {page.faqCta.shown && (
        <Reveal>
          <CtaBanner variant="faq" />
        </Reveal>
      )}
    </>
  );
}
