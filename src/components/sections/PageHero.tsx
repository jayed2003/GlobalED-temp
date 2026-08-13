import Breadcrumb, { type BreadcrumbItem } from "@/components/layout/Breadcrumb";
import Container from "@/components/layout/Container";

/** Standard inner-page hero: breadcrumb + title + description on navy gradient. */
export default function PageHero({
  title,
  description,
  breadcrumb,
}: {
  title: React.ReactNode;
  description?: string;
  breadcrumb: BreadcrumbItem[];
}) {
  return (
    <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 py-14 sm:py-20">
      <Container>
        <Breadcrumb items={breadcrumb} />
        <h1 className="mt-5 max-w-3xl font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-primary-100">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
