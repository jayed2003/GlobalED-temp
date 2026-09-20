import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactNotification } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(100),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().min(2, "Please enter a subject").max(200),
  message: z.string().min(10, "Please write a short message").max(1000),
  company: z.string().optional().default(""), // honeypot
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission" }, { status: 400 });
  }
  const data = parsed.data;

  if (data.company) {
    return NextResponse.json({ success: true });
  }

  const result = await sendContactNotification(data);
  return NextResponse.json({ success: true, emailSent: result.sent });
}
