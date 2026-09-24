import { cn } from "@/lib/utils";

/** Admin button styles: one primary action per screen, quiet secondary ones. */
export function adminButton(variant: "primary" | "secondary" | "danger" | "ghost" = "secondary", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-60",
    // Same brand green as the admin's other main buttons ("Add Post", "Sign in").
    variant === "primary" && "bg-accent-500 text-primary-950 shadow-sm hover:bg-accent-400",
    variant === "secondary" && "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50",
    variant === "danger" && "border border-red-200 bg-white text-red-700 hover:bg-red-50",
    variant === "ghost" && "text-neutral-600 hover:bg-neutral-100",
    className,
  );
}
