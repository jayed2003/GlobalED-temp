import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { buildNavItems } from "@/data/navigation";
import { getAllDestinations } from "@/lib/content/destinations";
import { getAllCourses } from "@/lib/content/courses";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [destinations, courses] = await Promise.all([getAllDestinations(), getAllCourses()]);
  const navItems = buildNavItems(destinations, courses);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-950"
      >
        Skip to content
      </a>
      <TopBar />
      <Navbar navItems={navItems} />
      <main id="main-content">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <ScrollToTop />
    </>
  );
}
