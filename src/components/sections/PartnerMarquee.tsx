import Image from "next/image";
import Container from "@/components/layout/Container";
import { getAllDestinations } from "@/lib/content/destinations";
import { isOriginalUpload } from "@/lib/images";
import { cn } from "@/lib/utils";

/** Seconds per logo, so the strip scrolls at the same speed however many logos there are. */
const SECONDS_PER_LOGO = 3;

/**
 * Infinite-scrolling strip of partner university logos (PFEC / IECC logo
 * marquee): every university on a published destination that has a logo, in
 * destination order. Logos are grey until hovered; hovering pauses the strip.
 * With reduced motion it's a still, wrapped grid.
 */
export default async function PartnerMarquee({ title }: { title: string }) {
  const destinations = await getAllDestinations();
  const partners: { name: string; logo: string }[] = [];
  const seen = new Set<string>();
  for (const university of destinations.flatMap((d) => d.popularUniversities)) {
    if (!university.logo || seen.has(university.name)) continue;
    seen.add(university.name);
    partners.push({ name: university.name, logo: university.logo });
  }
  if (partners.length === 0) return null;

  return (
    <section aria-label="Partner universities" className="border-y border-neutral-100 bg-white py-12">
      <Container>
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-neutral-500">
          {title}
        </p>
      </Container>
      <div className="group/marquee mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:px-4 motion-reduce:[mask-image:none]">
        <div
          className="flex w-max animate-marquee group-hover/marquee:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:animate-none motion-reduce:justify-center"
          style={{ animationDuration: `${partners.length * SECONDS_PER_LOGO}s` }}
        >
          {/* Two identical copies side by side; the animation slides by one copy, so it loops seamlessly. */}
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 || undefined}
              className={cn(
                "flex shrink-0 gap-4 pr-4 sm:gap-6 sm:pr-6 motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pr-0",
                copy === 1 && "motion-reduce:hidden",
              )}
            >
              {partners.map((partner) => (
                <li
                  key={partner.name}
                  className="group/logo flex h-20 w-44 items-center justify-center px-5 py-4 sm:h-24 sm:w-52"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={partner.logo}
                      unoptimized={isOriginalUpload(partner.logo)}
                      alt={copy === 0 ? partner.name : ""}
                      fill
                      sizes="176px"
                      className="object-contain opacity-70 grayscale transition duration-300 group-hover/logo:opacity-100 group-hover/logo:grayscale-0"
                    />
                  </div>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
