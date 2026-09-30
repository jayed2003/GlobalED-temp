/**
 * Generates the course images (public/images/courses/<slug>.webp): brand
 * graphics with the GlobalEd logo at the top, one design per course.
 * Each image is an HTML page screenshotted by Playwright at 1600 × 1200 (4:3,
 * the shape used on course cards and course pages), then saved as WebP.
 *
 * Run: node scripts/generate-course-images.mjs [slug …]   (needs internet for Google Fonts)
 *
 * The logo sits top-right: course cards put their badge ("Popular", "New") top-left.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as Lucide from "lucide-react";
import { chromium } from "playwright";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const W = 1600;
const H = 1200;

const logo = `data:image/png;base64,${readFileSync(join(root, "public/images/logos/logo-02.png")).toString("base64")}`;

/** A Lucide icon as inline SVG. */
const icon = (name, size, color = "currentColor", stroke = 1.75) =>
  renderToStaticMarkup(createElement(Lucide[name], { size, color, strokeWidth: stroke, absoluteStrokeWidth: false }));

// Brand colours (src/app/globals.css).
const c = {
  navy950: "#0b173c", navy900: "#0e2053", navy800: "#12296e", navy700: "#163388", blue500: "#1d46ba", blue400: "#5c7acd", blue300: "#93a6de",
  green500: "#07dd80", green400: "#39e499", green300: "#6febb5",
  gold: "#f5c451", goldDeep: "#d99a1e", red: "#e0344b",
};

const ieltsModules = [
  ["Headphones", "Listening"],
  ["BookOpen", "Reading"],
  ["PenLine", "Writing"],
  ["Mic", "Speaking"],
];

/** One IELTS package: the four modules, a tier meter and the package's mock tests. */
function ielts({ tier, level, accent, accentSoft, perk }) {
  const meter = [1, 2, 3]
    .map((i) => `<span class="seg" style="background:${i <= level ? accent : "rgba(255,255,255,.14)"}"></span>`)
    .join("");
  const tiles = ieltsModules
    .map(
      ([name, label]) => `<div class="tile">
        <div class="tile-icon" style="background:${accentSoft};color:${accent}">${icon(name, 72, "currentColor", 2)}</div>
        <div class="tile-label">${label}</div>
      </div>`,
    )
    .join("");
  return {
    glow: accent,
    body: `
      <div class="split">
        <div class="copy">
          <div class="eyebrow" style="color:${accent}">IELTS Preparation</div>
          <div class="title">IELTS<br><span style="color:${accent}">${tier}</span></div>
          <div class="meter">${meter}<span class="meter-label">${["Essential", "Advanced", "Premium"][level - 1]} package</span></div>
          <div class="chip" style="border-color:${accent}66">${icon("ClipboardCheck", 40, accent, 2)}<span>${perk}</span></div>
        </div>
        <div class="grid2">${tiles}</div>
      </div>`,
  };
}

const courses = {
  "ielts-regular": ielts({ tier: "Essential", level: 1, accent: c.blue300, accentSoft: "rgba(147,166,222,.16)", perk: "3 computer-delivered mock tests" }),
  "ielts-executive": ielts({ tier: "Advanced", level: 2, accent: c.green400, accentSoft: "rgba(57,228,153,.14)", perk: "4 mock tests + one-to-one support" }),
  "ielts-master": ielts({ tier: "Premium", level: 3, accent: c.gold, accentSoft: "rgba(245,196,81,.15)", perk: "Unlimited mock tests + mentoring" }),

  "spoken-english": {
    glow: c.green400,
    body: `
      <div class="split">
        <div class="copy">
          <div class="eyebrow" style="color:${c.green400}">English Course</div>
          <div class="title">Spoken<br><span style="color:${c.green400}">English</span></div>
          <div class="sub">Speak with confidence — interviews, presentations and everyday conversation.</div>
        </div>
        <div class="art">
          <div class="bubble b1">Hello! Nice to<br>meet you.</div>
          <div class="bubble b2">Tell me about<br>yourself.</div>
          <div class="bubble b3">I'd love to!</div>
          <div class="mic">${icon("Mic", 120, c.navy950, 2)}</div>
          <div class="wave">${Array.from({ length: 9 }, (_, i) => `<i style="height:${[30, 60, 95, 130, 160, 130, 95, 60, 30][i]}px"></i>`).join("")}</div>
        </div>
      </div>`,
  },

  "one-to-one": {
    glow: c.blue400,
    body: `
      <div class="split">
        <div class="copy">
          <div class="eyebrow" style="color:${c.blue300}">English & IELTS</div>
          <div class="title title-sm">One-to-One<br><span style="color:${c.green400}">Coaching</span></div>
          <div class="sub">Private lessons with your own instructor — your schedule, your pace.</div>
        </div>
        <div class="art">
          <div class="people">
            <div class="person"><div class="avatar a1">${icon("GraduationCap", 88, "#fff", 2)}</div><b>Instructor</b></div>
            <div class="link"><span class="ratio">1:1</span></div>
            <div class="person"><div class="avatar a2">${icon("User", 88, c.navy950, 2)}</div><b>You</b></div>
          </div>
          <div class="tags"><span>${icon("CalendarClock", 34, c.green400, 2)} Flexible time</span><span>${icon("Target", 34, c.green400, 2)} Your goals</span></div>
        </div>
      </div>`,
  },

  "language-club": {
    glow: c.green500,
    body: `
      <div class="split">
        <div class="copy">
          <div class="eyebrow" style="color:${c.green400}">Every Friday</div>
          <div class="title">Language<br><span style="color:${c.green400}">Club</span></div>
          <div class="sub">Debates, movies, books and games — practise English with friends.</div>
        </div>
        <div class="art orbit">
          <div class="ring"></div>
          <div class="hub">${icon("MessagesSquare", 110, c.navy950, 2)}</div>
          ${[
            ["Mic", "Debates", 0],
            ["Clapperboard", "Movies", 90],
            ["BookOpen", "Books", 180],
            ["Puzzle", "Games", 270],
          ]
            .map(
              ([name, label, deg]) => `<div class="sat" style="--a:${deg}deg"><div class="sat-in">${icon(name, 58, "#fff", 2)}<b>${label}</b></div></div>`,
            )
            .join("")}
        </div>
      </div>`,
  },

  japanese: {
    glow: c.red,
    body: `
      <div class="split">
        <div class="copy">
          <div class="eyebrow" style="color:#ff8a98">JLPT N5 – N3</div>
          <div class="title">Japanese<br><span style="color:#ff8a98">Language</span></div>
          <div class="sub">Hiragana, Katakana and Kanji to conversation — for study and work in Japan.</div>
        </div>
        <div class="art jp">
          <div class="sun"></div>
          <div class="kanji">日本語</div>
          <div class="kana">${["あ", "い", "う", "え", "お"].map((k) => `<span>${k}</span>`).join("")}</div>
        </div>
      </div>`,
  },
};

const css = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px}
body{font-family:"DM Sans",sans-serif;color:#fff;overflow:hidden;position:relative;
  background:radial-gradient(1200px 900px at 85% 110%, var(--glow-soft), transparent 60%),
             radial-gradient(900px 700px at -10% -10%, rgba(29,70,186,.55), transparent 60%),
             linear-gradient(135deg, ${c.navy950} 0%, ${c.navy900} 45%, ${c.navy800} 100%)}
body::before{content:"";position:absolute;inset:0;opacity:.35;
  background-image:radial-gradient(rgba(255,255,255,.18) 1.5px, transparent 1.6px);background-size:36px 36px;
  mask-image:linear-gradient(115deg, transparent 20%, #000 75%)}
.frame{position:absolute;inset:0;padding:86px 96px}
.logo{position:absolute;top:78px;right:96px;height:86px}
.split{position:absolute;left:96px;right:96px;top:230px;bottom:96px;display:flex;align-items:center;gap:56px}
.copy{flex:0 0 700px}
.eyebrow{font-size:40px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}
.title{margin-top:18px;font-size:150px;line-height:.98;font-weight:800;letter-spacing:-.02em}
.sub{margin-top:36px;font-size:40px;line-height:1.35;color:rgba(226,231,246,.86);max-width:640px}
.meter{margin-top:44px;display:flex;align-items:center;gap:14px}
.seg{width:92px;height:16px;border-radius:99px}
.meter-label{margin-left:14px;font-size:34px;font-weight:600;color:rgba(226,231,246,.8)}
.chip{margin-top:40px;display:inline-flex;align-items:center;gap:18px;padding:22px 30px;border:2px solid;border-radius:22px;
  background:rgba(255,255,255,.06);font-size:36px;font-weight:600}
.grid2{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:30px}
.tile{height:330px;border-radius:32px;background:rgba(255,255,255,.07);border:2px solid rgba(255,255,255,.12);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;backdrop-filter:blur(4px)}
.tile-icon{width:140px;height:140px;border-radius:32px;display:flex;align-items:center;justify-content:center}
.tile-label{font-size:40px;font-weight:700}
.art{flex:1;position:relative;height:100%}
/* Spoken English */
.bubble{position:absolute;padding:30px 40px;border-radius:40px;font-size:44px;font-weight:700;line-height:1.2;box-shadow:0 20px 50px rgba(0,0,0,.25)}
.b1{top:10px;left:40px;background:#fff;color:${c.navy900};border-bottom-left-radius:10px}
.b2{top:250px;right:0;background:${c.green400};color:${c.navy950};border-bottom-right-radius:10px}
.b3{top:500px;left:0;background:${c.blue500};color:#fff;border-bottom-left-radius:10px}
.mic{position:absolute;right:90px;bottom:40px;width:230px;height:230px;border-radius:50%;background:${c.green400};
  display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 26px rgba(57,228,153,.18),0 0 0 56px rgba(57,228,153,.08)}
.wave{position:absolute;right:420px;bottom:75px;display:flex;align-items:center;gap:14px;height:170px}
.wave i{display:block;width:16px;border-radius:99px;background:rgba(255,255,255,.55)}
/* One-to-One */
.title-sm{font-size:118px}
.people{position:absolute;left:0;right:0;top:50%;transform:translateY(-70%);display:flex;align-items:flex-start}
.person{display:flex;flex-direction:column;align-items:center;gap:22px;flex:none}
.person b{font-size:36px}
.avatar{width:200px;height:200px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex:none;box-shadow:0 24px 50px rgba(0,0,0,.3)}
.ratio{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);padding:10px 26px;border-radius:99px;background:#fff;color:${c.navy900};font-size:48px;font-weight:800;box-shadow:0 16px 40px rgba(0,0,0,.3)}
.a1{background:${c.blue500};border:8px solid rgba(255,255,255,.2)}
.a2{background:${c.green400};border:8px solid rgba(255,255,255,.2)}
.link{position:relative;flex:1;height:10px;margin:95px 20px 0;border-radius:99px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.7) 0 26px,transparent 26px 44px)}
.tags{position:absolute;left:0;right:0;top:calc(50% + 150px);display:flex;justify-content:center;gap:24px}
.tags span{display:inline-flex;align-items:center;gap:14px;padding:18px 28px;border-radius:99px;background:rgba(255,255,255,.08);border:2px solid rgba(255,255,255,.14);font-size:32px;font-weight:600}
/* Language Club */
.orbit{display:flex;align-items:center;justify-content:center}
.ring{position:absolute;width:560px;height:560px;border-radius:50%;border:3px dashed rgba(255,255,255,.28)}
.hub{position:absolute;width:250px;height:250px;border-radius:50%;background:${c.green400};display:flex;align-items:center;justify-content:center;
  box-shadow:0 0 0 30px rgba(57,228,153,.15),0 30px 60px rgba(0,0,0,.3)}
.sat{position:absolute;left:50%;top:50%;width:0;height:0;transform:rotate(calc(var(--a) - 45deg)) translate(280px) rotate(calc(-1 * (var(--a) - 45deg)))}
.sat-in{position:absolute;transform:translate(-50%,-50%);width:190px;height:190px;border-radius:44px;background:${c.blue500};border:3px solid rgba(255,255,255,.2);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;box-shadow:0 20px 44px rgba(0,0,0,.3)}
.sat-in b{font-size:30px}
/* Japanese */
.jp{display:flex;flex-direction:column;align-items:center;justify-content:center}
.sun{position:absolute;top:50%;left:50%;width:560px;height:560px;margin:-330px 0 0 -280px;border-radius:50%;
  background:radial-gradient(circle at 35% 35%, #ff6b7d, ${c.red} 60%, #b21e33);box-shadow:0 0 120px rgba(224,52,75,.45)}
.kanji{position:relative;font-family:"Noto Sans JP",sans-serif;font-size:170px;font-weight:800;letter-spacing:.02em;margin-top:-60px;text-shadow:0 12px 40px rgba(0,0,0,.35)}
.kana{position:relative;margin-top:56px;display:flex;gap:18px}
.kana span{width:104px;height:104px;border-radius:24px;display:flex;align-items:center;justify-content:center;font-family:"Noto Sans JP",sans-serif;font-size:58px;font-weight:700;
  background:rgba(255,255,255,.1);border:2px solid rgba(255,255,255,.2)}
`;

function page(course) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,500..800&family=Noto+Sans+JP:wght@700;800&display=block" rel="stylesheet">
<style>${css}</style></head>
<body style="--glow-soft:${course.glow}33">
  <img class="logo" src="${logo}" alt="">
  ${course.body}
</body></html>`;
}

const only = process.argv.slice(2);
const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: W, height: H } });
for (const [slug, course] of Object.entries(courses)) {
  if (only.length && !only.includes(slug)) continue;
  await tab.setContent(page(course), { waitUntil: "networkidle" });
  await tab.evaluate(() => document.fonts.ready);
  const png = await tab.screenshot({ type: "png" });
  const out = join(root, "public/images/courses", `${slug}.webp`);
  const info = await sharp(png).webp({ quality: 86, effort: 6 }).toFile(out);
  console.log(`${slug}.webp  ${(info.size / 1024).toFixed(0)} KB`);
}
await browser.close();
