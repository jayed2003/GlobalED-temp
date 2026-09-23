import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import type { Testimonial } from "@/types";

export const getAllTestimonials = unstable_cache(
  async (): Promise<Testimonial[]> => {
    const rows = await prisma.testimonial.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return rows.map((t) => ({
      studentName: t.studentName,
      reviewImage: t.reviewImage,
      reviewImageAlt: t.reviewImageAlt || `Review from ${t.studentName}, studying at ${t.university}`,
      university: t.university,
      country: t.country ?? undefined,
    }));
  },
  ["testimonials-all"],
  { tags: ["testimonials"] },
);
