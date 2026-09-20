import Image from "next/image";
import Breadcrumb, { type BreadcrumbItem } from "@/components/layout/Breadcrumb";
import Container from "@/components/layout/Container";
import { cn } from "@/lib/utils";

/**
 * Standard inner-page hero: breadcrumb + title + description on navy gradient.
 *
 * With `bannerImage`, the whole image (never cropped or stretched — its own text stays
 * readable) is shown on the right of the text on large screens, on top of it on small
 * screens, and its edges fade into the navy hero instead of ending in a hard line.
 *  - Taller images (ratio < 1.6) make the hero taller and fill its full height,
 *    so only the left edge fades.
 *  - Wider images are vertically centred and fade on the left, top and bottom.
 *  - `bannerFadeLeft` / `bannerFadeY`: how much of the image's width / height (in %) the left and
 *    top+bottom fades may use — keep them within the image's empty margins so none of its
 *    content gets washed out.
 *  - `bannerUniformHeight`: use the wide-banner hero height whatever the image's ratio, so a group
 *    of pages (e.g. all IELTS pages) keeps the same hero scale.
 *  - `bannerClearText`: for images whose content reaches close to their left edge. The image
 *    is sized so it always leaves a gap after the text, and the side-by-side layout only
 *    starts at 1280px (narrower screens stack the image above the text).
 */

// Full class strings per breakpoint (Tailwind can't see dynamically built class names).
const layouts = {
  lg: {
    section: "lg:flex lg:items-center",
    minH: {
      tall: "lg:min-h-[max(520px,42vw)]",
      medium: "lg:min-h-[max(480px,34vw)]",
      wide: "lg:min-h-[max(440px,30vw)]",
    },
    box: "lg:absolute lg:inset-y-0 lg:right-0 lg:flex lg:items-center lg:justify-end lg:w-[64%]",
    imgTall:
      "lg:h-full lg:w-auto lg:max-w-full lg:object-contain lg:[mask-image:linear-gradient(to_right,transparent,black_var(--fade-left))]",
    imgWide:
      "lg:max-h-full lg:w-auto lg:max-w-full lg:[mask-composite:intersect] lg:[mask-image:linear-gradient(to_right,transparent,black_var(--fade-left)),linear-gradient(to_bottom,transparent,black_var(--fade-y),black_calc(100%_-_var(--fade-y)),transparent)]",
    content: "lg:py-16",
    text: "lg:max-w-[30rem]",
  },
  xl: {
    section: "xl:flex xl:items-center",
    minH: {
      tall: "xl:min-h-[max(520px,42vw)]",
      medium: "xl:min-h-[max(480px,34vw)]",
      wide: "xl:min-h-[max(440px,30vw)]",
    },
    box: "xl:absolute xl:inset-y-0 xl:right-0 xl:flex xl:items-center xl:justify-end xl:w-[var(--box-w)]",
    imgTall:
      "xl:h-full xl:w-auto xl:max-w-full xl:object-contain xl:[mask-image:linear-gradient(to_right,transparent,black_var(--fade-left))]",
    imgWide:
      "xl:max-h-full xl:w-auto xl:max-w-full xl:[mask-composite:intersect] xl:[mask-image:linear-gradient(to_right,transparent,black_var(--fade-left)),linear-gradient(to_bottom,transparent,black_var(--fade-y),black_calc(100%_-_var(--fade-y)),transparent)]",
    content: "xl:py-16",
    text: "xl:max-w-[30rem]",
  },
} as const;

// Width of the image area so it starts 2rem after the text column (30rem wide, 2rem page padding,
// centred in a 80rem container): min(64%, 100% - left offset of the container - 34rem).
const CLEAR_TEXT_BOX_WIDTH = "min(64%, calc(100% - max(0px, (100% - 80rem) / 2) - 34rem))";

export default function PageHero({
  title,
  description,
  breadcrumb,
  bannerImage,
  bannerAlt = "",
  bannerWidth = 1600,
  bannerHeight = 702,
  bannerFadeLeft,
  bannerFadeY = 10,
  bannerClearText = false,
  bannerUniformHeight = false,
}: {
  title: React.ReactNode;
  description?: string;
  breadcrumb: BreadcrumbItem[];
  bannerImage?: string;
  bannerAlt?: string;
  bannerWidth?: number;
  bannerHeight?: number;
  bannerFadeLeft?: number;
  bannerFadeY?: number;
  bannerClearText?: boolean;
  bannerUniformHeight?: boolean;
}) {
  const hasBanner = Boolean(bannerImage);
  const ratio = bannerWidth / bannerHeight;
  const size = ratio < 1.6 ? "tall" : ratio < 2 ? "medium" : "wide";
  const fadeLeft = bannerFadeLeft ?? (size === "tall" ? 20 : 25);
  const l = bannerClearText ? layouts.xl : layouts.lg;

  return (
    <section
      className={cn(
        "bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950",
        hasBanner ? cn("relative overflow-hidden", l.section, l.minH[bannerUniformHeight ? "wide" : size]) : "py-14 sm:py-20",
      )}
    >
      {bannerImage && (
        <div
          className={cn("relative", l.box)}
          style={{ "--box-w": CLEAR_TEXT_BOX_WIDTH } as React.CSSProperties}
        >
          <Image
            src={bannerImage}
            alt={bannerAlt}
            width={bannerWidth}
            height={bannerHeight}
            priority
            sizes={size === "tall" ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 100vw, 64vw"}
            style={{ "--fade-left": `${fadeLeft}%`, "--fade-y": `${bannerFadeY}%` } as React.CSSProperties}
            className={cn(
              "h-auto w-full",
              // Stacked (small screens): fade the bottom into the hero. Wide banners have empty
              // space at the bottom, so they can fade earlier; others keep their content readable.
              size === "wide"
                ? "[mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
                : "[mask-image:linear-gradient(to_bottom,black_82%,transparent)]",
              size === "tall" ? l.imgTall : l.imgWide,
            )}
          />
        </div>
      )}
      <div className={cn(hasBanner ? cn("relative w-full pb-12 sm:pb-14", l.content) : "")}>
        <Container>
          <Breadcrumb items={breadcrumb} />
          <h1
            className={cn(
              "mt-5 font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl",
              hasBanner ? cn("max-w-xl", l.text) : "max-w-3xl",
            )}
          >
            {title}
          </h1>
          {description && (
            <p
              className={cn(
                "mt-4 text-lg leading-relaxed text-primary-100",
                hasBanner ? cn("max-w-xl", l.text) : "max-w-2xl",
              )}
            >
              {description}
            </p>
          )}
        </Container>
      </div>
    </section>
  );
}
