import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, TrendingUp, Users2 } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Container from "@/components/layout/Container";
import BrandTitle from "@/components/ui/BrandTitle";
import { editablePageMetadata, getPage } from "@/lib/content/pages";

export async function generateMetadata(): Promise<Metadata> {
  return editablePageMetadata("about", await getPage("about"));
}

export default async function AboutPage() {
  const page = await getPage("about");
  // Where each card links stays as designed; the text is edited in Admin → Pages.
  const links = [
    { href: "/about/our-success", icon: TrendingUp, title: page.cards.successTitle, description: page.cards.successText },
    { href: "/about/our-organization", icon: Building2, title: page.cards.organizationTitle, description: page.cards.organizationText },
    { href: "/about/our-team", icon: Users2, title: page.cards.teamTitle, description: page.cards.teamText },
  ];

  return (
    <>
      <PageHero
        title={<BrandTitle text={page.hero.title} />}
        description={page.hero.description}
        breadcrumb={[{ label: "About Us" }]}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-colors hover:border-primary-200 hover:bg-primary-50"
              >
                <link.icon size={28} aria-hidden className="text-accent-600" />
                <h2 className="mt-3 font-heading text-lg font-semibold text-primary-900">
                  {link.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {link.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-700">
                  Learn more
                  <ArrowRight
                    size={14}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
