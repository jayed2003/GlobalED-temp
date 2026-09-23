/**
 * Live SEO and readability report for a blog post, shown in the admin blog
 * form as the admin types (pure functions: no DOM, runs in the browser).
 *
 * Each check is good / ok / bad; a card's score is the average (good = 100,
 * ok = 50, bad = 0). Thresholds follow common SEO-plugin guidance:
 * title ≤ 60 characters, meta description 120–156, ≥ 300 words, keyword
 * density 0.5–2.5 %, Flesch reading ease ≥ 60, ≤ 25 % long sentences,
 * ≤ 10 % passive voice, ≥ 30 % transition words.
 */

import { isMostlyBengali } from "@/lib/bangla";
import { htmlToText } from "@/lib/rich-text";

export type CheckStatus = "good" | "ok" | "bad";
export interface Check {
  id: string;
  status: CheckStatus;
  message: string;
}
export interface Report {
  /** 0–100, or null when the card doesn't apply (e.g. readability of Bangla text). */
  score: number | null;
  checks: Check[];
}

export interface SeoInput {
  focusKeyword: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  slug: string;
  content: string;
  coverImage: string;
  coverImageAlt: string;
  ogImage: string;
  ogImageAlt: string;
  /** e.g. "globaled.io" — links to it count as internal. */
  siteHost: string;
}

export const SEO_TITLE_MAX = 60;
export const META_MIN = 120;
export const META_MAX = 156;
const SITE_SUFFIX = " | GlobalEd";

/** What search engines show as the title: the SEO title, else "Post title | GlobalEd". */
export function effectiveSeoTitle(input: Pick<SeoInput, "seoTitle" | "title">): string {
  return input.seoTitle.trim() || (input.title.trim() ? `${input.title.trim()}${SITE_SUFFIX}` : "");
}

/** What search engines show under the title: the meta description, else the excerpt. */
export function effectiveMetaDescription(input: Pick<SeoInput, "metaDescription" | "excerpt">): string {
  return (input.metaDescription.trim() || input.excerpt.trim()).replace(/\s+/g, " ");
}

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------

/** Lowercase, punctuation → spaces, single-spaced (works for Bangla too). */
function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{N}\p{M}]+/gu, " ").trim();
}

function countPhrase(text: string, phrase: string): number {
  const hay = ` ${normalize(text)} `;
  const needle = ` ${normalize(phrase)} `;
  if (needle.trim() === "") return 0;
  let count = 0;
  for (let i = hay.indexOf(needle); i !== -1; i = hay.indexOf(needle, i + needle.length - 1)) count++;
  return count;
}

const contains = (text: string, phrase: string) => countPhrase(text, phrase) > 0;

function words(text: string): string[] {
  return text.match(/[\p{L}\p{N}][\p{L}\p{N}\p{M}'’-]*/gu) ?? [];
}

function blocks(html: string, tag: string): string[] {
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "gi");
  return [...html.matchAll(re)].map((m) => htmlToText(m[1]));
}

function attrValues(html: string, tag: string, attr: string): (string | null)[] {
  const tags = html.match(new RegExp(`<${tag}\\b[^>]*>`, "gi")) ?? [];
  return tags.map((t) => {
    const m = t.match(new RegExp(`\\s${attr}="([^"]*)"`, "i"));
    return m ? m[1] : null;
  });
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?।])\s+/)
    .map((s) => s.trim())
    .filter((s) => words(s).length > 0);
}

function syllables(word: string): number {
  let w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  return Math.max(1, (w.match(/[aeiouy]{1,2}/g) ?? []).length);
}

function score(checks: Check[]): number {
  if (checks.length === 0) return 0;
  const points = checks.reduce((sum, c) => sum + (c.status === "good" ? 100 : c.status === "ok" ? 50 : 0), 0);
  return Math.round(points / checks.length);
}

function slugWords(text: string): string {
  return normalize(text).replace(/ /g, "-");
}

// ---------------------------------------------------------------------------
// SEO analysis
// ---------------------------------------------------------------------------

export function analyzeSeo(input: SeoInput): Report {
  const checks: Check[] = [];
  const add = (id: string, status: CheckStatus, message: string) => checks.push({ id, status, message });

  const kw = input.focusKeyword.trim();
  const text = htmlToText(input.content);
  const wordCount = words(text).length;
  const title = effectiveSeoTitle(input);
  const meta = effectiveMetaDescription(input);
  const paragraphs = blocks(input.content, "p").filter((p) => p.trim());
  const headings = [...blocks(input.content, "h2"), ...blocks(input.content, "h3")];
  const imageAlts = attrValues(input.content, "img", "alt");

  // --- focus keyword ---
  if (!kw) {
    add("keyword", "bad", "Set a focus keyword to analyse SEO.");
  } else {
    add("keyword", "good", `Focus keyword: “${kw}”.`);

    const inTitle = contains(title, kw);
    add(
      "kw-title",
      inTitle ? "good" : "bad",
      inTitle
        ? normalize(title).startsWith(normalize(kw))
          ? "Focus keyword starts the SEO title."
          : "Focus keyword appears in the SEO title."
        : "Add the focus keyword to the SEO title.",
    );
    add("kw-meta", contains(meta, kw) ? "good" : "bad", contains(meta, kw) ? "Focus keyword appears in the meta description." : "Add the focus keyword to the meta description.");

    if (isMostlyBengali(kw)) {
      add("kw-slug", "ok", "Slugs are English, so they can't contain a Bangla keyword — use its English meaning in the slug.");
    } else {
      const inSlug = input.slug.includes(slugWords(kw));
      add("kw-slug", inSlug ? "good" : "ok", inSlug ? "Focus keyword appears in the URL slug." : "Put the focus keyword in the URL slug.");
    }

    const intro = paragraphs[0] ?? "";
    add("kw-intro", contains(intro, kw) ? "good" : "bad", contains(intro, kw) ? "Focus keyword appears in the first paragraph." : "Use the focus keyword in the first paragraph.");

    const uses = countPhrase(text, kw);
    const density = wordCount ? (uses * 100) / wordCount : 0;
    const d = density.toFixed(1);
    if (uses === 0) add("kw-density", "bad", "The focus keyword isn't used in the text.");
    else if (wordCount < 100) add("kw-density", "ok", `Focus keyword used ${uses}× — write at least 100 words to check keyword density.`);
    else if (density < 0.5) add("kw-density", "ok", `Keyword density ${d}% (${uses}×) — use it a little more (aim 0.5–2.5%).`);
    else if (density <= 2.5) add("kw-density", "good", `Keyword density ${d}% (${uses}×) — good.`);
    else add("kw-density", density > 3.5 ? "bad" : "ok", `Keyword density ${d}% (${uses}×) — too often; it can read as keyword stuffing (aim 0.5–2.5%).`);

    if (headings.length === 0) add("kw-heading", "ok", "Add subheadings (H2/H3), ideally one with the focus keyword.");
    else add("kw-heading", headings.some((h) => contains(h, kw)) ? "good" : "ok", headings.some((h) => contains(h, kw)) ? "Focus keyword appears in a subheading." : "Use the focus keyword in at least one subheading.");

    const alts = [input.coverImageAlt, ...imageAlts.map((a) => a ?? "")];
    add("kw-alt", alts.some((a) => contains(a, kw)) ? "good" : "ok", alts.some((a) => contains(a, kw)) ? "An image's alt text includes the focus keyword." : "Consider including the focus keyword in an image's alt text.");
  }

  // --- title & description ---
  const tl = title.length;
  if (tl === 0) add("title-length", "bad", "Add a title.");
  else if (tl > SEO_TITLE_MAX) add("title-length", "bad", `SEO title is ${tl} characters — search engines cut it off after about ${SEO_TITLE_MAX}.`);
  else if (tl < 30) add("title-length", "ok", `SEO title is short (${tl}) — aim for 30–${SEO_TITLE_MAX} characters.`);
  else add("title-length", "good", `SEO title length (${tl}) is good.`);

  const ml = meta.length;
  const source = input.metaDescription.trim() ? "Meta description" : "Meta description (using the excerpt)";
  if (ml === 0) add("meta-length", "bad", "Add a meta description.");
  else if (ml > META_MAX) add("meta-length", "bad", `${source} is ${ml} chars — it will be cut off (aim ${META_MIN}–${META_MAX}).`);
  else if (ml < META_MIN) add("meta-length", ml < 50 ? "bad" : "ok", `${source} is ${ml} chars (aim ${META_MIN}–${META_MAX}).`);
  else add("meta-length", "good", `${source} length (${ml}) is good.`);

  // --- content ---
  if (wordCount >= 300) add("length", "good", `${wordCount} words — good length.`);
  else if (wordCount >= 150) add("length", "ok", `${wordCount} words — aim for at least 300.`);
  else add("length", "bad", `${wordCount} words — too short; aim for at least 300.`);

  const hrefs = attrValues(input.content, "a", "href").filter((h): h is string => !!h);
  const isInternal = (h: string) => h.startsWith("/") || h.includes(input.siteHost);
  const internal = hrefs.filter(isInternal).length;
  const external = hrefs.filter((h) => /^https?:\/\//i.test(h) && !isInternal(h)).length;
  if (internal && external) add("links", "good", `Has ${internal} internal and ${external} external link${internal + external > 2 ? "s" : ""}.`);
  else if (internal) add("links", "ok", `Has ${internal} internal link${internal > 1 ? "s" : ""} — add an external source too.`);
  else if (external) add("links", "ok", `Has ${external} external link${external > 1 ? "s" : ""} — add a link to another page on this site too.`);
  else add("links", "ok", "Add an internal or external link.");

  // --- images ---
  const missingAlt =
    (input.coverImage && !input.coverImageAlt.trim() ? 1 : 0) +
    (input.ogImage && !input.ogImageAlt.trim() ? 1 : 0) +
    imageAlts.filter((a) => !a || !a.trim()).length;
  if (input.coverImage || input.ogImage || imageAlts.length) {
    add("alt", missingAlt ? "bad" : "good", missingAlt ? `${missingAlt} image${missingAlt > 1 ? "s are" : " is"} missing alt text.` : "All images have alt text.");
  }

  if (input.ogImage) add("og", "good", "Social share image (OG image) is set.");
  else if (/\.svg(\?|$)/i.test(input.coverImage)) add("og", "bad", "The cover is an SVG, which social networks don't show — upload an OG image.");
  else if (input.coverImage) add("og", "ok", "No OG image — social shares will use the cover image.");
  else add("og", "bad", "Add a cover or OG image for social shares.");

  return { score: score(checks), checks };
}

// ---------------------------------------------------------------------------
// Readability (English)
// ---------------------------------------------------------------------------

const TRANSITIONS = [
  "also", "additionally", "furthermore", "moreover", "besides", "however", "therefore", "thus", "hence",
  "consequently", "meanwhile", "finally", "firstly", "secondly", "thirdly", "lastly", "first", "second",
  "next", "then", "because", "although", "though", "instead", "otherwise", "similarly", "likewise",
  "for example", "for instance", "in addition", "as a result", "in fact", "in short", "in conclusion",
  "on the other hand", "in contrast", "after that", "above all", "of course", "that is why", "so that",
  "even though", "as well as", "in other words", "to sum up", "overall", "still", "yet", "nevertheless",
];
const IRREGULAR_PARTICIPLES =
  "made|done|given|taken|seen|known|shown|written|built|found|held|kept|left|lost|paid|put|read|run|said|sent|set|told|thought|understood|won|chosen|driven|eaten|fallen|forgotten|gotten|hidden|spoken|stolen|taught|thrown|worn|brought|bought|caught|sold|spent|meant";
const PASSIVE = new RegExp(
  `\\b(am|is|are|was|were|be|been|being|get|gets|got|gotten)\\s+(\\w+ly\\s+)?(\\w+ed|${IRREGULAR_PARTICIPLES})\\b`,
  "i",
);

export function analyzeReadability(content: string): Report {
  const text = htmlToText(content);
  if (isMostlyBengali(text)) {
    return {
      score: null,
      checks: [{ id: "lang", status: "ok", message: "Readability scores are for English text — this post is in Bangla, so they're skipped." }],
    };
  }
  const allWords = words(text);
  if (allWords.length < 50) {
    return { score: null, checks: [{ id: "short", status: "ok", message: "Write at least 50 words to check readability." }] };
  }

  const checks: Check[] = [];
  const add = (id: string, status: CheckStatus, message: string) => checks.push({ id, status, message });
  const sentences = splitSentences(text);
  const sentenceCount = Math.max(1, sentences.length);

  // Flesch reading ease
  const syl = allWords.reduce((n, w) => n + syllables(w), 0);
  const flesch = Math.round(206.835 - 1.015 * (allWords.length / sentenceCount) - 84.6 * (syl / allWords.length));
  if (flesch >= 60) add("flesch", "good", `Flesch reading ease ${flesch} — easy to read.`);
  else if (flesch >= 50) add("flesch", "ok", `Flesch reading ease ${flesch} — fairly difficult; try shorter sentences.`);
  else add("flesch", "bad", `Flesch reading ease ${flesch} — difficult; use shorter sentences and simpler words.`);

  // Long sentences
  const long = sentences.filter((s) => words(s).length > 20).length;
  const longPct = Math.round((long * 100) / sentenceCount);
  add("long", longPct <= 25 ? "good" : longPct <= 35 ? "ok" : "bad", `${longPct}% of sentences are long (>20 words)${longPct <= 25 ? " — good." : " (aim ≤ 25%)."}`);

  // Passive voice
  const passivePct = Math.round((sentences.filter((s) => PASSIVE.test(s)).length * 100) / sentenceCount);
  add("passive", passivePct <= 10 ? "good" : passivePct <= 15 ? "ok" : "bad", `${passivePct}% passive voice${passivePct <= 10 ? " — good." : " (aim < 10%)."}`);

  // Transition words
  if (sentences.length >= 3) {
    const withTransition = sentences.filter((s) => TRANSITIONS.some((t) => contains(s, t))).length;
    const pct = Math.round((withTransition * 100) / sentenceCount);
    add("transitions", pct >= 30 ? "good" : pct >= 20 ? "ok" : "bad", `${pct}% of sentences use transition words${pct >= 30 ? " — good." : " (aim ≥ 30%)."}`);
  }

  // Paragraph length
  const paragraphs = blocks(content, "p").filter((p) => words(p).length > 0);
  const longParas = paragraphs.filter((p) => words(p).length > 150).length;
  add("paragraphs", longParas === 0 ? "good" : longParas === 1 ? "ok" : "bad", longParas === 0 ? "Paragraph lengths are good." : `${longParas} paragraph${longParas > 1 ? "s are" : " is"} longer than 150 words — split ${longParas > 1 ? "them" : "it"} up.`);

  // Subheading distribution
  const sections = content.split(/<h[23]\b[^>]*>/i).map((s) => words(htmlToText(s)).length);
  const hasHeadings = /<h[23]\b/i.test(content);
  const biggest = Math.max(...sections);
  if (!hasHeadings && allWords.length > 300) add("subheadings", "bad", "No subheadings — add H2/H3 headings to break up the text.");
  else if (biggest > 300) add("subheadings", "ok", `A section runs ${biggest} words without a subheading (aim ≤ 300).`);
  else add("subheadings", "good", "Subheadings are well distributed.");

  // Repeated sentence starts
  let run = 1;
  let worst = { count: 1, word: "" };
  for (let i = 1; i < sentences.length; i++) {
    const a = words(sentences[i - 1])[0]?.toLowerCase();
    const b = words(sentences[i])[0]?.toLowerCase();
    run = a && a === b ? run + 1 : 1;
    if (run > worst.count) worst = { count: run, word: b ?? "" };
  }
  if (worst.count >= 3) add("starts", "ok", `${worst.count} sentences in a row start with “${worst.word}” — vary them.`);

  return { score: score(checks), checks };
}
