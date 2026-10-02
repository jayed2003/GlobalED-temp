-- Blog covers with the GlobalEd logo (made by scripts/generate-blog-images.mjs)
-- in place of the SVG placeholders. Only posts still showing their placeholder
-- change, and alt text is only filled where it's empty, so anything uploaded or
-- written in the admin panel stays.
-- Apply right after deploying: the new files ship with the code.
UPDATE "BlogPost" AS b SET
  "coverImage" = v.image,
  "coverImageAlt" = CASE WHEN b."coverImageAlt" = '' THEN v.alt ELSE b."coverImageAlt" END
FROM (VALUES
  ('/images/blog/study-in-uk-guide.svg', '/images/blog/study-in-uk-guide.jpg', 'Study in the UK: the Houses of Parliament and Big Ben across the River Thames in London'),
  ('/images/blog/sweden-scholarships.svg', '/images/blog/sweden-scholarships.jpg', 'Top 5 scholarships in Sweden: Riddarholmen Church and the Stockholm waterfront'),
  ('/images/blog/ielts-writing-band7.svg', '/images/blog/ielts-writing-band7.jpg', 'IELTS Writing Task 2: an essay sheet and band scores rising from 6.0 to 7.0'),
  ('/images/blog/ielts-vs-pte.svg', '/images/blog/ielts-vs-pte.jpg', 'IELTS vs PTE Academic vs Duolingo English Test, with each test''s score range'),
  ('/images/blog/speaking-confidence.svg', '/images/blog/speaking-confidence.jpg', 'Speak with confidence in 90 days: speech bubbles and a 90-day progress ring'),
  ('/images/blog/study-in-malaysia.svg', '/images/blog/study-in-malaysia.jpg', 'Study in Malaysia: the Petronas Twin Towers and the Kuala Lumpur skyline at night')
) AS v(old, image, alt)
WHERE b."coverImage" = v.old;
