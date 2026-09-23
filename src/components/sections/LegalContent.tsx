import Link from "next/link";
import Container from "@/components/layout/Container";
import type { LegalDocument } from "@/data/legal";
import { formatDate } from "@/lib/validation/dates";

/** Body of the Privacy Policy / Terms & Conditions pages. */
export default function LegalContent({
  doc,
  related,
}: {
  doc: LegalDocument;
  related: { label: string; href: string };
}) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        {/* Width limit on an inner div: Container's cn() doesn't merge max-w classes. */}
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-neutral-500">Last updated: {formatDate(doc.lastUpdated)}</p>
          <p className="mt-4 text-lg leading-relaxed text-neutral-700">{doc.intro}</p>

          <div className="mt-10 space-y-10">
            {doc.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="font-heading text-xl font-bold text-primary-900">{section.heading}</h2>
                {section.paragraphs?.map((p) => (
                  <p key={p} className="mt-3 leading-relaxed text-neutral-700">
                    {p}
                  </p>
                ))}
                {section.list && (
                  <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-neutral-700 marker:text-accent-500">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.note && <p className="mt-3 leading-relaxed text-neutral-700">{section.note}</p>}
              </div>
            ))}
          </div>

          <p className="mt-12 border-t border-neutral-200 pt-6 text-sm text-neutral-600">
            See also our{" "}
            <Link href={related.href} className="font-medium text-primary-700 underline-offset-2 hover:underline">
              {related.label}
            </Link>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
