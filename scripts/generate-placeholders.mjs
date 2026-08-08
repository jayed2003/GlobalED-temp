/**
 * Generates SVG placeholder images for all data-file image paths.
 * Run once: node scripts/generate-placeholders.mjs
 * Replace these with real photos before launch.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

const palettes = [
  ["#163388", "#1a3da3"],
  ["#12296e", "#1d46ba"],
  ["#0e2053", "#5c7acd"],
  ["#1a3da3", "#5c7acd"],
  ["#984c00", "#e07000"],
  ["#582c00", "#bc5e00"],
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function gradient(label, sub = "", w = 1200, h = 800, i = 0) {
  const [c1, c2] = palettes[i % palettes.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<text x="50%" y="${sub ? 47 : 52}%" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="${Math.round(w / 16)}" font-weight="700" fill="rgba(255,255,255,0.92)">${esc(label)}</text>
${sub ? `<text x="50%" y="59%" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="${Math.round(w / 32)}" fill="rgba(255,255,255,0.65)">${esc(sub)}</text>` : ""}
</svg>`;
}

function avatar(initials, i = 0, size = 200) {
  const [c1, c2] = palettes[i % palettes.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
<rect width="${size}" height="${size}" fill="url(#g)"/>
<circle cx="${size / 2}" cy="${size * 0.4}" r="${size * 0.17}" fill="rgba(255,255,255,0.28)"/>
<ellipse cx="${size / 2}" cy="${size * 1.02}" rx="${size * 0.36}" ry="${size * 0.42}" fill="rgba(255,255,255,0.28)"/>
<text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" font-family="Segoe UI, Arial, sans-serif" font-size="${size * 0.28}" font-weight="700" fill="rgba(255,255,255,0.85)">${esc(initials)}</text>
</svg>`;
}

function flag(code, i = 0, w = 96, h = 64) {
  const [c1, c2] = palettes[i % palettes.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
<rect width="${w}" height="${h}" rx="6" fill="url(#g)"/>
<text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Segoe UI, Arial, sans-serif" font-size="${h * 0.38}" font-weight="700" fill="rgba(255,255,255,0.9)">${esc(code)}</text>
</svg>`;
}

const files = new Map();
const add = (path, content) => files.set(join(root, ...path.split("/")), content);

// --- Destinations ---
const destinations = [
  ["uk", "United Kingdom", "GB"],
  ["usa", "United States", "US"],
  ["canada", "Canada", "CA"],
  ["australia", "Australia", "AU"],
  ["new-zealand", "New Zealand", "NZ"],
  ["sweden", "Sweden", "SE"],
  ["finland", "Finland", "FI"],
  ["denmark", "Denmark", "DK"],
  ["greece", "Greece", "GR"],
  ["malta", "Malta", "MT"],
  ["cyprus", "Cyprus", "CY"],
  ["south-korea", "South Korea", "KR"],
  ["malaysia", "Malaysia", "MY"],
];
destinations.forEach(([slug, name, code], i) => {
  add(`images/destinations/${slug}-hero.svg`, gradient(`Study in ${name}`, "GlobalEd Destinations", 1200, 800, i));
  add(`images/flags/${slug}.svg`, flag(code, i));
});

// --- Courses ---
const courseImages = [
  ["ielts-regular", "IELTS Regular"],
  ["ielts-executive", "IELTS Executive"],
  ["ielts-master", "IELTS Master Class"],
  ["spoken-english", "Spoken English"],
  ["one-to-one", "One-to-One"],
  ["language-club", "Language Club"],
  ["japanese", "Japanese Language"],
];
courseImages.forEach(([slug, label], i) => {
  add(`images/courses/${slug}.svg`, gradient(label, "GlobalEd Courses", 800, 600, i + 1));
});

// --- Testimonials ---
const testimonialInitials = ["FI", "MA", "SH", "TR", "NR", "SS"];
testimonialInitials.forEach((initials, i) => {
  add(`images/testimonials/student-${i + 1}.svg`, avatar(initials, i));
});

// --- Team ---
team: {
  const teamInitials = ["MR", "SA", "TH", "NJ", "AC", "PD"];
  teamInitials.forEach((initials, i) => {
    add(`images/team/member-${i + 1}.svg`, avatar(initials, i + 2, 600));
  });
}

// --- Events ---
const eventImages = [
  ["expo-2026", "Education Expo 2026"],
  ["mock-test", "IELTS Mock Test Day"],
  ["uk-admission-day", "UK Admission Day"],
  ["aus-fair", "Australia Education Fair"],
  ["uk-day-1", "UK Admission Day"],
  ["uk-day-2", "UK Admission Day"],
  ["aus-fair-1", "Australia Fair"],
  ["aus-fair-2", "Australia Fair"],
];
eventImages.forEach(([slug, label], i) => {
  add(`images/events/${slug}.svg`, gradient(label, "GlobalEd Events", 1200, 675, i));
});

// --- Blog covers ---
const blogImages = [
  ["study-in-uk-guide", "Study in UK Guide"],
  ["sweden-scholarships", "Sweden Scholarships"],
  ["ielts-writing-band7", "IELTS Writing Band 7"],
  ["ielts-vs-pte", "IELTS vs PTE"],
  ["speaking-confidence", "Speaking Confidence"],
  ["study-in-malaysia", "Study in Malaysia"],
];
blogImages.forEach(([slug, label], i) => {
  add(`images/blog/${slug}.svg`, gradient(label, "GlobalEd Blog", 1200, 675, i + 3));
});

// --- Misc ---
add("images/hero/home-hero.svg", gradient("Your Future Starts Here", "IELTS | Study Abroad", 1200, 900, 0));
add("images/og-default.svg", gradient("GlobalEd", "IELTS & Study Abroad Consultancy", 1200, 630, 1));
add("images/logos/sister-language-club.svg", gradient("Language Club", "", 400, 200, 4));
add("images/logos/sister-foundation.svg", gradient("Foundation", "", 400, 200, 5));

let count = 0;
for (const [path, content] of files) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
  count++;
}
console.log(`Generated ${count} placeholder images in public/images/`);
