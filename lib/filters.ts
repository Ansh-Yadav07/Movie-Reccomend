import { SORTS, type SortKey } from "./constants";

export type Filters = {
  region: string;
  providers: number[];
  monetization: string;
  genres: number[];
  yearFrom?: number;
  yearTo?: number;
  minRating?: number;
  maxRuntime?: number;
  language?: string;
  sort: SortKey;
  page: number;
};

export type Prefs = { region: string; providers: number[] };

type SP = URLSearchParams | Record<string, string | string[] | undefined>;

function get(sp: SP, key: string): string | undefined {
  if (sp instanceof URLSearchParams) return sp.get(key) ?? undefined;
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

export const ids = (s?: string | null) =>
  s ? s.split(/[,|]/).map(Number).filter((n) => Number.isInteger(n) && n > 0) : [];

const num = (s?: string) => {
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
};

/** Reads discover filters from a query string. Missing platforms fall back to the saved ones. */
export function parseFilters(sp: SP, prefs: Prefs): Filters {
  const providers = get(sp, "providers");
  const sort = get(sp, "sort") as SortKey | undefined;
  return {
    region: get(sp, "region") || prefs.region,
    providers: providers === undefined ? prefs.providers : ids(providers),
    monetization: get(sp, "monetization") || "flatrate",
    genres: ids(get(sp, "genres")),
    yearFrom: num(get(sp, "from")),
    yearTo: num(get(sp, "to")),
    minRating: num(get(sp, "rating")),
    maxRuntime: num(get(sp, "runtime")),
    language: get(sp, "lang") || undefined,
    sort: sort && SORTS.some((s) => s.value === sort) ? sort : "popularity.desc",
    page: Math.min(Math.max(num(get(sp, "page")) ?? 1, 1), 500),
  };
}

export function filtersToQuery(f: Partial<Filters>): string {
  const q = new URLSearchParams();
  if (f.providers) q.set("providers", f.providers.join(","));
  if (f.monetization && f.monetization !== "flatrate") q.set("monetization", f.monetization);
  if (f.genres?.length) q.set("genres", f.genres.join(","));
  if (f.yearFrom) q.set("from", String(f.yearFrom));
  if (f.yearTo) q.set("to", String(f.yearTo));
  if (f.minRating) q.set("rating", String(f.minRating));
  if (f.maxRuntime) q.set("runtime", String(f.maxRuntime));
  if (f.language) q.set("lang", f.language);
  if (f.sort && f.sort !== "popularity.desc") q.set("sort", f.sort);
  if (f.page && f.page > 1) q.set("page", String(f.page));
  return q.toString();
}
