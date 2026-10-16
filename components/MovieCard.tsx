import Link from "next/link";
import { year } from "@/lib/constants";
import type { Movie } from "@/lib/types";
import { Poster } from "./Poster";
import { WatchlistButton } from "./WatchlistButton";

export function Rating({ value }: { value: number }) {
  if (!value) return null;
  const color = value >= 7.5 ? "text-emerald-400" : value >= 6 ? "text-amber-400" : "text-zinc-400";
  return <span className={`font-semibold ${color}`}>★ {value.toFixed(1)}</span>;
}

export function MovieCard({ movie, badge }: { movie: Movie; badge?: string }) {
  return (
    <Link href={`/movie/${movie.id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-zinc-800 transition group-hover:-translate-y-1 group-hover:ring-accent/60">
        <Poster path={movie.poster_path} title={movie.title} id={movie.id} />
        <div className="absolute right-2 top-2">
          <WatchlistButton movie={movie} />
        </div>
        {badge && (
          <span className="absolute bottom-2 left-2 right-2 truncate rounded-md bg-black/75 px-2 py-1 text-[11px] font-medium text-emerald-300">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-2 px-0.5">
        <p className="line-clamp-1 text-sm font-medium group-hover:text-white">{movie.title}</p>
        <p className="flex gap-2 text-xs text-zinc-400">
          <span>{year(movie.release_date)}</span>
          <Rating value={movie.vote_average} />
        </p>
      </div>
    </Link>
  );
}
