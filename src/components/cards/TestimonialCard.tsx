import Image from "next/image";
import { Star } from "lucide-react";
import type { Testimonial } from "@/types";
import { cn } from "@/lib/utils";

/** Student review card with star rating, quote, and university (NWC pattern). */
export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div
        className="flex gap-0.5"
        role="img"
        aria-label={`Rated ${testimonial.rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            aria-hidden
            className={cn(
              i < testimonial.rating
                ? "fill-accent-500 text-accent-500"
                : "fill-neutral-200 text-neutral-200",
            )}
          />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-neutral-700">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-neutral-100 pt-4">
        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
          <Image
            src={testimonial.photo}
            alt=""
            fill
            className="object-cover"
            sizes="44px"
          />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary-900">{testimonial.studentName}</p>
          <p className="truncate text-xs text-neutral-500">
            {testimonial.university}, {testimonial.country}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
