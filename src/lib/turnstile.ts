/**
 * Cloudflare Turnstile — server-side token verification for the public forms.
 *
 * Keys come from the Cloudflare dashboard (Turnstile → Add widget, with the
 * site's domains listed under Hostnames — Cloudflare only issues tokens on
 * those hosts). Outside production, Cloudflare's official always-pass test
 * keys are used when none are configured, so local dev works out of the box.
 * In production a missing secret fails closed: forms are refused rather than
 * silently accepted without a bot check.
 */

// https://developers.cloudflare.com/turnstile/troubleshooting/testing/
export const TURNSTILE_TEST_SITE_KEY = "1x00000000000000000000AA";
const TURNSTILE_TEST_SECRET_KEY = "1x0000000000000000000000000000000AA";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Which form a token was issued for — checked so a token can't be replayed on another form. */
export type TurnstileAction = "lead" | "contact";

function secretKey(): string | undefined {
  if (process.env.TURNSTILE_SECRET_KEY) return process.env.TURNSTILE_SECRET_KEY;
  return process.env.NODE_ENV === "production" ? undefined : TURNSTILE_TEST_SECRET_KEY;
}

interface SiteverifyResponse {
  success: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
}

export async function verifyTurnstile(token: string, ip: string, action: TurnstileAction): Promise<boolean> {
  const secret = secretKey();
  if (!secret) {
    console.error("[turnstile] TURNSTILE_SECRET_KEY is not set — rejecting form submission.");
    return false;
  }
  if (!token || token.length > 2048) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip && ip !== "unknown") body.set("remoteip", ip);

  try {
    const res = await fetch(VERIFY_URL, { method: "POST", body, signal: AbortSignal.timeout(5000) });
    const data = (await res.json()) as SiteverifyResponse;
    if (!data.success) {
      console.warn("[turnstile] verification failed", data["error-codes"]);
      return false;
    }
    // Test keys don't echo the action; real keys do, and it must match.
    if (secret !== TURNSTILE_TEST_SECRET_KEY && data.action !== action) {
      console.warn("[turnstile] action mismatch", { expected: action, got: data.action });
      return false;
    }
    return true;
  } catch (err) {
    console.error("[turnstile] siteverify request failed", err);
    return false;
  }
}
