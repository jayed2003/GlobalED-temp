import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import TestimonialForm from "@/components/admin/TestimonialForm";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";

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
      <AdminPageHeader
        title={testimonial.studentName}
        breadcrumbs={[{ label: "Reviews", href: "/admin/testimonials" }]}
      />
      <div className="max-w-xl">
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
