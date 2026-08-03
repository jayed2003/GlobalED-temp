"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import TestimonialCard from "@/components/cards/TestimonialCard";
import { testimonials } from "@/data/testimonials";

/** Success stories carousel — scroll-snap track with prev/next controls. */
export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const width = card ? card.offsetWidth + 24 : 320;
    track.scrollBy({ left: direction * width, behavior: "smooth" });
  };

  return (
    <section className="bg-primary-50 py-16 sm:py-24">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            align="left"
            eyebrow="Success Stories & Reviews"
            title="Loved by Our Students"
            description="Real reviews from students now studying at universities across the globe."
          />
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Previous testimonials"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-200 bg-white text-primary-700 transition-colors hover:bg-primary-700 hover:text-white"
            >
              <ChevronLeft size={20} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Next testimonials"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-200 bg-white text-primary-700 transition-colors hover:bg-primary-700 hover:text-white"
            >
              <ChevronRight size={20} aria-hidden />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.studentName}
              data-card
              className="w-full shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
