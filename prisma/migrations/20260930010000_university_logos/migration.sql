-- AlterTable
ALTER TABLE "DestinationUniversity" ADD COLUMN     "logo" TEXT NOT NULL DEFAULT '';

-- Logos for one flagship university per destination (the home page's partner
-- strip). Only fills empty logos, so an uploaded logo is never overwritten.
UPDATE "DestinationUniversity" AS u SET "logo" = v.logo
FROM (VALUES
  ('University of Manchester', '/images/universities/university-of-manchester.webp'),
  ('Arizona State University', '/images/universities/arizona-state-university.webp'),
  ('University of British Columbia (Okanagan)', '/images/universities/university-of-british-columbia.webp'),
  ('University of Melbourne', '/images/universities/university-of-melbourne.webp'),
  ('University of Auckland', '/images/universities/university-of-auckland.webp'),
  ('Lund University', '/images/universities/lund-university.webp'),
  ('University of Helsinki', '/images/universities/university-of-helsinki.webp'),
  ('University of Copenhagen', '/images/universities/university-of-copenhagen.webp'),
  ('National and Kapodistrian University of Athens', '/images/universities/national-and-kapodistrian-university-of-athens.webp'),
  ('University of Malta', '/images/universities/university-of-malta.webp'),
  ('University of Nicosia', '/images/universities/university-of-nicosia.webp'),
  ('Seoul National University', '/images/universities/seoul-national-university.webp'),
  ('University of Malaya', '/images/universities/university-of-malaya.webp')
) AS v(name, logo)
WHERE u."name" = v.name AND u."logo" = '';
