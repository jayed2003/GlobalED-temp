import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CtaBanner from "@/components/sections/CtaBanner";
import BranchCard from "@/components/cards/BranchCard";
import ContactForm from "@/components/forms/ContactForm";
import Container from "@/components/layout/Container";
import { getBranches, getSiteSettings, telHref } from "@/lib/content/settings";
import { editablePageMetadata, getPage } from "@/lib/content/pages";

export async function generateMetadata(): Promise<Metadata> {
  return editablePageMetadata("contact", await getPage("contact"));
}

export default async function ContactPage() {
  const page = await getPage("contact");
  const [site, branches] = await Promise.all([getSiteSettings(), getBranches()]);
  return (
    <>
      <PageHero
        title={page.hero.title}
        description={page.hero.description}
        breadcrumb={[{ label: "Contact" }]}
      />

      {/* Branches with maps */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {branches.map((branch) => (
              <BranchCard key={branch.name} branch={branch} />
            ))}
          </div>
        </Container>
      </section>

      {/* General contact + form */}
      <section className="bg-primary-50 py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-bold text-primary-900 sm:text-3xl">{page.form.title}</h2>
            <p className="mt-4 leading-relaxed text-neutral-600">{page.form.text}</p>
            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-700 text-white">
                  <Phone size={18} aria-hidden />
                </span>
                <div>
                  <p className="text-neutral-500">Call us</p>
                  <a
                    href={telHref(site.phone)}
                    className="font-semibold text-primary-900 hover:text-primary-700"
                  >
                    {site.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-700 text-white">
                  <Mail size={18} aria-hidden />
                </span>
                <div>
                  <p className="text-neutral-500">Email us</p>
                  <a
                    href={`mailto:${site.email}`}
                    className="font-semibold text-primary-900 hover:text-primary-700"
                  >
                    {site.email}
                  </a>
                </div>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            <ContactForm />
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
