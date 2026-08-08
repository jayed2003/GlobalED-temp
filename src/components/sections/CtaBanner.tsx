import { ArrowRight, MessageCircle } from "lucide-react";
import Container from "@/components/layout/Container";
import { ButtonLink, buttonClasses } from "@/components/ui/Button";
import { site } from "@/data/site";

/** Full-width consultation call-to-action banner — appears on every page. */
export default function CtaBanner() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="rounded-3xl bg-gradient-to-r from-primary-800 to-primary-950 px-6 py-14 text-center shadow-xl sm:px-12">
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            Book Your Free Consultation Today
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-primary-100">
            Talk to an expert counsellor about your study abroad plan —
            completely free, no obligations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/get-started" size="lg">
              Get Started Free
              <ArrowRight size={18} aria-hidden />
            </ButtonLink>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ variant: "white", size: "lg" })}
            >
              <MessageCircle size={18} aria-hidden />
              WhatsApp Us
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
