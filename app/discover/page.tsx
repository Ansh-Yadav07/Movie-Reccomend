import type { Metadata } from "next";
import { FiltersPanel } from "@/components/FiltersPanel";
import { LoadMore } from "@/components/LoadMore";
import { MovieGrid } from "@/components/MovieGrid";
import { filtersToQuery, parseFilters } from "@/lib/filters";
import { getPrefs } from "@/lib/prefs";
import { discover, getGenres, getProviders } from "@/lib/tmdb";

export const metadata: Metadata = { title: "Discover" };

export default async function DiscoverPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const prefs = await getPrefs();
  const filters = parseFilters(await searchParams, prefs);
  const [results, genres, providers] = await Promise.all([discover(filters), getGenres(), getProviders(filters.region)]);
  const names = providers.filter((p) => filters.providers.includes(p.provider_id)).map((p) => p.provider_name);
  const query = filtersToQuery({ ...filters, page: 1 });

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <FiltersPanel filters={filters} genres={genres} providers={providers} saved={prefs.providers} />
      <div>
        <h1 className="text-2xl font-bold">Discover</h1>
        <p className="mb-5 text-sm text-zinc-400">
          {results.total_results.toLocaleString()} {results.total_results === 1 ? "movie" : "movies"}
          {names.length ? ` on ${names.join(", ")}` : " across every platform"}
        </p>
        {results.results.length ? (
          <>
            <MovieGrid movies={results.results} />
            <LoadMore
              key={query}
              endpoint={`/api/discover?${query}`}
              startPage={results.page}
              totalPages={results.total_pages}
              seen={results.results.map((m) => m.id)}
            />
          </>
        ) : (
          <p className="rounded-xl border border-dashed border-zinc-800 p-10 text-center text-zinc-400">
            Nothing matches. Try removing a filter or adding another platform.
          </p>
        )}
      </div>
    </div>
  );
}
