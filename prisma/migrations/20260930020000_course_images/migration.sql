-- Course images with the GlobalEd logo (made by scripts/generate-course-images.mjs)
-- in place of the SVG placeholders. Only courses still showing their placeholder
-- change, and alt text is only filled where it's empty, so anything uploaded or
-- written in the admin panel stays.
-- Apply right after deploying: the new files ship with the code.
UPDATE "Course" AS c SET
  "image" = v.image,
  "imageAlt" = CASE WHEN c."imageAlt" = '' THEN v.alt ELSE c."imageAlt" END
FROM (VALUES
  ('/images/courses/ielts-regular.svg', '/images/courses/ielts-regular.webp', 'IELTS Essential Package: the four IELTS modules — Listening, Reading, Writing and Speaking'),
  ('/images/courses/ielts-executive.svg', '/images/courses/ielts-executive.webp', 'IELTS Advanced Package: the four IELTS modules — Listening, Reading, Writing and Speaking'),
  ('/images/courses/ielts-master.svg', '/images/courses/ielts-master.webp', 'IELTS Premium Package: the four IELTS modules — Listening, Reading, Writing and Speaking'),
  ('/images/courses/spoken-english.svg', '/images/courses/spoken-english.webp', 'Spoken English: conversation speech bubbles and a microphone'),
  ('/images/courses/one-to-one.svg', '/images/courses/one-to-one.webp', 'One-to-One Coaching: an instructor and a student, one to one'),
  ('/images/courses/language-club.svg', '/images/courses/language-club.webp', 'Language Club: debates, movies, books and games around a conversation'),
  ('/images/courses/japanese.svg', '/images/courses/japanese.webp', 'Japanese Language: 日本語 on a red rising sun, with hiragana')
) AS v(old, image, alt)
WHERE c."image" = v.old;
