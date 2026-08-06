import Image from "next/image";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import Container from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";

/** Home hero — "IELTS | Study Abroad" headline with dual CTAs (IDP pattern). */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950">
      <Container className="grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-primary-600 bg-primary-800/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-300">
            IELTS&nbsp;|&nbsp;Study Abroad
          </p>
          <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Invest in dreams build your career with{" "}
            <span className="text-accent-500">GlobalED</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-primary-100">
            From IELTS preparation to university admission and visa success —
            GlobalEd guides Bangladeshi students to 13 study destinations with
            free, honest counselling.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/consultation" size="lg">
              Book Free Consultation
              <ArrowRight size={18} aria-hidden />
            </ButtonLink>
            <ButtonLink href="/ielts" variant="white" size="lg">
              <BookOpenCheck size={18} aria-hidden />
              Book IELTS Test
            </ButtonLink>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-lg">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
            <Image
              src="/images/hero/home-hero.svg"
              alt="Bangladeshi students preparing to study abroad with GlobalEd"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
