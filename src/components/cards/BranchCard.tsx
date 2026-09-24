import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Branch } from "@/types";

/** Branch card with contact details and an embedded Google Map. */
export default function BranchCard({ branch }: { branch: Branch }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex-grow p-6">
        <h3 className="font-heading text-lg font-semibold text-primary-900">{branch.name}</h3>
        <ul className="mt-4 space-y-3 text-sm text-neutral-600">
          <li className="flex gap-2.5">
            <MapPin size={16} aria-hidden className="mt-0.5 shrink-0 text-primary-600" />
            {branch.address}
          </li>
          {branch.phones.map((phone) => (
            <li key={phone}>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex gap-2.5 transition-colors hover:text-primary-700"
              >
                <Phone size={16} aria-hidden className="mt-0.5 shrink-0 text-primary-600" />
                {phone}
              </a>
            </li>
          ))}
          <li>
            <a
              href={`mailto:${branch.email}`}
              className="flex gap-2.5 transition-colors hover:text-primary-700"
            >
              <Mail size={16} aria-hidden className="mt-0.5 shrink-0 text-primary-600" />
              {branch.email}
            </a>
          </li>
          <li className="flex gap-2.5">
            <Clock size={16} aria-hidden className="mt-0.5 shrink-0 text-primary-600" />
            {branch.hours}
          </li>
        </ul>
      </div>
      {branch.mapEmbedUrl && (
        <iframe
          src={branch.mapEmbedUrl}
          title={`Map — GlobalEd ${branch.name} branch`}
          loading="lazy"
          className="h-56 w-full shrink-0 border-0"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      )}
    </div>
  );
}
