import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import TestimonialForm from "@/components/admin/TestimonialForm";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("TESTIMONIALS");
  if (!session) redirect("/admin");

  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();
  const others = await prisma.testimonial.findMany({
    where: { id: { not: id } },
    select: { sortOrder: true, studentName: true },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-900">Edit {testimonial.studentName}</h1>
      <div className="mt-6 max-w-xl">
        <TestimonialForm
          mode="edit"
          takenOrders={others.map((t) => ({ order: t.sortOrder, name: t.studentName }))}
          testimonialId={testimonial.id}
          defaultValues={{
            reviewImage: testimonial.reviewImage,
            reviewImageAlt: testimonial.reviewImageAlt || `Review from ${testimonial.studentName}`,
            studentName: testimonial.studentName,
            university: testimonial.university,
            country: testimonial.country ?? "",
            sortOrder: testimonial.sortOrder,
          }}
        />
      </div>
    </div>
  );
}
