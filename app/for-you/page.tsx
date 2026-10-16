"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MovieGrid } from "@/components/MovieGrid";
import type { Movie } from "@/lib/types";
import { useWatchlist } from "@/lib/watchlist";

type Result = { picks: Movie[]; badges: Record<number, string>; matches: Movie[]; hasPlatforms: boolean };

export default function ForYouPage() {
  const { list } = useWatchlist();
  const [data, setData] = useState<Result | null>(null);
  const [error, setError] = useState(false);
  const seeds = [...list].sort((a, b) => b.addedAt - a.addedAt).slice(0, 6).map((m) => m.id).join(",");
  const exclude = list.map((m) => m.id).join(",");

  useEffect(() => {
    if (!seeds) return;
    let cancelled = false;
    setData(null);
    setError(false);
    fetch(`/api/for-you?seeds=${seeds}&exclude=${exclude}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: Result) => !cancelled && setData(d))
      .catch(() => !cancelled && setError(true));
    return () => { cancelled = true; };
  }, [seeds, exclude]);

  if (!list.length) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="text-2xl font-bold">Picks just for you</h1>
        <p className="mt-2 text-zinc-400">
          Save a few movies you love with ♡ and we&apos;ll recommend more like them, prioritising ones on your platforms.
        </p>
        <Link href="/discover" className="mt-6 inline-block rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white">
          Start browsing
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Picks for you</h1>
      <p className="mb-6 text-sm text-zinc-400">
        Based on {list.slice(0, 3).map((m) => m.title).join(", ")}{list.length > 3 ? ` and ${list.length - 3} more` : ""} in your watchlist.
      </p>
      {error && <p className="text-red-400">Couldn&apos;t load recommendations. Try refreshing.</p>}
      {!data && !error && <p className="animate-pulse text-zinc-400">Finding movies you&apos;ll like…</p>}
      {data && (
        <>
          {!data.hasPlatforms && (
            <p className="mb-6 rounded-lg bg-zinc-900 px-4 py-3 text-sm text-zinc-300">
              Tip: <Link href="/platforms" className="text-accent-soft underline">pick your platforms</Link> to see which of these you can stream.
            </p>
          )}
          {data.picks.length ? <MovieGrid movies={data.picks} badges={data.badges} /> : <p className="text-zinc-400">No recommendations yet for these titles.</p>}
          {data.hasPlatforms && data.matches.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-4 text-xl font-bold">Top rated in your favourite genres on your platforms</h2>
              <MovieGrid movies={data.matches} />
            </section>
          )}
        </>
      )}
    </div>
  );
}
