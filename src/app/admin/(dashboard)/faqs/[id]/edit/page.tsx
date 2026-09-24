import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import FaqForm from "@/components/admin/FaqForm";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("FAQS");
  if (!session) redirect("/admin");

  const { id } = await params;
  const faq = await prisma.faq.findUnique({ where: { id } });
  if (!faq) notFound();

  return (
    <div>
      <AdminPageHeader
        title="Edit Question"
        description={faq.question}
        breadcrumbs={[{ label: "FAQs", href: "/admin/faqs" }]}
        status={faq.shown ? "published" : "hidden"}
        viewHref={faq.shown ? "/faqs" : undefined}
      />
      <div className="max-w-3xl">
        <FaqForm
          mode="edit"
          faqId={faq.id}
          defaultValues={{
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            showOnServices: faq.showOnServices,
            shown: faq.shown,
          }}
        />
      </div>
    </div>
  );
}
