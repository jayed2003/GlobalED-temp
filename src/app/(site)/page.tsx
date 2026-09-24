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
import type { Metadata } from "next";
import { DEFAULT_TITLE, pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  path: "/",
  title: { absolute: DEFAULT_TITLE },
  description:
    "GlobalEd is a trusted study abroad and IELTS preparation consultancy in Bangladesh, guiding students to top destinations including the UK, USA, Canada, Australia, and Europe.",
});

export default async function Home() {
  const site = await getSiteSettings();
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
      <Hero />
      <StatsBand />
      <ServicesGrid />
      <StepsTimeline />
      <DestinationsGrid />
      <Reveal>
        <WhyGlobalEd />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <BlogsPreview />
      </Reveal>
      <Reveal>
        <EventsTeaser />
      </Reveal>
      <Reveal>
        <PartnerMarquee />
      </Reveal>
      <Reveal>
        <CtaBanner variant="faq" />
      </Reveal>
    </>
  );
}
