import type { Metadata } from "next";

// Keep every admin screen (login included) out of search results. This is
// paired with an X-Robots-Tag header in next.config.ts; robots.txt deliberately
// does NOT mention /admin, so it doesn't advertise where the panel lives.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
