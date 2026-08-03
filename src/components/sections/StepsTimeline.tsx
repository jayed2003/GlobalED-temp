import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    title: "Free Counselling",
    description: "Share your goals — we assess your profile and explore your options together.",
  },
  {
    title: "Destination & University",
    description: "Shortlist the right country, course, and university for your budget and ambitions.",
  },
  {
    title: "Application & Offer",
    description: "We prepare and submit flawless applications, then follow up until your offer arrives.",
  },
  {
    title: "Documentation",
    description: "Every document double-checked against the exact embassy checklist.",
  },
  {
    title: "Visa Application",
    description: "Mock interviews and precise filing — the reason behind our 97% success rate.",
  },
  {
    title: "Pre-Departure & Beyond",
    description: "Briefings, accommodation, airport pickup, and support after you land.",
  },
];

/** Home step-by-step study abroad process (IDP journey pattern). */
export default function StepsTimeline() {
  return (
    <section className="bg-primary-50 py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="How It Works"
          title="Your Step-by-Step Study Abroad Process"
          description="A clear, proven path from your first meeting with us to your first day abroad."
        />
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-700 font-heading text-lg font-bold text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold text-primary-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
