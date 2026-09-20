import TestimonialsCarousel from "@/components/sections/TestimonialsCarousel";
import { getAllTestimonials } from "@/lib/content/testimonials";

/** "Loved by Our Students" — reads reviews managed in the admin panel. Hidden when there are none. */
export default async function Testimonials() {
  const testimonials = await getAllTestimonials();
  if (testimonials.length === 0) return null;
  return <TestimonialsCarousel testimonials={testimonials} />;
}
