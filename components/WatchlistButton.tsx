"use client";
import { useWatchlist } from "@/lib/watchlist";
import type { Movie } from "@/lib/types";

export function WatchlistButton({ movie, variant = "icon" }: { movie: Movie; variant?: "icon" | "full" }) {
  const { has, toggle } = useWatchlist();
  const saved = has(movie.id);
  if (variant === "full") {
    return (
      <button
        onClick={() => toggle(movie)}
        className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
          saved ? "bg-zinc-800 text-white hover:bg-zinc-700" : "bg-accent text-white hover:bg-accent-soft"
        }`}
      >
        {saved ? "✓ In your watchlist" : "+ Add to watchlist"}
      </button>
    );
  }
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(movie);
      }}
      aria-label={saved ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}
      className={`grid h-8 w-8 place-items-center rounded-full text-lg backdrop-blur transition ${
        saved ? "bg-accent text-white" : "bg-black/60 text-white opacity-0 group-hover:opacity-100 focus:opacity-100"
      }`}
    >
      {saved ? "♥" : "♡"}
    </button>
  );
}
