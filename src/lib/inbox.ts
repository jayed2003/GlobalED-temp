/**
 * Status labels and badge styles for the admin inboxes (leads and contact
 * messages). The stored value NEW is shown as "Pending" (not yet contacted /
 * replied): "New" is reserved for the unread badge, which disappears once an
 * admin opens the item.
 */

export const leadStatusOptions = [
  { value: "NEW", label: "Pending" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "CLOSED", label: "Closed" },
];

export const messageStatusOptions = [
  { value: "NEW", label: "Pending" },
  { value: "REPLIED", label: "Replied" },
  { value: "CLOSED", label: "Closed" },
];

export const statusBadgeStyles: Record<string, string> = {
  NEW: "bg-amber-50 text-amber-700",
  CONTACTED: "bg-blue-50 text-blue-700",
  REPLIED: "bg-blue-50 text-blue-700",
  CLOSED: "bg-neutral-100 text-neutral-500",
};

export function statusLabel(options: { value: string; label: string }[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}
