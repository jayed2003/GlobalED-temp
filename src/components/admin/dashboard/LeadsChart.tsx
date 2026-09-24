import type { LeadStats } from "@/lib/dashboard";
import { cn } from "@/lib/utils";

const shortDate = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", day: "numeric", month: "short" });

/** A round axis top at or above `n`, with a whole-number middle line. */
function axisTop(n: number): number {
  return [4, 6, 10, 20, 40, 60, 100, 200, 400, 600, 1000].find((s) => s >= n) ?? Math.ceil(n / 1000) * 1000;
}

/**
 * Leads per week for the last 12 weeks (rolling 7-day windows, the latest
 * highlighted). Bars are plain elements so labels stay crisp at any width;
 * screen readers get the same numbers as a table.
 */
export default function LeadsChart({ weeks }: { weeks: LeadStats["weeks"] }) {
  const top = axisTop(Math.max(...weeks.map((w) => w.count)));
  const range = (w: LeadStats["weeks"][number]) => `${shortDate.format(w.start)} – ${shortDate.format(new Date(w.end.getTime() - 1))}`;

  return (
    <figure>
      <div aria-hidden className="relative mt-5 h-40">
        {[1, 0.5, 0].map((f) => (
          <div key={f} className="absolute inset-x-0 border-t border-dashed border-neutral-200" style={{ bottom: `${f * 100}%` }}>
            <span className="absolute -top-2 left-0 bg-white pr-1 text-[10px] leading-none tabular-nums text-neutral-400">
              {top * f}
            </span>
          </div>
        ))}
        <div className="absolute inset-y-0 left-7 right-0 flex items-end gap-1.5 sm:gap-2">
          {weeks.map((w, i) => {
            const latest = i === weeks.length - 1;
            return (
              <div key={i} title={`${range(w)}: ${w.count} ${w.count === 1 ? "lead" : "leads"}`} className="group flex h-full flex-1 items-end">
                <div
                  className={cn(
                    "relative w-full rounded-t-md transition-colors",
                    w.count === 0 ? "bg-neutral-200" : latest ? "bg-accent-500" : "bg-primary-500 group-hover:bg-primary-700",
                  )}
                  style={{ height: w.count ? `${(w.count / top) * 100}%` : "2px" }}
                >
                  {w.count > 0 && (
                    <span className="absolute inset-x-0 bottom-full mb-1 text-center text-[11px] font-semibold tabular-nums text-neutral-600">
                      {w.count}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div aria-hidden className="ml-7 mt-2 flex gap-1.5 sm:gap-2">
        {weeks.map((w, i) => (
          <span
            key={i}
            // Every other week (every fourth on phones), always including the latest.
            className={cn(
              "flex-1 whitespace-nowrap text-center text-[10px] text-neutral-400",
              (weeks.length - 1 - i) % 4 !== 0 && "invisible sm:visible",
            )}
          >
            {(weeks.length - 1 - i) % 2 === 0 ? (i === weeks.length - 1 ? "This week" : shortDate.format(w.start)) : ""}
          </span>
        ))}
      </div>
      <table className="sr-only">
        <caption>Leads per week, last 12 weeks</caption>
        <thead>
          <tr>
            <th scope="col">Week</th>
            <th scope="col">Leads</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((w, i) => (
            <tr key={i}>
              <th scope="row">{range(w)}</th>
              <td>{w.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
