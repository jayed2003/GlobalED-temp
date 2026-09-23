import { Resend } from "resend";

/**
 * Transactional email via Resend. Falls back to a no-op ("demo mode") when
 * RESEND_API_KEY isn't configured yet, so the rest of the flow (DB save,
 * form UX) can be reviewed end-to-end before a key exists.
 *
 * Note: resend.emails.send() does NOT throw on API-level errors (invalid
 * sender, sandbox restrictions, etc.) — it resolves with { data, error }.
 * Always check `error`, not just try/catch, or failures silently look like
 * successes.
 */
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "GlobalEd <onboarding@resend.dev>";
const COMPANY_EMAIL = process.env.COMPANY_NOTIFY_EMAIL ?? "info@globaled.io";

/**
 * Escape visitor-supplied text before it goes into an email's HTML body, so a
 * submitted "<img src=x onerror=...>" shows up as text instead of markup.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** escapeHtml + keep the visitor's line breaks. */
function escapeMultiline(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br>");
}

export async function sendConsultationConfirmation(params: {
  name: string;
  email: string;
  formType: "GENERAL" | "IELTS";
}): Promise<{ sent: boolean }> {
  if (!resend) return { sent: false };
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.email,
      subject:
        params.formType === "IELTS"
          ? "Your IELTS booking request — GlobalEd"
          : "Your free consultation request — GlobalEd",
      html: `<p>Hi ${escapeHtml(params.name)},</p><p>Thank you for ${
        params.formType === "IELTS"
          ? "booking your IELTS test/course"
          : "requesting a free consultation"
      } with GlobalEd. Our counsellor will contact you within 24 hours.</p><p>— The GlobalEd Team</p>`,
    });
    if (error) {
      console.error("Resend rejected the confirmation email", error);
      return { sent: false };
    }
    return { sent: true };
  } catch (err) {
    console.error("Failed to send confirmation email", err);
    return { sent: false };
  }
}

export async function sendContactNotification(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ sent: boolean }> {
  if (!resend) return { sent: false };
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: COMPANY_EMAIL,
      replyTo: params.email,
      subject: `Contact form: ${params.subject}`,
      html: `<p><strong>From:</strong> ${escapeHtml(params.name)} (${escapeHtml(params.email)})</p><p>${escapeMultiline(params.message)}</p>`,
    });
    if (error) {
      console.error("Resend rejected the contact notification", error);
      return { sent: false };
    }
    return { sent: true };
  } catch (err) {
    console.error("Failed to send contact notification", err);
    return { sent: false };
  }
}
