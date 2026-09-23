import { NextResponse } from "next/server";
import { leadRequestSchema } from "@/lib/validation/public-forms";
import { prisma } from "@/lib/db";
import { sendConsultationConfirmation, sendNewLeadNotification } from "@/lib/email";
import { checkRateLimits, getClientIp, tooManyRequests } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

const TURNSTILE_FAILED = "The security check didn't go through. Please complete it again and resubmit.";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const limit = await checkRateLimits([
    ["leadBurst", ip],
    ["leadDaily", ip],
  ]);
  if (!limit.success) return tooManyRequests(limit.retryAfter);

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  // Strict: a flat object of plain-text strings only (see public-forms.ts).
  const parsed = leadRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission" }, { status: 400 });
  }
  const data = parsed.data;

  // Honeypot filled — bot. Silently report success without saving/emailing.
  if (data.company) {
    return NextResponse.json({ success: true });
  }

  if (!(await verifyTurnstile(data.turnstileToken, ip, "lead"))) {
    return NextResponse.json({ error: TURNSTILE_FAILED }, { status: 400 });
  }

  let destinationId: string | undefined;
  let destinationOther: string | undefined;
  if (data.destination === "not-sure") {
    destinationOther = "Not sure yet";
  } else if (data.destination) {
    const dest = await prisma.destination.findUnique({ where: { slug: data.destination } });
    if (dest) destinationId = dest.id;
    else destinationOther = data.destination;
  }

  let courseId: string | undefined;
  if (data.course && data.course !== "no-course") {
    const course = await prisma.course.findUnique({ where: { slug: data.course } });
    if (course) courseId = course.id;
  }

  const lead = await prisma.lead.create({
    data: {
      formType: data.formType,
      name: data.name,
      phone: data.phone,
      email: data.email,
      branch: data.branch,
      destinationId,
      destinationOther,
      studyLevel: data.studyLevel || undefined,
      ieltsStatus: data.ieltsStatus || undefined,
      funding: data.funding || undefined,
      courseId,
      preferredDate: data.preferredDate ? new Date(data.preferredDate) : undefined,
      message: data.message || undefined,
    },
    include: { destination: { select: { name: true } }, course: { select: { title: true } } },
  });

  // Student confirmation + company alert, in parallel. Either failing never
  // affects the other or the saved lead (both helpers log and return).
  const [confirmation] = await Promise.allSettled([
    sendConsultationConfirmation({ name: data.name, email: data.email, formType: data.formType }),
    sendNewLeadNotification({
      id: lead.id,
      formType: data.formType,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      branch: lead.branch,
      destination: lead.destination?.name ?? lead.destinationOther,
      course: lead.course?.title,
      studyLevel: lead.studyLevel,
      ieltsStatus: lead.ieltsStatus,
      funding: lead.funding,
      preferredDate: data.preferredDate || null,
      message: lead.message,
    }),
  ]);

  return NextResponse.json({
    success: true,
    emailSent: confirmation.status === "fulfilled" && confirmation.value.sent,
  });
}
