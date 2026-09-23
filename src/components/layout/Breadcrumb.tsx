import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import JsonLd from "@/components/ui/JsonLd";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.globaled.com.bd";

/** Visual breadcrumb trail + BreadcrumbList JSON-LD (for inner pages). */
export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const trail = [{ label: "Home", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm">
          {trail.map((item, index) => {
            const isLast = index === trail.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight size={14} aria-hidden className="text-primary-300" />
                )}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 text-primary-200 transition-colors hover:text-white"
                  >
                    {index === 0 && <Home size={14} aria-hidden />}
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white">
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={jsonLd} />
    </>
  );
}
