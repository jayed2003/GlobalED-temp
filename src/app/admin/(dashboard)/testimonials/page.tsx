import Image from "next/image";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminTable from "@/components/admin/AdminTable";
import { isOriginalUpload } from "@/lib/images";

export default async function AdminTestimonialsPage() {
  const session = await requirePermission("TESTIMONIALS");
  if (!session) redirect("/admin");

  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const rows = testimonials.map((t) => ({
    id: t.id,
    cells: [
      <span key="img" className="relative block h-12 w-12 overflow-hidden rounded-md bg-neutral-100">
        <Image src={t.reviewImage} alt={t.reviewImageAlt || `Review from ${t.studentName}`} fill className="object-cover" sizes="48px" unoptimized={isOriginalUpload(t.reviewImage)} />
      </span>,
      t.studentName,
      t.university,
      t.country ?? "—",
      String(t.sortOrder),
    ],
    editHref: `/admin/testimonials/${t.id}/edit`,
    deleteEndpoint: `/api/admin/testimonials/${t.id}`,
    label: t.studentName,
  }));

  return (
    <AdminTable
      title="Reviews"
      newHref="/admin/testimonials/new"
      newLabel="Add Review"
      columnHeaders={["Image", "Student", "University", "Country", "Order"]}
      rows={rows}
    />
  );
}
