import { GraduationCap } from "lucide-react";
import Container from "@/components/layout/Container";
import { getAllDestinations } from "@/lib/content/destinations";

/** Infinite-scrolling partner university strip (PFEC / IECC logo marquee). */
export default async function PartnerMarquee() {
  const destinations = await getAllDestinations();
  const partners = destinations
    .flatMap((d) => d.popularUniversities.slice(0, 1).map((u) => u.name))
    .slice(0, 10);

  return (
    <section aria-label="Partner universities" className="border-y border-neutral-100 bg-white py-10">
      <Container>
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-neutral-500">
          Our Partner Universities Worldwide
        </p>
      </Container>
      <div className="mt-6 overflow-hidden" aria-hidden>
        <div className="flex w-max animate-marquee gap-12 pr-12">
          {[...partners, ...partners].map((name, index) => (
            <span
              key={`${name}-${index}`}
              className="flex items-center gap-2 whitespace-nowrap font-heading text-lg font-semibold text-neutral-400"
            >
              <GraduationCap size={18} className="text-primary-300" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
