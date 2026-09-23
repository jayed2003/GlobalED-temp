/**
 * Admin list tooling: search, per-column filters, date filters and paging,
 * driven entirely by the URL query string, so a filtered view survives a
 * refresh, can be shared, and is exactly what "delete all matching" and the
 * CSV export act on.
 *
 *   ?q=rahim&f_status=NEW&date=7d&page=2
 *   ?date=custom&from=2026-09-01&to=2026-09-15
 *
 * Each section's config (sections.ts) is plain data, so the same object
 * builds the Prisma `where` on the server and the filter controls in the
 * browser.
 */

export type Where = Record<string, unknown>;

export type ColumnFilter =
  /** Case-insensitive "contains" over one or more fields (dot paths for relations). */
  | { kind: "text"; fields: string[] }
  /** Pick-list: each option carries the Prisma condition it stands for. */
  | { kind: "select"; options: { value: string; label: string; where: Where }[] }
  /** Exact whole number. */
  | { kind: "number"; field: string };

export interface ListColumn {
  key: string;
  label: string;
  filter?: ColumnFilter;
}

export interface ListConfig {
  section: string;
  columns: ListColumn[];
  /** Filters that aren't a column (e.g. branch, read/unread), shown in the toolbar. */
  extraFilters?: ListColumn[];
  /** Fields the global search box looks in. */
  searchFields: string[];
  dateField: string;
  dateLabel: string;
  /** Date-only columns (event date, publish date) are stored as UTC midnight. */
  dateOnly?: boolean;
  orderBy: Where | Where[];
  /** Page size; lists without one show everything that matches. */
  pageSize?: number;
}

export type DatePreset = "1h" | "24h" | "7d" | "custom";
export const DATE_PRESETS: { value: DatePreset; label: string }[] = [
  { value: "1h", label: "Last hour" },
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "custom", label: "Custom range" },
];

export interface ListQuery {
  q: string;
  filters: Record<string, string>;
  date?: DatePreset;
  from?: string;
  to?: string;
  page: number;
}

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

type RawParams = Record<string, string | string[] | undefined> | URLSearchParams;

function get(params: RawParams, key: string): string {
  const v = params instanceof URLSearchParams ? params.get(key) : params[key];
  return (Array.isArray(v) ? v[0] : v)?.trim() ?? "";
}

export function parseListQuery(config: ListConfig, params: RawParams): ListQuery {
  const filters: Record<string, string> = {};
  for (const col of [...config.columns, ...(config.extraFilters ?? [])]) {
    const value = get(params, `f_${col.key}`);
    if (value && col.filter) filters[col.key] = value.slice(0, 200);
  }
  const date = get(params, "date") as DatePreset;
  const page = Number.parseInt(get(params, "page"), 10);
  return {
    q: get(params, "q").slice(0, 200),
    filters,
    date: DATE_PRESETS.some((p) => p.value === date) ? date : undefined,
    from: ISO_DAY.test(get(params, "from")) ? get(params, "from") : undefined,
    to: ISO_DAY.test(get(params, "to")) ? get(params, "to") : undefined,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/** "destination.name" + condition -> { destination: { name: condition } } */
function atPath(path: string, condition: unknown): Where {
  return path
    .split(".")
    .reverse()
    .reduce<unknown>((inner, key) => ({ [key]: inner }), condition) as Where;
}

function contains(fields: string[], text: string): Where {
  const clauses = fields.map((f) => atPath(f, { contains: text, mode: "insensitive" }));
  return clauses.length === 1 ? clauses[0] : { OR: clauses };
}

function dateRange(config: ListConfig, query: ListQuery): Where | undefined {
  const now = Date.now();
  const hours = { "1h": 1, "24h": 24, "7d": 24 * 7 }[query.date as "1h" | "24h" | "7d"];
  if (hours) return atPath(config.dateField, { gte: new Date(now - hours * 3_600_000), lte: new Date(now) });
  if (query.date !== "custom" || (!query.from && !query.to)) return undefined;
  // Calendar days: Bangladesh time for timestamps, UTC midnight for date-only fields.
  const zone = config.dateOnly ? "Z" : "+06:00";
  const range: Where = {};
  if (query.from) range.gte = new Date(`${query.from}T00:00:00${zone}`);
  if (query.to) range.lte = new Date(`${query.to}T23:59:59.999${zone}`);
  return atPath(config.dateField, range);
}

/** Prisma `where` for the current search, filters and date range. */
export function buildWhere(config: ListConfig, query: ListQuery, base?: Where): Where {
  const and: Where[] = base ? [base] : [];
  if (query.q) and.push(contains(config.searchFields, query.q));

  for (const col of [...config.columns, ...(config.extraFilters ?? [])]) {
    const value = query.filters[col.key];
    const filter = col.filter;
    if (!value || !filter) continue;
    if (filter.kind === "text") and.push(contains(filter.fields, value));
    if (filter.kind === "select") {
      const option = filter.options.find((o) => o.value === value);
      if (option) and.push(option.where);
    }
    if (filter.kind === "number") {
      const n = Number.parseInt(value, 10);
      // Out-of-range numbers would make the database reject the query.
      if (Number.isFinite(n) && Math.abs(n) <= 2_147_483_647) and.push(atPath(filter.field, n));
    }
  }

  const range = dateRange(config, query);
  if (range) and.push(range);
  return and.length ? { AND: and } : {};
}

/** Paging for configs with a pageSize (otherwise everything). */
export function paging(config: ListConfig, query: ListQuery): { skip?: number; take?: number } {
  if (!config.pageSize) return {};
  return { skip: (query.page - 1) * config.pageSize, take: config.pageSize };
}

/** The parts of a config the browser needs to draw the filter controls. */
export function clientColumns(columns: ListColumn[]) {
  return columns.map((c) => ({
    key: c.key,
    label: c.label,
    filter: c.filter
      ? c.filter.kind === "select"
        ? { kind: "select" as const, options: c.filter.options.map(({ value, label }) => ({ value, label })) }
        : { kind: c.filter.kind }
      : undefined,
  }));
}

export type ClientColumn = ReturnType<typeof clientColumns>[number];
