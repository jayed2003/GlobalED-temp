import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

type Status = { type: "success" | "error"; message: string } | null;

/**
 * Show a failed admin API call on the form: the message in the form's status
 * box and, when the server named the offending field (e.g. a duplicate slug),
 * also inline under that field.
 */
export function showServerError<T extends FieldValues>(
  result: { message: string; field?: string },
  setError: UseFormSetError<T>,
  setStatus: (status: Status) => void,
) {
  if (result.field) setError(result.field as Path<T>, { type: "server", message: result.message });
  setStatus({ type: "error", message: result.message });
}

// First error message anywhere in a react-hook-form errors tree (including
// errors on nested list items, which have no inline field to show them).
function firstMessage(node: unknown): string | undefined {
  if (!node || typeof node !== "object") return undefined;
  const obj = node as Record<string, unknown>;
  if (typeof obj.message === "string" && obj.message) return obj.message;
  for (const [key, value] of Object.entries(obj)) {
    if (key === "ref") continue;
    const found = firstMessage(value);
    if (found) return found;
  }
  return undefined;
}

/** handleSubmit's onInvalid: explain why nothing was saved. */
export function onInvalidForm(setStatus: (status: Status) => void) {
  return (errors: unknown) => {
    const first = firstMessage(errors);
    setStatus({
      type: "error",
      message: first ? `Please fix the highlighted fields: ${first}` : "Please fix the highlighted fields.",
    });
  };
}
