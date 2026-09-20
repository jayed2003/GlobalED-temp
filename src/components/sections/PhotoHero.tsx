import Image from "next/image";
import Breadcrumb, { type BreadcrumbItem } from "@/components/layout/Breadcrumb";
import Container from "@/components/layout/Container";

/**
 * Full-width photo hero (same look as the destination pages): the photo is dimmed and
 * fades to navy towards the bottom, with the breadcrumb, title and description on top.
 */
export default function PhotoHero({
  title,
  description,
  breadcrumb,
  image,
  imageAlt = "",
}: {
  title: string;
  description?: string;
  breadcrumb: BreadcrumbItem[];
  image: string;
  imageAlt?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-primary-950">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/60 to-primary-950/30"
          aria-hidden
        />
      </div>
      <Container className="relative py-16 sm:py-24">
        <Breadcrumb items={breadcrumb} />
        <h1 className="mt-5 font-heading text-4xl font-bold text-white sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg text-primary-100">{description}</p>}
      </Container>
    </section>
  );
}
