import { NextResponse } from "next/server";
import { sendContactNotification } from "@/lib/email";
import { contactRequestSchema } from "@/lib/validation/public-forms";
import { checkRateLimits, getClientIp, tooManyRequests } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const limit = await checkRateLimits([
    ["contactBurst", ip],
    ["contactDaily", ip],
  ]);
  if (!limit.success) return tooManyRequests(limit.retryAfter);

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const parsed = contactRequestSchema.safeParse(body);
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
