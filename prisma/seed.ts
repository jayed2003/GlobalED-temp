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

async function main() {
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

  // --- Seed admin user (upsert so re-running doesn't wipe other admins) ---
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminName = process.env.SEED_ADMIN_NAME ?? "GlobalEd Admin";

  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.adminUser.upsert({
      where: { email: adminEmail },
      update: {},
      create: { name: adminName, email: adminEmail, passwordHash, role: "ADMIN" },
    });
    console.log(`Seeded admin user: ${adminEmail}`);
  } else {
    console.warn(
      "SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set — skipping admin user seed. Set them in .env.local to get a working login.",
    );
  }
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
