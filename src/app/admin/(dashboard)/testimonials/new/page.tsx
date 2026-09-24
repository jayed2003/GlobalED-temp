import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import TestimonialForm from "@/components/admin/TestimonialForm";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";

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
      <AdminPageHeader
        title="Add Review"
        breadcrumbs={[{ label: "Reviews", href: "/admin/testimonials" }]}
      />
      <div className="max-w-xl">
        <TestimonialForm
          mode="create"
          takenOrders={existing.map((t) => ({ order: t.sortOrder, name: t.studentName }))}
          defaultValues={{ reviewImage: "", reviewImageAlt: "", studentName: "", university: "", country: "", sortOrder: nextOrder }}
        />
      </div>
    </div>
  );
}
