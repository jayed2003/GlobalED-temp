import { NextResponse } from "next/server";
import { leadRequestSchema } from "@/lib/validation/public-forms";
import { prisma } from "@/lib/db";
import { sendConsultationConfirmation } from "@/lib/email";

export async function POST(request: Request) {
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

  await prisma.lead.create({
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
  });

  const emailResult = await sendConsultationConfirmation({
    name: data.name,
    email: data.email,
    formType: data.formType,
  });

  return NextResponse.json({ success: true, emailSent: emailResult.sent });
}
