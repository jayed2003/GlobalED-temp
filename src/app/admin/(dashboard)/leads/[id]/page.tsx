import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import StatusControl from "@/components/admin/StatusControl";
import ReadStateControl from "@/components/admin/ReadStateControl";
import { leadStatusOptions } from "@/lib/inbox";

const formTypeLabels: Record<string, string> = { GENERAL: "Free Consultation", IELTS: "IELTS Booking" };

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">{label}</p>
      <p className="mt-0.5 text-sm text-neutral-800">{value}</p>
    </div>
  );
}

export default async function AdminLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("LEADS");
  if (!session) redirect("/admin");

  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { destination: true, course: true },
  });
  if (!lead) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/leads" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary-700">
        <ArrowLeft size={16} aria-hidden /> Back to Leads
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold text-primary-900">{lead.name}</h1>
        <span className="shrink-0 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
          {formTypeLabels[lead.formType]}
        </span>
      </div>

      <div className="mt-6 grid gap-5 rounded-xl border border-neutral-200 bg-white p-6 sm:grid-cols-2">
        <Field label="Phone" value={lead.phone} />
        <Field label="Email" value={lead.email} />
        <Field label="Branch" value={lead.branch} />
        <Field label="Destination" value={lead.destination?.name ?? lead.destinationOther} />
        <Field label="Course" value={lead.course?.title} />
        <Field label="Study Level" value={lead.studyLevel} />
        <Field label="IELTS Status" value={lead.ieltsStatus} />
        <Field label="Funding Plan" value={lead.funding} />
        <Field label="Preferred Date" value={lead.preferredDate?.toLocaleDateString("en-GB")} />
        <Field label="Received" value={lead.createdAt.toLocaleString("en-GB")} />
      </div>

      {lead.message && (
        <div className="mt-5 rounded-xl border border-neutral-200 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Message</p>
          <p className="mt-1.5 whitespace-pre-wrap text-sm text-neutral-700">{lead.message}</p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-6">
        <StatusControl endpoint={`/api/admin/leads/${lead.id}`} status={lead.status} options={leadStatusOptions} />
        <ReadStateControl endpoint={`/api/admin/leads/${lead.id}`} read={!!lead.readAt} />
      </div>
    </div>
  );
}
