import type { Metadata } from "next";
import { MovieGrid } from "@/components/MovieGrid";
import { searchMovies } from "@/lib/tmdb";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim();
  const results = q ? await searchMovies(q) : null;
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">{q ? `Results for “${q}”` : "Search"}</h1>
      <p className="mb-6 text-sm text-zinc-400">
        {results ? `${results.total_results.toLocaleString()} movies found` : "Type a title in the search bar above."}
      </p>
      {results && (results.results.length ? <MovieGrid movies={results.results} /> : <p className="text-zinc-400">No movies match that title.</p>)}
    </div>
  );
}
