/**
 * Form submissions route to our own backend now: consultation/IELTS leads
 * are persisted to the database and trigger a confirmation email (see
 * /api/leads); general contact enquiries are relayed by email only (see
 * /api/contact). Both endpoints fall back to a simulated "sent" outcome
 * when RESEND_API_KEY isn't configured yet — the lead is still saved either
 * way, only the confirmation email is skipped.
 *
 * To swap email provider, change src/lib/email.ts only.
 */

export interface FormSubmitResult {
  success: boolean;
  message: string;
}

export async function submitLeadForm(payload: Record<string, string>): Promise<FormSubmitResult> {
  const isLead = payload.formType === "GENERAL" || payload.formType === "IELTS";
  const endpoint = isLead ? "/api/leads" : "/api/contact";
  const successMessage = isLead
    ? "Thank you! Our counsellor will contact you within 24 hours."
    : "Thank you for contacting GlobalEd. We will respond as soon as possible.";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => null)) as { success?: boolean; error?: string } | null;

    if (response.ok && data?.success) {
      return { success: true, message: successMessage };
    }

    return {
      success: false,
      message: data?.error ?? "Something went wrong. Please try again or call us directly.",
    };
  } catch {
    return {
      success: false,
      message: "Network error — please check your connection and try again, or reach us on WhatsApp.",
    };
  }
}
