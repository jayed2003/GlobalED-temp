import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import TestimonialForm from "@/components/admin/TestimonialForm";

export default async function NewTestimonialPage() {
  const session = await requirePermission("TESTIMONIALS");
  if (!session) redirect("/admin");

  // Default to the lowest free display order (starts at 0).
  const existing = await prisma.testimonial.findMany({ select: { sortOrder: true, studentName: true } });
  const used = new Set(existing.map((t) => t.sortOrder));
  let nextOrder = 0;
  while (used.has(nextOrder)) nextOrder++;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-900">Add Review</h1>
      <div className="mt-6 max-w-xl">
        <TestimonialForm
          mode="create"
          takenOrders={existing.map((t) => ({ order: t.sortOrder, name: t.studentName }))}
          defaultValues={{ reviewImage: "", studentName: "", university: "", country: "", sortOrder: nextOrder }}
        />
      </div>
    </div>
  );
}
