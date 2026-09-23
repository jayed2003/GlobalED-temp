import type { Metadata } from "next";
import { DM_Sans, Noto_Sans_Bengali, Raleway } from "next/font/google";
import { connection } from "next/server";
import "./globals.css";
import { SITE_URL } from "@/lib/site-url";
import { DEFAULT_SHARE_IMAGE } from "@/lib/seo";

// Brand guideline: DM Sans (headings/brand), Arial (body — system font, no
// import needed), Raleway (secondary titles).
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
  display: "swap",
});

// Bangla text (blog posts can be written in Bangla). Only the Bengali
// character range is included, and it isn't preloaded: the browser fetches it
// only on pages that actually contain Bangla.
const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bengali",
  display: "swap",
  preload: false,
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GlobalEd | IELTS & Study Abroad Consultancy",
    template: "%s | GlobalEd",
  },
  description:
    "GlobalEd is a trusted study abroad and IELTS preparation consultancy in Bangladesh, guiding students to top destinations including the UK, USA, Canada, Australia, and Europe.",
  icons: {
    icon: "/favicon.ico",
    apple: "/images/logos/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "GlobalEd",
    title: "GlobalEd | IELTS & Study Abroad Consultancy",
    description:
      "Study abroad and IELTS preparation consultancy in Bangladesh — 13 destinations, 300+ partner universities, free counselling.",
    locale: "en_BD",
    images: [DEFAULT_SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_SHARE_IMAGE],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Render every page per request: the CSP nonce set in src/proxy.ts is new
  // on each request, and Next.js can only stamp it onto its scripts at render
  // time (prebuilt static HTML would carry no nonce and be blocked). Content
  // is still served from the unstable_cache data cache, so this stays fast.
  await connection();

  return (
    <html lang="en" className={`${dmSans.variable} ${raleway.variable} ${notoBengali.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
