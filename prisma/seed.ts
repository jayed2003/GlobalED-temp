import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, CourseCategory, BlogCategory, EventStatus, Prisma } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import { destinations } from "../src/data/destinations";
import { courses } from "../src/data/courses";
import { ielts } from "../src/data/ielts";
import { posts } from "../src/data/posts";
import { events } from "../src/data/events";
import { testimonials } from "../src/data/testimonials";

// Prisma 7 no longer loads .env or connects without a driver adapter.
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const courseCategoryMap: Record<string, CourseCategory> = {
  ielts: CourseCategory.IELTS,
  english: CourseCategory.ENGLISH,
  "other-languages": CourseCategory.OTHER_LANGUAGES,
};

const blogCategoryMap: Record<string, BlogCategory> = {
  "country-wise": BlogCategory.COUNTRY_WISE,
  scholarships: BlogCategory.SCHOLARSHIPS,
  ielts: BlogCategory.IELTS,
  english: BlogCategory.ENGLISH,
};

const eventStatusMap: Record<string, EventStatus> = {
  upcoming: EventStatus.UPCOMING,
  previous: EventStatus.PREVIOUS,
};

/** Host of the database this run would touch (printed in every guard message). */
function databaseHost(): string {
  try {
    return new URL(process.env.DATABASE_URL ?? "").hostname || "(unknown)";
  } catch {
    return "(unknown)";
  }
}

/**
 * The full seed DELETES all leads and content before reloading sample data.
 * Refuse unless this is clearly a throwaway database:
 *  - never in a production environment (NODE_ENV=production, or on Vercel);
 *  - never when the database already holds real data (any lead or contact
 *    message, or more than one admin) — unless SEED_CONFIRM_RESET is set to
 *    this database's exact host name, so wiping one can't happen by accident.
 */
async function assertSafeToReset() {
  const host = databaseHost();
  const hardStops: string[] = [];
  if (process.env.NODE_ENV === "production") hardStops.push("NODE_ENV is 'production'");
  if (process.env.VERCEL_ENV) hardStops.push(`running on Vercel (VERCEL_ENV=${process.env.VERCEL_ENV})`);

  // The seed is for empty databases: any existing content counts as real data
  // (a live site with no leads yet still has edited destinations, posts, …).
  const [leads, messages, admins, destinations, courses, posts, events, reviews] = await Promise.all([
    prisma.lead.count(),
    prisma.contactMessage.count(),
    prisma.adminUser.count(),
    prisma.destination.count(),
    prisma.course.count(),
    prisma.blogPost.count(),
    prisma.eventItem.count(),
    prisma.testimonial.count(),
  ]);
  const realData = [
    [leads, "lead(s)"],
    [messages, "contact message(s)"],
    [destinations, "destination(s)"],
    [courses, "course(s)"],
    [posts, "blog post(s)"],
    [events, "event(s)"],
    [reviews, "review(s)"],
  ]
    .filter(([n]) => (n as number) > 0)
    .map(([n, what]) => `${n} ${what}`);
  if (admins > 1) realData.push(`${admins} admin accounts`);

  const confirmed = process.env.SEED_CONFIRM_RESET === host;
  if (hardStops.length === 0 && (realData.length === 0 || confirmed)) return;

  console.error("");
  console.error(`✖ Refusing to reset database "${host}".`);
  console.error("  The full seed deletes ALL leads, destinations, courses, blog posts, events and reviews.");
  console.error("");
  if (hardStops.length) console.error(`  Production environment: ${hardStops.join("; ")}. A reset is never allowed here.`);
  if (realData.length) {
    console.error(`  This database already has real data: ${realData.join(", ")}.`);
    if (!hardStops.length) {
      console.error(`  If you really mean to wipe it, re-run with SEED_CONFIRM_RESET=${host}`);
    }
  }
  console.error("");
  console.error("  To only create the master admin (no deletions): SEED_ADMIN_ONLY=1 npx prisma db seed");
  console.error("");
  process.exit(1);
}

/**
 * Create the master admin from SEED_ADMIN_* if it doesn't exist. An existing
 * account is left alone unless SEED_ADMIN_RESET_PASSWORD=1 (e.g. locked out).
 */
async function seedAdmin() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminName = process.env.SEED_ADMIN_NAME ?? "GlobalEd Admin";

  if (!adminEmail || !adminPassword) {
    console.warn("SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set — skipping admin user seed.");
    return;
  }
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const existing = await prisma.adminUser.findFirst({ where: { email: { equals: adminEmail, mode: "insensitive" } } });
  if (!existing) {
    await prisma.adminUser.create({ data: { name: adminName, email: adminEmail, passwordHash, role: "ADMIN" } });
    console.log(`Created master admin: ${adminEmail}`);
  } else if (process.env.SEED_ADMIN_RESET_PASSWORD === "1") {
    await prisma.adminUser.update({ where: { id: existing.id }, data: { passwordHash } });
    console.log(`Reset the password of existing admin: ${adminEmail}`);
  } else {
    console.log(`Admin ${adminEmail} already exists — left unchanged (SEED_ADMIN_RESET_PASSWORD=1 to reset its password).`);
  }
}

async function main() {
  console.log(`Seeding database "${databaseHost()}"`);

  // Safe mode: only the admin account, nothing is deleted.
  if (process.env.SEED_ADMIN_ONLY === "1") {
    await seedAdmin();
    return;
  }

  await assertSafeToReset();

  // Clear in FK-safe order so this script is safely re-runnable.
  await prisma.lead.deleteMany();
  await prisma.ieltsPreparationCourse.deleteMany();
  await prisma.destinationFaq.deleteMany();
  await prisma.destinationUniversity.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.ieltsContent.deleteMany();
  await prisma.course.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.eventItem.deleteMany();
  await prisma.testimonial.deleteMany();

  // --- Courses ---
  const courseIdBySlug = new Map<string, string>();
  for (const [index, c] of courses.entries()) {
    const created = await prisma.course.create({
      data: {
        slug: c.slug,
        title: c.title,
        category: courseCategoryMap[c.category],
        image: c.image,
        overview: c.overview,
        curriculum: c.curriculum,
        duration: c.duration,
        schedule: c.schedule,
        price: c.price,
        badge: c.badge,
        sortOrder: index,
      },
    });
    courseIdBySlug.set(c.slug, created.id);
  }
  console.log(`Seeded ${courses.length} courses.`);

  // --- Destinations (+ nested universities/faqs) ---
  for (const [index, d] of destinations.entries()) {
    await prisma.destination.create({
      data: {
        slug: d.slug,
        name: d.name,
        tagline: d.tagline,
        heroImage: d.heroImage,
        flagImage: d.flagImage,
        overview: d.overview,
        whyStudyHere: d.whyStudyHere,
        tuitionRange: d.tuitionRange,
        livingCost: d.livingCost,
        scholarships: d.scholarships,
        visaInfo: d.visaInfo,
        sortOrder: index,
        universities: {
          create: d.popularUniversities.map((u, i) => ({ name: u.name, city: u.city, sortOrder: i })),
        },
        faqs: {
          create: d.faqs.map((f, i) => ({ q: f.q, a: f.a, sortOrder: i })),
        },
      },
    });
  }
  console.log(`Seeded ${destinations.length} destinations.`);

  // --- IELTS hub singleton ---
  await prisma.ieltsContent.create({
    data: {
      id: "main",
      whatIsIeltsTitle: ielts.whatIsIelts.title,
      whatIsIeltsBody: ielts.whatIsIelts.body,
      whatIsIeltsPoints: ielts.whatIsIelts.points,
      whyIeltsTitle: ielts.whyIelts.title,
      whyIeltsBody: ielts.whyIelts.body,
      whyIeltsReasons: ielts.whyIelts.reasons as unknown as Prisma.InputJsonValue,
      whyGlobaledTitle: ielts.whyGlobaled.title,
      whyGlobaledBody: ielts.whyGlobaled.body,
      whyGlobaledUsps: ielts.whyGlobaled.usps as unknown as Prisma.InputJsonValue,
      whyGlobaledFreeServices: ielts.whyGlobaled.freeServices as unknown as Prisma.InputJsonValue,
      preparationTitle: ielts.preparation.title,
      preparationBody: ielts.preparation.body,
      preparationSkillAreas: ielts.preparation.skillAreas as unknown as Prisma.InputJsonValue,
      progressTrackerTitle: ielts.progressTracker.title,
      progressTrackerBody: ielts.progressTracker.body,
      progressTrackerTrackItems: ielts.progressTracker.trackItems,
      progressTrackerBenefits: ielts.progressTracker.benefits,
      successStoriesTitle: ielts.successStories.title,
      successStoriesBody: ielts.successStories.body,
      successStoriesAchievements: ielts.successStories.achievements as unknown as Prisma.InputJsonValue,
      successStoriesQuotes: ielts.successStories.quotes,
    },
  });

  for (const [index, slug] of ielts.preparation.courseSlugs.entries()) {
    const courseId = courseIdBySlug.get(slug);
    if (!courseId) {
      console.warn(`IELTS preparation references unknown course slug "${slug}" — skipping.`);
      continue;
    }
    await prisma.ieltsPreparationCourse.create({
      data: { ieltsContentId: "main", courseId, sortOrder: index },
    });
  }
  console.log("Seeded IELTS hub content.");

  // --- Blog posts ---
  for (const p of posts) {
    await prisma.blogPost.create({
      data: {
        slug: p.slug,
        title: p.title,
        category: blogCategoryMap[p.category],
        coverImage: p.coverImage,
        excerpt: p.excerpt,
        content: p.content,
        author: p.author,
        publishedAt: new Date(p.publishedAt),
        featured: p.featured ?? false,
      },
    });
  }
  console.log(`Seeded ${posts.length} blog posts.`);

  // --- Events ---
  for (const e of events) {
    await prisma.eventItem.create({
      data: {
        slug: e.slug,
        title: e.title,
        status: eventStatusMap[e.status],
        date: new Date(e.date),
        time: e.time,
        venue: e.venue,
        bannerImage: e.bannerImage,
        description: e.description,
        gallery: e.gallery ?? [],
      },
    });
  }
  console.log(`Seeded ${events.length} events.`);

  // --- Testimonials (review images) ---
  for (const [index, t] of testimonials.entries()) {
    await prisma.testimonial.create({
      data: {
        studentName: t.studentName,
        reviewImage: t.reviewImage,
        university: t.university,
        country: t.country,
        sortOrder: index,
      },
    });
  }
  console.log(`Seeded ${testimonials.length} testimonials.`);

  await seedAdmin();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
