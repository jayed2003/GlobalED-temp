"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

/** Error boundary with retry. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="py-24 sm:py-32">
      <Container className="text-center">
        <TriangleAlert size={56} aria-hidden className="mx-auto text-accent-500" />
        <h1 className="mt-6 font-heading text-3xl font-bold text-primary-900">
          Something went wrong
        </h1>
        <p className="mt-3 text-neutral-600">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-8">
          <Button onClick={reset}>Try Again</Button>
        </div>
      </Container>
    </section>
  );
}
