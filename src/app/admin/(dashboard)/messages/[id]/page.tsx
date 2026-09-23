import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Reply } from "lucide-react";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/authz";
import StatusControl from "@/components/admin/StatusControl";
import { messageStatusOptions } from "@/lib/inbox";

export default async function AdminMessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("MESSAGES");
  if (!session) redirect("/admin");

  const { id } = await params;
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) notFound();

  const replyHref = `mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`;

  return (
    <div className="max-w-2xl">
      <Link href="/admin/messages" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary-700">
        <ArrowLeft size={16} aria-hidden /> Back to Messages
      </Link>

      <h1 className="mt-4 font-heading text-2xl font-bold text-primary-900">{message.subject}</h1>
      <p className="mt-1 text-sm text-neutral-500">
        From <span className="font-medium text-neutral-800">{message.name}</span> ({message.email}) ·{" "}
        {message.createdAt.toLocaleString("en-GB")}
      </p>

      <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-6">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">{message.message}</p>
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-6">
        <StatusControl
          endpoint={`/api/admin/messages/${message.id}`}
          status={message.status}
          options={messageStatusOptions}
        />
        <a
          href={replyHref}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-800"
        >
          <Reply size={16} aria-hidden />
          Reply by email
        </a>
      </div>
      <p className="mt-2 text-xs text-neutral-500">After replying, set the status to “Replied”.</p>
    </div>
  );
}
