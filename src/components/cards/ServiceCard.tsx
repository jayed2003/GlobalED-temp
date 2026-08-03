import Link from "next/link";
import {
  ArrowRight,
  Award,
  FileCheck,
  GraduationCap,
  Languages,
  Luggage,
  Plane,
} from "lucide-react";
import type { Service } from "@/types";

const icons = { GraduationCap, Award, FileCheck, Plane, Luggage, Languages };

/** Numbered service card with icon (NWC 01–06 pattern). */
export default function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const Icon = icons[service.icon as keyof typeof icons] ?? GraduationCap;

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-700 transition-colors group-hover:bg-primary-700 group-hover:text-white">
          <Icon size={24} aria-hidden />
        </span>
        <span className="font-heading text-2xl font-bold text-neutral-200 transition-colors group-hover:text-accent-500">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-4 font-heading text-lg font-semibold text-primary-900">
        {service.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
        {service.shortDescription}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-700">
        Learn more
        <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
