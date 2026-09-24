/**
 * An editable title that keeps the brand styling: if it contains "GlobalEd",
 * the "Ed" is shown in the brand green (as in "About GlobalEd").
 */
export default function BrandTitle({ text }: { text: string }) {
  const at = text.indexOf("GlobalEd");
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}Global<span className="text-accent-500">Ed</span>
      {text.slice(at + "GlobalEd".length)}
    </>
  );
}
