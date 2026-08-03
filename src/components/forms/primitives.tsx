import { Loader2 } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Shared field styling for all form controls. */
export const fieldClasses =
  "w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:cursor-not-allowed disabled:bg-neutral-50 aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-100";

/** Label + control + inline error wrapper. */
export function FormField({
  id,
  label,
  required,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-primary-900">
        {label}
        {required && (
          <span className="ml-0.5 text-red-500" aria-hidden>
            *
          </span>
        )}
        {required && <span className="sr-only">(required)</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={fieldClasses} {...props} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={fieldClasses} {...props} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={4} className={fieldClasses} {...props} />;
}

/** Submit button with built-in loading state. */
export function SubmitButton({
  loading,
  children,
}: {
  loading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={cn(
        buttonClasses({ size: "lg" }),
        "w-full disabled:cursor-not-allowed disabled:opacity-60",
      )}
    >
      {loading ? (
        <>
          <Loader2 size={18} aria-hidden className="animate-spin" />
          Submitting…
        </>
      ) : (
        children
      )}
    </button>
  );
}

/** Success / error feedback banner after submission. */
export function FormStatus({
  status,
  message,
}: {
  status: "success" | "error" | null;
  message?: string;
}) {
  if (!status) return null;
  return (
    <div
      role="status"
      className={cn(
        "rounded-lg border p-4 text-sm leading-relaxed",
        status === "success"
          ? "border-green-200 bg-green-50 text-green-800"
          : "border-red-200 bg-red-50 text-red-800",
      )}
    >
      {message}
    </div>
  );
}

/** Invisible honeypot field — bots fill it, humans never see it. */
export function Honeypot({ registration }: { registration: UseFormRegisterReturn }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="company">Company</label>
      <input id="company" type="text" tabIndex={-1} autoComplete="off" {...registration} />
    </div>
  );
}
