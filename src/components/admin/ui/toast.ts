/**
 * Admin toast notifications ("Saved · View on site"). A tiny store outside
 * React, so a toast raised just before navigating (save → back to the list)
 * still shows on the next screen: <Toaster /> lives in the admin shell, which
 * stays mounted across admin pages.
 *
 *   toast.success("Post saved", { href: "/blogs/my-post", linkLabel: "View on site" });
 */

export interface ToastItem {
  id: number;
  kind: "success" | "error";
  message: string;
  href?: string;
  linkLabel?: string;
}

type Options = { href?: string; linkLabel?: string };

let items: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function dismissToast(id: number) {
  items = items.filter((t) => t.id !== id);
  emit();
}

function push(kind: ToastItem["kind"], message: string, options: Options = {}) {
  const item: ToastItem = { id: nextId++, kind, message, ...options };
  items = [...items.slice(-2), item]; // at most 3 on screen
  emit();
  setTimeout(() => dismissToast(item.id), kind === "error" ? 8000 : 5000);
}

export const toast = {
  success: (message: string, options?: Options) => push("success", message, options),
  error: (message: string, options?: Options) => push("error", message, options),
};

export function subscribeToasts(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getToasts() {
  return items;
}

const noToasts: ToastItem[] = [];
export function getServerToasts() {
  return noToasts;
}
