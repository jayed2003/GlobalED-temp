import { clientColumns, type FilterOptions, type ListConfig, type ListQuery } from "./core";

export type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** The AdminTable props that come straight from a list config. */
export function listProps(config: ListConfig, query: ListQuery, valueOptions: FilterOptions = {}) {
  return {
    columns: clientColumns(config.columns, valueOptions),
    extraFilters: clientColumns(config.extraFilters ?? [], valueOptions),
    section: config.section,
    page: query.page,
    pageSize: config.pageSize,
    dateLabel: config.dateLabel,
  };
}

const dhakaDate = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", day: "2-digit", month: "2-digit", year: "numeric" });
const utcDate = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" });

/** Timestamps (created/received) as the Bangladesh calendar date. */
export const formatDhakaDate = (d: Date) => dhakaDate.format(d);
/** Date-only fields (publish date, event date) are stored as UTC midnight. */
export const formatDayOnly = (d: Date) => utcDate.format(d);
