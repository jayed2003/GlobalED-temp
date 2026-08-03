import Container from "@/components/layout/Container";
import { site } from "@/data/site";

/** Trust statistics band (PFEC / IECC pattern). */
export default function StatsBand() {
  const stats = [
    { value: site.stats.studentsPlaced, label: "Students Placed" },
    { value: site.stats.partnerUniversities, label: "Partner Universities" },
    { value: site.stats.visaSuccessRate, label: "Visa Success Rate" },
    { value: site.stats.yearsOfExperience, label: "Years of Experience" },
  ];

  return (
    <section aria-label="GlobalEd statistics" className="bg-primary-700 py-10">
      <Container className="grid grid-cols-2 gap-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-heading text-3xl font-bold text-accent-400 sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-primary-100">{stat.label}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
