/** Animated confirmation panel shown after a successful submission. */
export default function FormSuccess({
  message,
  onReset,
}: {
  message: string;
  onReset: () => void;
}) {
  return (
    <div role="status" className="py-8 text-center">
      <div className="mx-auto flex h-20 w-20 animate-pop items-center justify-center rounded-full bg-green-100 motion-reduce:animate-none">
        <svg viewBox="0 0 24 24" className="h-10 w-10 text-green-600" fill="none" aria-hidden>
          <path
            d="M5 12.5l4.5 4.5L19 7.5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="30"
            className="animate-draw motion-reduce:animate-none"
          />
        </svg>
      </div>
      <h3 className="mt-5 font-heading text-xl font-bold text-primary-900">You&apos;re all set!</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-neutral-600">{message}</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 text-sm font-semibold text-primary-700 underline-offset-4 hover:underline"
      >
        Submit another enquiry
      </button>
    </div>
  );
}
