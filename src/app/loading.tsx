import Container from "@/components/layout/Container";

/** Route-level skeleton shown during navigation. */
export default function Loading() {
  return (
    <div className="py-16 sm:py-24" role="status" aria-label="Loading page">
      <Container>
        <div className="animate-pulse space-y-8">
          <div className="space-y-3">
            <div className="h-10 w-2/3 max-w-md rounded-lg bg-neutral-200" />
            <div className="h-4 w-1/2 rounded bg-neutral-200" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 rounded-xl bg-neutral-200" />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
