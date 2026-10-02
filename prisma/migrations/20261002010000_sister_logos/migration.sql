-- Sister-organization logos on About › Our Organization (made by
-- scripts/generate-sister-logos.mjs): Global Citizen Limited had none, the
-- Language Club and Foundation had SVG placeholders. A logo only changes while
-- it's still the placeholder (or empty), matched by organization name, so
-- anything uploaded or reordered in the admin panel stays. Covers the draft too.
-- Apply right before pushing main: the new files ship with the code.
WITH logos(name, old, src, alt) AS (VALUES
  ('Global Citizen Limited (GCL)', '', '/images/logos/global-citizen-limited.png', 'Global Citizen Limited logo'),
  ('GlobalEd Language Club', '/images/logos/sister-language-club.svg', '/images/logos/sister-language-club.png', 'GlobalEd Language Club logo'),
  ('GlobalEd Foundation', '/images/logos/sister-foundation.svg', '/images/logos/sister-foundation.png', 'GlobalEd Foundation logo')
)
UPDATE "SitePage" AS p SET "published" = jsonb_set(p."published", '{sisters,organizations}', (
  SELECT jsonb_agg(CASE WHEN l.src IS NOT NULL THEN jsonb_set(o, '{logo}', jsonb_build_object('src', l.src, 'alt', l.alt)) ELSE o END ORDER BY n)
  FROM jsonb_array_elements(p."published" #> '{sisters,organizations}') WITH ORDINALITY AS a(o, n)
  LEFT JOIN logos AS l ON l.name = o ->> 'name' AND l.old = coalesce(o #>> '{logo,src}', '')
))
WHERE p."key" = 'about-organization'
  AND jsonb_typeof(p."published" #> '{sisters,organizations}') = 'array'
  AND jsonb_array_length(p."published" #> '{sisters,organizations}') > 0;

WITH logos(name, old, src, alt) AS (VALUES
  ('Global Citizen Limited (GCL)', '', '/images/logos/global-citizen-limited.png', 'Global Citizen Limited logo'),
  ('GlobalEd Language Club', '/images/logos/sister-language-club.svg', '/images/logos/sister-language-club.png', 'GlobalEd Language Club logo'),
  ('GlobalEd Foundation', '/images/logos/sister-foundation.svg', '/images/logos/sister-foundation.png', 'GlobalEd Foundation logo')
)
UPDATE "SitePage" AS p SET "draft" = jsonb_set(p."draft", '{sisters,organizations}', (
  SELECT jsonb_agg(CASE WHEN l.src IS NOT NULL THEN jsonb_set(o, '{logo}', jsonb_build_object('src', l.src, 'alt', l.alt)) ELSE o END ORDER BY n)
  FROM jsonb_array_elements(p."draft" #> '{sisters,organizations}') WITH ORDINALITY AS a(o, n)
  LEFT JOIN logos AS l ON l.name = o ->> 'name' AND l.old = coalesce(o #>> '{logo,src}', '')
))
WHERE p."key" = 'about-organization'
  AND jsonb_typeof(p."draft" #> '{sisters,organizations}') = 'array'
  AND jsonb_array_length(p."draft" #> '{sisters,organizations}') > 0;
