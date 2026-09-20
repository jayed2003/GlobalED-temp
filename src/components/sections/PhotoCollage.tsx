import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Overlapping "film print" collage: white-bordered photos with a thicker bottom edge,
 * slightly rotated and layered on top of each other. Positions are percentages of the
 * container, so the whole collage scales with its width.
 */
const photos = [
  {
    src: "/images/success/mou-signing.jpg",
    alt: "MOU signing ceremony between Sonargaon University and GlobalEd",
    position: "left-[0%] top-[0%] w-[56%] -rotate-[5deg] z-10",
  },
  {
    src: "/images/success/ribbon-confetti.jpg",
    alt: "Ribbon-cutting with confetti at a GlobalEd branch opening",
    position: "right-[0%] top-[3%] w-[55%] rotate-[4deg] z-20",
  },
  {
    src: "/images/success/ribbon-opening.jpg",
    alt: "Ribbon-cutting at a GlobalEd opening event",
    position: "left-[30%] top-[33%] w-[56%] rotate-[2deg] z-30",
  },
  {
    src: "/images/success/ielts-award.jpg",
    alt: "GlobalEd team receiving an award at a British Council IELTS event",
    position: "left-[0%] bottom-[0%] w-[60%] -rotate-[3deg] z-40",
  },
];

export default function PhotoCollage({ className }: { className?: string }) {
  return (
    <div className={cn("relative mx-auto aspect-[5/6.4] w-full max-w-xl", className)}>
      {photos.map((photo) => (
        <figure
          key={photo.src}
          className={cn(
            "absolute bg-white p-[3%] pb-[9%] shadow-[0_8px_24px_rgba(0,0,0,0.25)] ring-1 ring-black/5",
            photo.position,
          )}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-200">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 1024px) 60vw, 25vw"
              className="object-cover"
            />
          </div>
        </figure>
      ))}
    </div>
  );
}
