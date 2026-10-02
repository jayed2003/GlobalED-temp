/**
 * Generates the blog cover images (public/images/blog/<name>.jpg): brand
 * graphics with the GlobalEd logo top-left, one design per post.
 * Each image is an HTML page screenshotted by Playwright at 1600 × 900 (16:9,
 * the shape used on blog cards and post pages), then saved as JPEG — covers are
 * also the social-share image when a post has no OG image, and JPEG is the
 * format every network shows.
 *
 * Run: node scripts/generate-blog-images.mjs [name …]   (needs internet for Google Fonts)
 *
 * Layout: headline on the left, a slanted visual panel on the right — a photo
 * of the destination for country posts, an illustration for IELTS / English.
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
const H = 900;

const dataUrl = (path, type) => `data:${type};base64,${readFileSync(join(root, path)).toString("base64")}`;
const logo = dataUrl("public/images/logos/logo-02.png", "image/png");
const photo = (name) => dataUrl(`public/images/destinations/${name}`, "image/jpeg");

/** A Lucide icon as inline SVG. */
const icon = (name, size, color = "currentColor", stroke = 2) =>
  renderToStaticMarkup(createElement(Lucide[name], { size, color, strokeWidth: stroke }));

// Brand colours (src/app/globals.css).
const c = {
  navy950: "#0b173c", navy900: "#0e2053", navy800: "#12296e", navy700: "#163388", blue500: "#1d46ba", blue400: "#5c7acd", blue300: "#93a6de",
  green500: "#07dd80", green400: "#39e499", green300: "#6febb5",
  gold: "#f5c451", goldDeep: "#d99a1e",
};

const chips = (items) =>
  `<div class="chips">${items.map(([name, label]) => `<span>${icon(name, 30, c.green400)}${label}</span>`).join("")}</div>`;

const posts = {
  "study-in-uk-guide": {
    eyebrow: "2026 Guide",
    title: `Study in<br>the <em>UK</em>`,
    sub: "Admissions, costs and the visa — for Bangladeshi students.",
    extra: chips([["GraduationCap", "Admissions"], ["Wallet", "Costs"], ["Stamp", "Visa"]]),
    visual: `<img class="photo" src="${photo("uk-hero.jpg")}" style="object-position:62% 50%" alt="">`,
  },

  "sweden-scholarships": {
    eyebrow: "Scholarships",
    title: `Top 5<br><em>Scholarships</em><br>in Sweden`,
    size: 88,
    sub: "Eligibility, deadlines and tips.",
    visual: `<img class="photo" src="${photo("sweden-hero.jpg")}" style="object-position:50% 50%" alt="">
      <div class="medal"><div class="medal-in"><small>Top</small><b>5</b>${icon("Award", 44, c.navy950, 2.25)}</div></div>`,
  },

  "study-in-malaysia": {
    eyebrow: "Study Abroad",
    title: `Study in<br><em>Malaysia</em>`,
    sub: "The most affordable quality pathway from Bangladesh.",
    extra: chips([["Wallet", "Low tuition"], ["Languages", "English-taught"], ["Globe2", "Twinning degrees"]]),
    visual: `<img class="photo" src="${photo("malaysia-hero.jpg")}" style="object-position:48% 50%" alt="">`,
  },

  "ielts-writing-band7": {
    eyebrow: "IELTS Writing · Task 2",
    title: `7 Strategies<br>for <em>Band 7</em>`,
    sub: "Move past band 6.0 in Writing.",
    illustrated: true,
    visual: `
      <div class="sheet">
        <div class="sheet-head"><span>Writing Task 2</span><span class="sheet-time">40 min</span></div>
        ${[92, 100, 84, 96, 70].map((w, i) => `<i style="width:${w}%"${i === 1 ? ' class="hl"' : ""}></i>`).join("")}
        <div class="gap"></div>
        ${[100, 88, 95, 60].map((w, i) => `<i style="width:${w}%"${i === 2 ? ' class="hl"' : ""}></i>`).join("")}
        <div class="ticks">${["Task response", "Coherence", "Grammar"].map((t) => `<span>${icon("Check", 26, c.green500, 3)}${t}</span>`).join("")}</div>
      </div>
      <div class="pen">${icon("PenLine", 74, c.navy950, 2.25)}</div>
      <div class="ladder">${[["6.0", 100], ["6.5", 150], ["7.0", 210]]
        .map(([b, h], i) => `<div class="step${i === 2 ? " top" : ""}"><span>${b}</span><i style="height:${h}px"></i></div>`)
        .join("")}</div>`,
  },

  "ielts-vs-pte": {
    eyebrow: "English Tests",
    title: `IELTS vs PTE<br>vs <em>Duolingo</em>`,
    sub: "Which English test should you take?",
    illustrated: true,
    visual: `
      <div class="tests">
        ${[
          ["IELTS", "Band score", "0 – 9", c.blue300],
          ["PTE Academic", "Score range", "10 – 90", c.green400],
          ["Duolingo English Test", "Score range", "10 – 160", c.gold],
        ]
          .map(
            ([name, label, range, accent], i) => `<div class="test" style="--accent:${accent};--i:${i}">
              <div class="test-icon">${icon(["Headphones", "Monitor", "Smartphone"][i], 46, c.navy950, 2.25)}</div>
              <div class="test-body">
                <div class="test-name">${name}</div>
                <div class="test-score"><small>${label}</small><b>${range}</b></div>
              </div>
            </div>`,
          )
          .join("")}
        <div class="vs v1">VS</div>
        <div class="vs v2">VS</div>
      </div>`,
  },

  "speaking-confidence": {
    eyebrow: "Spoken English",
    title: `Speak with<br><em>confidence</em><br>in 90 days`,
    size: 88,
    sub: "A daily routine that builds real fluency.",
    illustrated: true,
    visual: `
      <div class="ring-wrap">
        <svg class="ring" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="26"/>
          <circle cx="200" cy="200" r="170" fill="none" stroke="${c.green400}" stroke-width="26" stroke-linecap="round"
            stroke-dasharray="${(2 * Math.PI * 170 * 0.78).toFixed(1)} 2000" transform="rotate(-90 200 200)"/>
        </svg>
        <div class="ring-text"><b>90</b><span>days</span></div>
      </div>
      <div class="bubble q1">Hi! Can I<br>introduce myself?</div>
      <div class="bubble q2">I'm ready!</div>
      <div class="weeks">${["Week 1", "Week 4", "Week 8", "Week 12"]
        .map((w, i) => `<span><i style="height:${30 + i * 26}px"></i>${w}</span>`)
        .join("")}</div>`,
  },
};

const css = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px}
body{font-family:"DM Sans",sans-serif;color:#fff;overflow:hidden;position:relative;
  background:radial-gradient(900px 700px at -10% -10%, rgba(29,70,186,.55), transparent 60%),
             linear-gradient(135deg, ${c.navy950} 0%, ${c.navy900} 50%, ${c.navy800} 100%)}
body::before{content:"";position:absolute;inset:0;opacity:.3;
  background-image:radial-gradient(rgba(255,255,255,.18) 1.5px, transparent 1.6px);background-size:36px 36px;
  mask-image:linear-gradient(200deg, transparent 30%, #000 90%)}
.logo{position:absolute;top:64px;left:80px;height:72px}

/* Headline column */
.copy{position:absolute;left:80px;top:196px;bottom:72px;width:640px;display:flex;flex-direction:column;justify-content:center}
.eyebrow{display:flex;align-items:center;gap:16px;font-size:30px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${c.green400}}
.eyebrow::before{content:"";width:48px;height:5px;border-radius:9px;background:${c.green400}}
.title{margin-top:22px;font-weight:800;line-height:1.02;letter-spacing:-.02em}
.title em{font-style:normal;color:${c.green400}}
.sub{margin-top:28px;font-size:32px;line-height:1.35;color:rgba(226,231,246,.86);max-width:560px}
.chips{margin-top:34px;display:flex;flex-wrap:wrap;gap:14px}
.chips span{display:inline-flex;align-items:center;gap:12px;padding:14px 22px;border-radius:99px;font-size:26px;font-weight:600;
  background:rgba(255,255,255,.07);border:2px solid rgba(255,255,255,.14)}

/* Slanted visual panel (with a green edge) */
.edge,.panel{position:absolute;inset:0}
.edge{background:${c.green500};clip-path:polygon(828px 0,100% 0,100% 100%,698px 100%)}
.panel{clip-path:polygon(842px 0,100% 0,100% 100%,712px 100%);overflow:hidden}
.panel.art{background:radial-gradient(700px 600px at 85% 30%, rgba(92,122,205,.45), transparent 65%),
  linear-gradient(160deg, ${c.navy700} 0%, ${c.navy800} 55%, ${c.navy900} 100%)}
.panel.art::before{content:"";position:absolute;inset:0;opacity:.35;
  background-image:radial-gradient(rgba(255,255,255,.2) 1.5px, transparent 1.6px);background-size:32px 32px}
.photo{position:absolute;top:0;right:0;height:100%;width:888px;object-fit:cover}
.stage{position:absolute;top:0;bottom:0;left:780px;right:0}

/* Sweden: medal on the photo */
.medal{position:absolute;right:96px;bottom:84px;width:220px;height:220px;border-radius:50%;padding:14px;
  background:linear-gradient(145deg,#ffe49a,${c.gold} 45%,${c.goldDeep});box-shadow:0 26px 60px rgba(0,0,0,.4)}
.medal-in{width:100%;height:100%;border-radius:50%;border:4px dashed rgba(11,23,60,.35);display:flex;flex-direction:column;align-items:center;justify-content:center;color:${c.navy950}}
.medal-in small{font-size:26px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;margin-bottom:-14px}
.medal-in b{font-size:104px;font-weight:800;line-height:1}

/* IELTS Writing */
.sheet{position:absolute;left:100px;top:120px;width:430px;height:630px;padding:44px 46px;border-radius:26px;background:#fff;color:${c.navy900};
  transform:rotate(-4deg);box-shadow:0 40px 80px rgba(0,0,0,.4)}
.sheet-head{display:flex;justify-content:space-between;align-items:center;font-size:30px;font-weight:800;margin-bottom:34px}
.sheet-time{font-size:22px;font-weight:700;padding:6px 14px;border-radius:99px;background:#e2e7f6;color:${c.navy700}}
.sheet i{display:block;height:14px;border-radius:9px;background:#d5dbec;margin-bottom:22px}
.sheet i.hl{background:linear-gradient(90deg,${c.green300},${c.green400})}
.sheet .gap{height:16px}
.ticks{margin-top:30px;display:flex;flex-direction:column;gap:14px}
.ticks span{display:flex;align-items:center;gap:12px;font-size:24px;font-weight:700;color:${c.navy800}}
.pen{position:absolute;left:460px;top:78px;width:130px;height:130px;border-radius:50%;background:${c.green400};display:flex;align-items:center;justify-content:center;
  box-shadow:0 0 0 18px rgba(57,228,153,.16),0 24px 50px rgba(0,0,0,.35)}
.ladder{position:absolute;right:48px;bottom:96px;display:flex;align-items:flex-end;gap:12px}
.step{display:flex;flex-direction:column;align-items:center;gap:10px}
.step span{font-size:28px;font-weight:800;color:rgba(255,255,255,.75)}
.step i{display:block;width:46px;border-radius:14px 14px 6px 6px;background:rgba(255,255,255,.18)}
.step.top span{color:${c.green400};font-size:40px}
.step.top i{background:linear-gradient(180deg,${c.green400},${c.green500});box-shadow:0 0 40px rgba(57,228,153,.45)}

/* IELTS vs PTE vs Duolingo */
.tests{position:absolute;left:120px;right:30px;top:90px;bottom:90px}
.test{position:absolute;left:calc(var(--i) * 36px);top:calc(var(--i) * 246px);width:540px;height:200px;padding:0 34px;border-radius:28px;
  display:flex;align-items:center;gap:26px;background:rgba(255,255,255,.08);border:2px solid rgba(255,255,255,.16);border-left:10px solid var(--accent);
  box-shadow:0 24px 50px rgba(0,0,0,.3);backdrop-filter:blur(6px)}
.test-icon{flex:none;width:88px;height:88px;border-radius:24px;background:var(--accent);display:flex;align-items:center;justify-content:center}
.test-body{flex:1;min-width:0}
.test-name{font-size:31px;font-weight:800;line-height:1.1;white-space:nowrap}
.test-score{margin-top:12px;display:flex;align-items:baseline;gap:16px}
.test-score small{font-size:19px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(226,231,246,.65)}
.test-score b{font-size:44px;font-weight:800;color:var(--accent);white-space:nowrap}
.vs{position:absolute;width:84px;height:84px;border-radius:50%;background:#fff;color:${c.navy900};display:flex;align-items:center;justify-content:center;
  font-size:30px;font-weight:800;box-shadow:0 14px 34px rgba(0,0,0,.35);z-index:2}
.v1{left:250px;top:181px}
.v2{left:286px;top:427px}

/* Speaking confidence */
.ring-wrap{position:absolute;left:220px;top:220px;width:400px;height:400px}
.ring{width:100%;height:100%}
.ring-text{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.ring-text b{font-size:150px;font-weight:800;line-height:.9}
.ring-text span{font-size:40px;font-weight:700;color:${c.green400};letter-spacing:.08em;text-transform:uppercase}
.bubble{position:absolute;padding:24px 32px;border-radius:34px;font-size:34px;font-weight:700;line-height:1.2;box-shadow:0 20px 50px rgba(0,0,0,.3)}
.q1{left:130px;top:70px;background:#fff;color:${c.navy900};border-bottom-left-radius:8px}
.q2{left:110px;bottom:90px;background:${c.green400};color:${c.navy950};border-top-left-radius:8px}
.weeks{position:absolute;right:56px;bottom:72px;display:flex;align-items:flex-end;gap:18px}
.weeks span{display:flex;flex-direction:column;align-items:center;gap:10px;font-size:20px;font-weight:700;color:rgba(226,231,246,.7)}
.weeks i{display:block;width:40px;border-radius:12px 12px 4px 4px;background:linear-gradient(180deg,${c.green300},${c.green500})}
`;

function page(post) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,500..800&display=block" rel="stylesheet">
<style>${css}</style></head>
<body>
  <div class="edge"></div>
  <div class="panel${post.illustrated ? " art" : ""}">${post.illustrated ? `<div class="stage">${post.visual}</div>` : post.visual}</div>
  <img class="logo" src="${logo}" alt="">
  <div class="copy">
    <div class="eyebrow">${post.eyebrow}</div>
    <div class="title" style="font-size:${post.size ?? 100}px">${post.title}</div>
    <div class="sub">${post.sub}</div>
    ${post.extra ?? ""}
  </div>
</body></html>`;
}

const only = process.argv.slice(2);
const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: W, height: H } });
for (const [name, post] of Object.entries(posts)) {
  if (only.length && !only.includes(name)) continue;
  await tab.setContent(page(post), { waitUntil: "networkidle" });
  await tab.evaluate(() => document.fonts.ready);
  const png = await tab.screenshot({ type: "png" });
  const out = join(root, "public/images/blog", `${name}.jpg`);
  const info = await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toFile(out);
  console.log(`${name}.jpg  ${(info.size / 1024).toFixed(0)} KB`);
}
await browser.close();
