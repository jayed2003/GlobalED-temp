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
