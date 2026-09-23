import { serializeJsonLd } from "@/lib/json-ld";

/** Renders a JSON-LD structured data script tag (HTML-safe encoded). */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
