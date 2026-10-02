/**
 * Generates the sister-organization logos shown on About › Our Organization
 * (public/images/logos/<name>.png): an icon mark beside a two-line wordmark,
 * on a transparent background so they sit on the white cards.
 * Each logo is an HTML page screenshotted by Playwright at 800 × 400, then
 * trimmed to its content (so it fills the cards' 2:1 logo slot) and optimised.
 *
 * Run: node scripts/generate-sister-logos.mjs [name …]   (needs internet for Google Fonts)
 *
 * The Language Club and Foundation are GlobalEd sub-brands, so they use the
 * GlobalEd wordmark; Global Citizen Limited (the parent company) gets its own.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Globe } from "lucide-react";
import { chromium } from "playwright";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const W = 800;
const H = 400;

const globaledLogo = `data:image/png;base64,${readFileSync(join(root, "public/images/logos/logo-01.png")).toString("base64")}`;

// Brand colours (src/app/globals.css).
const c = { navy950: "#0b173c", navy900: "#0e2053", navy700: "#163388", blue500: "#1d46ba", green500: "#07dd80", green600: "#06be6e" };

const logos = {
  // Two speech bubbles: English ("A") and Japanese ("あ") — the club's IELTS, Spoken English and Japanese.
  "sister-language-club": {
    mark: `<svg viewBox="0 0 220 220">
      <path d="M42 18h96a32 32 0 0 1 32 32v46a32 32 0 0 1-32 32H70l-34 28v-30a32 32 0 0 1-26-31V50a32 32 0 0 1 32-32z" fill="${c.blue500}"/>
      <text x="56" y="94" text-anchor="middle" font-family="DM Sans" font-weight="800" font-size="72" fill="#fff">A</text>
      <path d="M182 92h-76a28 28 0 0 0-28 28v40a28 28 0 0 0 28 28h48l32 26v-27a28 28 0 0 0 24-28v-39a28 28 0 0 0-28-28z" fill="${c.green500}" stroke="#fff" stroke-width="8" stroke-linejoin="round"/>
      <text x="144" y="163" text-anchor="middle" font-family="Noto Sans JP" font-weight="800" font-size="60" fill="${c.navy950}">あ</text>
    </svg>`,
    wordmark: `<img class="ge" src="${globaledLogo}" alt=""><div class="sub">Language Club</div>`,
  },

  // A heart wearing a graduation cap: free counselling and scholarships for students who need them.
  "sister-foundation": {
    mark: `<svg viewBox="0 0 220 220">
      <path transform="translate(0 20) scale(9.2)" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="${c.blue500}"/>
      <g transform="rotate(-16 78 48)" stroke="#fff" stroke-width="6" stroke-linejoin="round">
        <path d="M46 50v18c0 10 14 18 32 18s32-8 32-18V50l-32 14z" fill="${c.green600}"/>
        <path d="M78 14l62 27-62 27-62-27z" fill="${c.green500}"/>
        <path d="M134 44v30" stroke="${c.green500}" stroke-width="6" stroke-linecap="round"/>
        <circle cx="134" cy="80" r="7" fill="${c.green500}" stroke="none"/>
      </g>
    </svg>`,
    wordmark: `<img class="ge" src="${globaledLogo}" alt=""><div class="sub">Foundation</div>`,
  },

  // A globe in an orbit ring: global citizenship.
  "global-citizen-limited": {
    mark: `<svg viewBox="0 0 220 220">
      <circle cx="110" cy="110" r="92" fill="${c.navy900}"/>
      <g transform="translate(46 46)">${renderToStaticMarkup(createElement(Globe, { size: 128, color: "#fff", strokeWidth: 1.5 }))}</g>
      <ellipse cx="110" cy="110" rx="106" ry="36" transform="rotate(-24 110 110)" fill="none" stroke="${c.green500}" stroke-width="9"/>
      <circle cx="198" cy="72" r="13" fill="${c.green500}" stroke="#fff" stroke-width="5"/>
    </svg>`,
    wordmark: `<div class="name">Global Citizen</div><div class="ltd">Limited</div>`,
  },
};

const css = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;background:transparent}
body{display:flex;align-items:center;justify-content:center;gap:34px;font-family:"DM Sans",sans-serif}
.mark{width:230px;height:230px;flex:none}
.mark svg{width:100%;height:100%;overflow:visible}
.words{display:flex;flex-direction:column;justify-content:center}
.ge{width:430px;display:block}
.sub{margin-top:16px;font-size:70px;font-weight:700;line-height:1;letter-spacing:-.01em;color:${c.navy700}}
.name{font-size:76px;font-weight:800;line-height:1;letter-spacing:-.02em;color:${c.navy900}}
.ltd{margin-top:16px;font-size:44px;font-weight:700;line-height:1;letter-spacing:.42em;text-transform:uppercase;color:${c.green600}}
`;

function page(logo) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,500..800&family=Noto+Sans+JP:wght@800&display=block" rel="stylesheet">
<style>${css}</style></head>
<body><div class="mark">${logo.mark}</div><div class="words">${logo.wordmark}</div></body></html>`;
}

const only = process.argv.slice(2);
const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: W, height: H } });
for (const [name, logo] of Object.entries(logos)) {
  if (only.length && !only.includes(name)) continue;
  await tab.setContent(page(logo), { waitUntil: "networkidle" });
  await tab.evaluate(() => document.fonts.ready);
  const png = await tab.screenshot({ type: "png", omitBackground: true });
  const out = join(root, "public/images/logos", `${name}.png`);
  const trimmed = await sharp(png).trim().toBuffer();
  const info = await sharp(trimmed)
    .extend({ top: 6, bottom: 6, left: 6, right: 6, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(out);
  console.log(`${name}.png  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
await browser.close();
