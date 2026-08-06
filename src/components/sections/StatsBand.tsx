import Container from "@/components/layout/Container";
import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/data/site";

type ParsedStat = { value: number; prefix: string; suffix: string };

/** Parses values like "5,000+" or "97%" into a number plus suffix. */
function parseStat(raw: string): ParsedStat {
  const match = raw.match(/^([\d,.]+)(.*)$/);
  if (!match) return { value: 0, prefix: "", suffix: raw };
  return {
    value: parseInt(match[1].replace(/,/g, ""), 10) || 0,
    prefix: "",
    suffix: match[2],
  };
}

/** Trust statistics band (PFEC / IECC pattern) with animated counters. */
export default function StatsBand() {
  const stats = [
    { raw: site.stats.studentsPlaced, label: "Students Placed" },
    { raw: site.stats.partnerUniversities, label: "Partner Universities" },
    { raw: site.stats.visaSuccessRate, label: "Visa Success Rate" },
    { raw: site.stats.yearsOfExperience, label: "Years of Experience" },
  ];

  return (
    <section aria-label="GlobalEd statistics" className="bg-primary-700 py-10">
      <Container className="grid grid-cols-2 gap-8 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const { value, suffix } = parseStat(stat.raw);
          return (
            <Reveal key={stat.label} delay={index * 120} from="up">
              <div className="text-center">
                <p className="font-heading text-3xl font-bold text-accent-400 sm:text-4xl">
                  <CountUp end={value} suffix={suffix} />
                </p>
                <p className="mt-1 text-sm text-primary-100">{stat.label}</p>
              </div>
            </Reveal>
          );
        })}
      </Container>
    </section>
  );
}
