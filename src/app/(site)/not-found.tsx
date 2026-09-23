import type { Metadata } from "next";
import { Compass } from "lucide-react";
import Container from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * Branded 404, rendered inside the site layout (navbar + footer) for any
 * unknown public URL — see [...slug]/page.tsx — and for unknown blog, course,
 * destination, event and service slugs, whose pages call notFound().
 */
export default function NotFound() {
  return (
    <section className="py-24 sm:py-32">
      <Container className="text-center">
        <Compass size={56} aria-hidden className="mx-auto text-primary-300" />
        <h1 className="mt-6 font-heading text-5xl font-bold text-primary-900">404</h1>
        <p className="mt-3 text-lg text-neutral-600">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/">Back to Home</ButtonLink>
          <ButtonLink href="/consultation" variant="outline">
            Free Consultation
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
