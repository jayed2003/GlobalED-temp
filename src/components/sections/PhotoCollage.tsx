import Image from "next/image";
import { cn } from "@/lib/utils";
import { isOriginalUpload } from "@/lib/images";

/**
 * Overlapping "film print" collage: white-bordered photos with a thicker bottom edge,
 * slightly rotated and layered on top of each other. Positions are percentages of the
 * container, so the whole collage scales with its width.
 */
/** Where each of the four photos sits in the collage (the layout stays as designed). */
const POSITIONS = [
  "left-[0%] top-[0%] w-[56%] -rotate-[5deg] z-10",
  "right-[0%] top-[3%] w-[55%] rotate-[4deg] z-20",
  "left-[30%] top-[33%] w-[56%] rotate-[2deg] z-30",
  "left-[0%] bottom-[0%] w-[60%] -rotate-[3deg] z-40",
];

export default function PhotoCollage({
  photos,
  className,
}: {
  /** Four photos (Admin → Pages → About › Our Success). */
  photos: { src: string; alt: string }[];
  className?: string;
}) {
  return (
    <div className={cn("relative mx-auto aspect-[5/6.4] w-full max-w-xl", className)}>
      {photos.slice(0, POSITIONS.length).map((photo, index) => (
        <figure
          key={index}
          className={cn(
            "absolute bg-white p-[3%] pb-[9%] shadow-[0_8px_24px_rgba(0,0,0,0.25)] ring-1 ring-black/5",
            POSITIONS[index],
          )}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-200">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 1024px) 60vw, 25vw"
              className="object-cover"
              unoptimized={isOriginalUpload(photo.src)}
            />
          </div>
        </figure>
      ))}
    </div>
  );
}
