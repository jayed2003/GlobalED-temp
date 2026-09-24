import TestimonialsCarousel from "@/components/sections/TestimonialsCarousel";
import { getAllTestimonials } from "@/lib/content/testimonials";
import type { HeadingContent } from "@/lib/pages";

/** "Loved by Our Students" — reads reviews managed in the admin panel. Hidden when there are none. */
export default async function Testimonials({ heading }: { heading: HeadingContent }) {
  const testimonials = await getAllTestimonials();
  if (testimonials.length === 0) return null;
  return <TestimonialsCarousel testimonials={testimonials} heading={heading} />;
}
