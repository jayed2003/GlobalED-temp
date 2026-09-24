import Image from "next/image";
import type { TeamMember } from "@/types";
import { isOriginalUpload } from "@/lib/images";

const DEFAULT_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

/** Team member card with photo, name, and designation. */
export default function TeamCard({
  member,
  sizes = DEFAULT_SIZES,
}: {
  member: TeamMember;
  sizes?: string;
}) {
  return (
    <div className="h-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <div className="relative aspect-square">
        <Image
          src={member.photo}
          alt={member.photoAlt || `${member.name}, ${member.designation} at GlobalEd`}
          fill
          className="object-cover"
          sizes={sizes}
          unoptimized={isOriginalUpload(member.photo)}
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-heading text-base font-semibold text-primary-900">{member.name}</h3>
        <p className="font-secondary mt-0.5 text-sm font-medium text-accent-800">{member.designation}</p>
        {member.bio && <p className="mt-2 text-xs leading-relaxed text-neutral-500">{member.bio}</p>}
      </div>
    </div>
  );
}
