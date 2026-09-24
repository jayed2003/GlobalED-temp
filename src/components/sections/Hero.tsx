import Image from "next/image";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import Container from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { isOriginalUpload } from "@/lib/images";
import type { PageContent } from "@/lib/pages";

/** Home hero — "IELTS | Study Abroad" headline with dual CTAs (IDP pattern). */
/** Home hero. Text and image come from Admin → Pages → Home; the buttons stay as designed. */
export default function Hero({ content }: { content: PageContent<"home">["hero"] }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950">
      <Container className="grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          {content.eyebrow && (
            <p className="inline-flex items-center gap-2 rounded-full border border-primary-600 bg-primary-800/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-300">
              {content.eyebrow}
            </p>
          )}
          <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {content.headline}{" "}
            <Image
              src="/images/logos/logo-02.png"
              alt="GlobalED"
              width={509}
              height={100}
              priority
              className="ml-1 inline-block h-9 w-auto -translate-y-1.5 align-middle sm:h-11 sm:-translate-y-2 lg:h-12 lg:-translate-y-2.5"
            />
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-primary-100">{content.text}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/consultation" size="lg">
              Book Free Consultation
              <ArrowRight size={18} aria-hidden />
            </ButtonLink>
            <ButtonLink href="/courses" variant="white" size="lg">
              <BookOpenCheck size={18} aria-hidden />
              Browse Courses
            </ButtonLink>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-lg">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
            <Image
              src={content.image.src}
              alt={content.image.alt}
              fill
              priority
              unoptimized={isOriginalUpload(content.image.src)}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
