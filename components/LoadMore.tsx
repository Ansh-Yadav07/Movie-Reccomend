"use client";
import { useState } from "react";
import type { Movie, Paged } from "@/lib/types";
import { MovieCard } from "./MovieCard";

/** Fetches further pages from an API route and appends them under the server-rendered first page. */
export function LoadMore({ endpoint, startPage, totalPages, seen }: { endpoint: string; startPage: number; totalPages: number; seen: number[] }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(startPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const sep = endpoint.includes("?") ? "&" : "?";
      const res = await fetch(`${endpoint}${sep}page=${page + 1}`);
      if (!res.ok) throw new Error();
      const data = (await res.json()) as Paged<Movie>;
      setMovies((cur) => {
        const ids = new Set([...seen, ...cur.map((m) => m.id)]);
        return [...cur, ...data.results.filter((m) => !ids.has(m.id))];
      });
      setPage(data.page);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {movies.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
        </div>
      )}
      {page < Math.min(totalPages, 500) && (
        <div className="mt-8 text-center">
          <button onClick={load} disabled={loading} className="rounded-xl bg-zinc-800 px-6 py-2.5 text-sm font-semibold hover:bg-zinc-700 disabled:opacity-50">
            {loading ? "Loading…" : error ? "Try again" : "Load more"}
          </button>
        </div>
      )}
    </>
  );
}
