import { notFound } from "next/navigation";

// Unknown /admin/* URLs: show the admin "Not found" screen inside the shell
// (only reachable when signed in — the proxy sends everyone else to login).
export default function UnknownAdminPage() {
  notFound();
}
