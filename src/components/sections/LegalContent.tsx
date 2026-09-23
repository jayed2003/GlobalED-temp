import Link from "next/link";
import Container from "@/components/layout/Container";
import { legalLinks, type LegalBlock, type LegalDocument } from "@/data/legal";
import { formatDate } from "@/lib/validation/dates";

function Block({ block }: { block: LegalBlock }) {
  if ("subheading" in block) {
    return <h3 className="mt-5 font-heading text-base font-semibold text-primary-900">{block.subheading}</h3>;
  }
  if ("list" in block) {
    return (
      <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-neutral-700 marker:text-accent-500">
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p className="mt-3 leading-relaxed text-neutral-700">{block.p}</p>;
}

/** Body of the Privacy Policy / Terms & Conditions / Return and Refund Policy pages. */
export default function LegalContent({ doc, currentHref }: { doc: LegalDocument; currentHref: string }) {
  const others = legalLinks.filter((l) => l.href !== currentHref);

  return (
    <section className="py-16 sm:py-20">
      <Container>
        {/* Width limit on an inner div: Container's cn() doesn't merge max-w classes. */}
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-neutral-500">Last updated: {formatDate(doc.lastUpdated)}</p>
          {doc.intro && <p className="mt-4 text-lg leading-relaxed text-neutral-700">{doc.intro}</p>}

          <div className="mt-10 space-y-10">
            {doc.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="font-heading text-xl font-bold text-primary-900">{section.heading}</h2>
                {section.blocks.map((block, i) => (
                  <Block key={i} block={block} />
                ))}
              </div>
            ))}
          </div>

          <p className="mt-12 border-t border-neutral-200 pt-6 text-sm text-neutral-600">
            See also our{" "}
            {others.map((link, i) => (
              <span key={link.href}>
                {i > 0 && " and "}
                <Link href={link.href} className="font-medium text-primary-700 underline-offset-2 hover:underline">
                  {link.label}
                </Link>
              </span>
            ))}
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
