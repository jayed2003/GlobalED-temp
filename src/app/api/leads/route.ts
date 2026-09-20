import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendConsultationConfirmation } from "@/lib/email";

const phoneRegex = /^(\+?880|0)1[3-9]\d{8}$/;

// Submitted as a flat Record<string,string> from the client (same convention
// the old Web3Forms relay used), so every field arrives as a string.
const leadSchema = z.object({
  formType: z.enum(["GENERAL", "IELTS"]),
  name: z.string().min(2, "Please enter your full name").max(100),
  phone: z.string().regex(phoneRegex, "Enter a valid BD number"),
  email: z.string().email("Enter a valid email address"),
  branch: z.string().min(1, "Please choose a branch"),
  destination: z.string().optional().default(""),
  studyLevel: z.string().optional().default(""),
  ieltsStatus: z.string().optional().default(""),
  funding: z.string().optional().default(""),
  course: z.string().optional().default(""),
  preferredDate: z.string().optional().default(""),
  message: z.string().max(1000).optional().default(""),
  consent: z.string().refine((v) => v === "true", "Please agree to be contacted"),
  company: z.string().optional().default(""), // honeypot
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const parsed = leadSchema.safeParse(body);
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
