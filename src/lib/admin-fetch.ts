/**
 * Client-side counterpart of src/lib/api/admin-route.ts: every admin form,
 * table and upload field calls the admin API through adminRequest(), so all
 * failures (network down, session expired, validation, conflicts, rate
 * limits, server errors, non-JSON responses) come back as one shape with a
 * message that can be shown to the admin as-is.
 */

export type AdminResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string; field?: string };

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  json?: unknown;
  formData?: FormData;
}

function waitText(seconds: number): string {
  if (seconds < 60) return `${seconds} seconds`;
  const minutes = Math.ceil(seconds / 60);
  return minutes === 1 ? "1 minute" : `${minutes} minutes`;
}

function fallbackMessage(status: number, retryAfter: string | null): string {
  switch (status) {
    case 400:
      return "Some of the information is invalid. Please check the form and try again.";
    case 401:
      return "Your session has expired. Please sign in again.";
    case 403:
      return "You don't have permission to do this.";
    case 404:
      return "This item no longer exists. It may have been deleted — refresh the page.";
    case 409:
      return "This conflicts with an existing item.";
    case 413:
      return "This is too large to upload or save.";
    case 415:
      return "The request was sent in the wrong format.";
    case 429:
      return `Too many requests. Please wait ${waitText(Number(retryAfter) || 60)} and try again.`;
    default:
      return status >= 500
        ? "Something went wrong on the server. Please try again in a moment."
        : "Something went wrong. Please try again.";
  }
}

export async function adminRequest<T = unknown>(url: string, options: RequestOptions = {}): Promise<AdminResult<T>> {
  const { method = options.json !== undefined || options.formData ? "POST" : "GET", json, formData } = options;

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: json !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: json !== undefined ? JSON.stringify(json) : formData,
    });
  } catch {
    return { ok: false, status: 0, message: "Can't reach the server. Check your internet connection and try again." };
  }

  // Parse defensively: a proxy or platform error page may not be JSON.
  const text = await res.text().catch(() => "");
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }

  if (res.ok) return { ok: true, data: body as T };

  // Session expired or account removed: a full page load to the login screen
  // (not a client-side push) so no stale admin state survives.
  if (res.status === 401 && typeof window !== "undefined") {
    const login = new URL("/admin/login", window.location.origin);
    login.searchParams.set("expired", "1");
    login.searchParams.set("callbackUrl", window.location.pathname + window.location.search);
    window.location.assign(login.toString());
  }

  const err = (body && typeof body === "object" ? body : {}) as { error?: unknown; field?: unknown };
  return {
    ok: false,
    status: res.status,
    message: typeof err.error === "string" && err.error ? err.error : fallbackMessage(res.status, res.headers.get("Retry-After")),
    field: typeof err.field === "string" ? err.field : undefined,
  };
}
