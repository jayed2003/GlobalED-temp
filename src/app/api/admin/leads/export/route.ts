import { prisma } from "@/lib/db";
import { adminRoute } from "@/lib/api/admin-route";
import { buildWhere, parseListQuery } from "@/lib/admin-list/core";
import { leadsList } from "@/lib/admin-list/sections";
import { leadStatusOptions, statusLabel } from "@/lib/inbox";
import { todayInDhaka } from "@/lib/validation/dates";

/**
 * Leads as CSV — every lead matching the Leads page's current search, filters
 * and date range (the page passes its own query string), not just the page
 * on screen.
 */

// A cell starting with = + - @ (or tab/CR) is run as a formula by Excel and
// Sheets; prefix a quote so visitor-typed text can never become one.
function cell(value: unknown): string {
  let text = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function dhaka(date: Date | null, withTime: boolean): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(withTime ? { hour: "2-digit", minute: "2-digit", hour12: false } : {}),
  }).format(date);
}

export const GET = adminRoute({ permission: "LEADS" }, async ({ request }) => {
  const params = new URL(request.url).searchParams;
  const where = buildWhere(leadsList, parseListQuery(leadsList, params));
  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { destination: { select: { name: true } }, course: { select: { title: true } } },
  });

  const header = [
    "Received (Dhaka)", "Type", "Name", "Phone", "Email", "Branch", "Destination", "Course",
    "Study level", "IELTS status", "Funding", "Preferred date", "Message", "Status", "Read",
  ];
  const rows = leads.map((l) => [
    dhaka(l.createdAt, true),
    l.formType === "IELTS" ? "IELTS Booking" : "Consultation",
    l.name,
    l.phone,
    l.email,
    l.branch,
    l.destination?.name ?? l.destinationOther ?? "",
    l.course?.title ?? "",
    l.studyLevel ?? "",
    l.ieltsStatus ?? "",
    l.funding ?? "",
    l.preferredDate ? l.preferredDate.toISOString().slice(0, 10) : "",
    l.message ?? "",
    statusLabel(leadStatusOptions, l.status),
    l.readAt ? "Yes" : "No",
  ]);

  // BOM so Excel opens the UTF-8 file correctly (Bangla names included).
  const csv = String.fromCharCode(0xfeff) + [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${todayInDhaka()}.csv"`,
      "Cache-Control": "no-store",
    },
  });
});
