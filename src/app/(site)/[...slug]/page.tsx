import { notFound } from "next/navigation";

// Catch-all: any public URL that no other route matches renders the site's
// branded 404 (with navbar and footer) and a real 404 status.
export default function UnknownPage() {
  notFound();
}
