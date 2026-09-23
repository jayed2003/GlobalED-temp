import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/data/site";

/**
 * Default social share card (og:image / twitter:image), 1200×630 PNG.
 * Served at /share-image.png and generated once at build time. Pages with
 * their own photo (blog cover, destination hero, …) use that instead — see
 * src/lib/seo.ts.
 */
export const dynamic = "force-static";

export async function GET() {
  const logo = await readFile(join(process.cwd(), "public/images/logos/white-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0b173c 0%, #163388 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
        <img src={logoSrc} width={400} height={98} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>{site.tagline}</div>
          <div style={{ marginTop: 24, fontSize: 32, color: "#c7d2f0" }}>
            Free counselling · 13 study destinations · British Council IELTS
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28 }}>
          <div style={{ width: 56, height: 8, borderRadius: 4, background: "#07dd80" }} />
          <div>Book your free consultation today</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
