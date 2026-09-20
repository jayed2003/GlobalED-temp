import Image from "next/image";
import type { Testimonial } from "@/types";

/** Student review card: full-width landscape review image, then name + university. */
export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const where = [testimonial.university, testimonial.country].filter(Boolean).join(", ");

  return (
    <figure className="flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="relative aspect-video w-full bg-neutral-50">
        <Image
          src={testimonial.reviewImage}
          alt={`Review from ${testimonial.studentName}, studying at ${testimonial.university}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <figcaption className="mt-auto px-6 py-5">
        <p className="text-base font-semibold text-primary-900">{testimonial.studentName}</p>
        <p className="font-secondary mt-1 text-sm font-medium leading-snug text-neutral-700">{where}</p>
      </figcaption>
    </figure>
  );
}
