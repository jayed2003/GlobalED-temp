import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import SiteIcon from "@/components/ui/SiteIcon";
import type { PageContent } from "@/lib/pages";

/** Home "Why GlobalEd" reasons — text and icons from Admin → Pages → Home. */
export default function WhyGlobalEd({ content }: { content: PageContent<"home">["whyUs"] }) {
  return (
    <section className="bg-primary-50 py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow={content.eyebrow} title={content.title} description={content.description} />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.reasons.map((reason, index) => (
            <Reveal key={`${index}-${reason.title}`} delay={index * 80}>
              <div className="h-full rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-700 text-white">
                  <SiteIcon name={reason.icon} size={22} aria-hidden />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-primary-900">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{reason.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
