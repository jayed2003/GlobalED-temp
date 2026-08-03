import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Destination } from "@/types";

/** Country card with image, tagline, and hover zoom (IECC pattern). */
export default function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group relative block overflow-hidden rounded-xl shadow-sm transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="relative aspect-[3/2]">
        <Image
          src={destination.heroImage}
          alt={`Study in ${destination.name}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-950/25 to-transparent" aria-hidden />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-heading text-lg font-semibold text-white">{destination.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-primary-100">{destination.tagline}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-accent-300">
          Explore
          <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
