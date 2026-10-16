import type { Movie } from "@/lib/types";
import { MovieCard } from "./MovieCard";

export function MovieGrid({ movies, badges }: { movies: Movie[]; badges?: Record<number, string> }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} badge={badges?.[m.id]} />
      ))}
    </div>
  );
}

export function MovieRow({ title, movies, href }: { title: string; movies: Movie[]; href?: string }) {
  if (!movies.length) return null;
  return (
    <section className="mb-10">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        {href && (
          <a href={href} className="text-sm text-accent-soft hover:underline">
            See all →
          </a>
        )}
      </div>
      <div className="-mx-4 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 no-scrollbar">
        {movies.map((m) => (
          <div key={m.id} className="w-36 shrink-0 snap-start sm:w-40">
            <MovieCard movie={m} />
          </div>
        ))}
      </div>
    </section>
  );
}
