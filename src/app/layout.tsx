import type { Metadata } from "next";
import { DM_Sans, Raleway } from "next/font/google";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import ScrollToTop from "@/components/layout/ScrollToTop";
import "./globals.css";

// Brand guideline: DM Sans (headings/brand), Arial (body — system font, no
// import needed), Raleway (secondary titles).
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.globaled.com.bd",
  ),
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
    images: [
      {
        url: "/images/og-default.svg",
        width: 1200,
        height: 630,
        alt: "GlobalEd — IELTS & Study Abroad Consultancy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${raleway.variable}`}>
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-950"
        >
          Skip to content
        </a>
        <TopBar />
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <ScrollToTop />
      </body>
    </html>
  );
}
