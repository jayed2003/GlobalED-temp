/**
 * Frontend-only form submission via Web3Forms (https://web3forms.com).
 * Submissions are delivered to the company email inbox — no backend needed.
 *
 * The access key lives in NEXT_PUBLIC_WEB3FORMS_KEY. Until the company
 * provides a key, forms run in demo mode (simulated success) so the UX
 * can be reviewed end-to-end.
 *
 * To swap provider (Formspree, Resend, ...), change this file only.
 */

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export interface FormSubmitResult {
  success: boolean;
  message: string;
}

export async function submitLeadForm(
  payload: Record<string, string>,
): Promise<FormSubmitResult> {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

  // Demo mode — no access key configured yet
  if (!accessKey) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      success: true,
      message:
        "Thank you! Your submission has been received. (Demo mode — form delivery activates once the access key is configured.)",
    };
  }

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: accessKey, ...payload }),
    });

    const data = (await response.json()) as { success: boolean; message?: string };

    if (response.ok && data.success) {
      return {
        success: true,
        message: "Thank you! Our counsellor will contact you within 24 hours.",
      };
    }

    return {
      success: false,
      message:
        data.message ?? "Something went wrong. Please try again or call us directly.",
    };
  } catch {
    return {
      success: false,
      message:
        "Network error — please check your connection and try again, or reach us on WhatsApp.",
    };
  }
}
