// Server-side TMDB client. Falls back to sample data when TMDB_API_KEY is not set.
import {
  DEMO_GENRES, DEMO_MOVIES, DEMO_PROVIDERS, demoDetails, demoMovie, demoRecommendations, demoWatchProviders,
} from "./demo";
import type { Filters } from "./filters";
import type { Genre, Movie, MovieDetails, Paged, Provider, RegionProviders } from "./types";

const BASE = process.env.TMDB_API_BASE || "https://api.themoviedb.org/3";
const DAY = 86400;

export const isDemo = () => !process.env.TMDB_API_KEY;

class TmdbError extends Error {
  constructor(public status: number, path: string) {
    super(`TMDB request ${path} failed with ${status}`);
  }
}

async function tmdb<T>(path: string, params: Record<string, string | number | undefined> = {}, revalidate = 3600): Promise<T> {
  const key = process.env.TMDB_API_KEY!;
  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  const headers: Record<string, string> = { accept: "application/json" };
  // v4 read access tokens are JWTs; v3 keys go in the query string.
  if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;
  else url.searchParams.set("api_key", key);
  const res = await fetch(url, { headers, next: { revalidate } });
  if (!res.ok) throw new TmdbError(res.status, path);
  return res.json() as Promise<T>;
}

const paged = (results: Movie[], page: number, size = 20): Paged<Movie> => ({
  page,
  results: results.slice((page - 1) * size, page * size),
  total_pages: Math.max(1, Math.ceil(results.length / size)),
  total_results: results.length,
});

export async function getGenres(): Promise<Genre[]> {
  if (isDemo()) return DEMO_GENRES;
  return (await tmdb<{ genres: Genre[] }>("/genre/movie/list", { language: "en-US" }, DAY)).genres;
}

/** Streaming platforms available in a region, most popular first. */
export async function getProviders(region: string): Promise<Provider[]> {
  if (isDemo()) return DEMO_PROVIDERS;
  type Raw = Provider & { display_priorities?: Record<string, number> };
  const { results } = await tmdb<{ results: Raw[] }>("/watch/providers/movie", { watch_region: region, language: "en-US" }, DAY);
  return results
    .map((p) => ({
      provider_id: p.provider_id,
      provider_name: p.provider_name,
      logo_path: p.logo_path,
      display_priority: p.display_priorities?.[region] ?? p.display_priority ?? 999,
    }))
    .sort((a, b) => a.display_priority - b.display_priority);
}

export async function getTrending(): Promise<Movie[]> {
  if (isDemo()) return [...DEMO_MOVIES].sort((a, b) => b.pop - a.pop).slice(0, 20).map(demoMovie);
  return (await tmdb<Paged<Movie>>("/trending/movie/week", { language: "en-US" })).results;
}

export async function discover(f: Filters): Promise<Paged<Movie>> {
  const today = new Date().toISOString().slice(0, 10);
  if (isDemo()) {
    const list = DEMO_MOVIES.filter((d) => {
      const y = Number(d.release_date.slice(0, 4));
      return (!f.providers.length || d.providers.some((p) => f.providers.includes(p))) &&
        (!f.genres.length || d.genre_ids.some((g) => f.genres.includes(g))) &&
        (!f.yearFrom || y >= f.yearFrom) && (!f.yearTo || y <= f.yearTo) &&
        (!f.minRating || d.vote_average >= f.minRating) && (!f.maxRuntime || d.runtime <= f.maxRuntime) &&
        (!f.language || d.original_language === f.language);
    });
    const by: Record<string, (a: (typeof list)[0], b: (typeof list)[0]) => number> = {
      "vote_average.desc": (a, b) => b.vote_average - a.vote_average,
      "primary_release_date.desc": (a, b) => b.release_date.localeCompare(a.release_date),
    };
    list.sort(by[f.sort] ?? ((a, b) => b.pop - a.pop));
    return paged(list.map(demoMovie), f.page);
  }
  const minVotes = { "vote_average.desc": 300, "primary_release_date.desc": 10 }[f.sort as string];
  const withProviders = f.providers.length > 0;
  return tmdb<Paged<Movie>>("/discover/movie", {
    language: "en-US",
    include_adult: "false",
    sort_by: f.sort,
    page: f.page,
    watch_region: f.region,
    with_watch_providers: withProviders ? f.providers.join("|") : undefined,
    with_watch_monetization_types: withProviders && f.monetization !== "any" ? f.monetization : undefined,
    with_genres: f.genres.length ? f.genres.join("|") : undefined,
    "primary_release_date.gte": f.yearFrom ? `${f.yearFrom}-01-01` : undefined,
    "primary_release_date.lte": f.yearTo ? `${f.yearTo}-12-31` : today,
    "vote_average.gte": f.minRating,
    "vote_count.gte": f.minRating ? Math.max(minVotes ?? 0, 100) : minVotes,
    "with_runtime.lte": f.maxRuntime,
    with_original_language: f.language,
  });
}

export async function searchMovies(query: string, page = 1): Promise<Paged<Movie>> {
  if (isDemo()) {
    const q = query.toLowerCase();
    return paged(DEMO_MOVIES.filter((d) => d.title.toLowerCase().includes(q)).map(demoMovie), page);
  }
  return tmdb<Paged<Movie>>("/search/movie", { query, page, include_adult: "false", language: "en-US" });
}

export async function getMovie(id: number): Promise<MovieDetails | null> {
  if (isDemo()) return demoDetails(id);
  try {
    return await tmdb<MovieDetails>(`/movie/${id}`, {
      language: "en-US",
      append_to_response: "videos,credits,recommendations,similar,watch/providers,release_dates",
    });
  } catch (e) {
    if (e instanceof TmdbError && e.status === 404) return null;
    throw e;
  }
}

export async function getRecommendations(id: number): Promise<Movie[]> {
  if (isDemo()) {
    const d = DEMO_MOVIES.find((x) => x.id === id);
    return d ? demoRecommendations(d) : [];
  }
  return (await tmdb<Paged<Movie>>(`/movie/${id}/recommendations`, { language: "en-US" }, DAY)).results;
}

export async function getWatchProviders(id: number): Promise<Record<string, RegionProviders>> {
  if (isDemo()) {
    const d = DEMO_MOVIES.find((x) => x.id === id);
    return d ? demoWatchProviders(d) : {};
  }
  return (await tmdb<{ results: Record<string, RegionProviders> }>(`/movie/${id}/watch/providers`, {}, DAY)).results;
}

/** Providers where the movie can be watched without paying per title. */
export const streamable = (rp?: RegionProviders) => [...(rp?.flatrate ?? []), ...(rp?.free ?? []), ...(rp?.ads ?? [])];
