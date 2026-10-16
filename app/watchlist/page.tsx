"use client";
import Link from "next/link";
import { useState } from "react";
import { Poster } from "@/components/Poster";
import { Rating } from "@/components/MovieCard";
import { year } from "@/lib/constants";
import { useWatchlist } from "@/lib/watchlist";

export default function WatchlistPage() {
  const { list, setWatched, remove } = useWatchlist();
  const [tab, setTab] = useState<"todo" | "watched">("todo");
  const shown = list.filter((m) => (tab === "watched" ? m.watched : !m.watched));
  const watchedCount = list.filter((m) => m.watched).length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Your watchlist</h1>
          <p className="text-sm text-zinc-400">Saved in this browser. Tap ♡ on any movie to add it.</p>
        </div>
        {list.length > 0 && (
          <Link href="/for-you" className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-soft">
            Get picks based on this list →
          </Link>
        )}
      </div>
      <div className="mb-6 flex gap-2 text-sm">
        {(["todo", "watched"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 ${tab === t ? "bg-white text-black" : "bg-zinc-800 hover:bg-zinc-700"}`}>
            {t === "todo" ? `To watch (${list.length - watchedCount})` : `Watched (${watchedCount})`}
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-800 p-10 text-center text-zinc-400">
          {tab === "todo" ? (
            <>Nothing here yet. <Link href="/discover" className="text-accent-soft underline">Find something to watch</Link>.</>
          ) : "Movies you mark as watched show up here."}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {shown.map((m) => (
            <div key={m.id}>
              <Link href={`/movie/${m.id}`} className="block overflow-hidden rounded-xl ring-1 ring-zinc-800 hover:ring-accent/60">
                <Poster path={m.poster_path} title={m.title} id={m.id} />
              </Link>
              <p className="mt-2 line-clamp-1 text-sm font-medium">{m.title}</p>
              <p className="flex gap-2 text-xs text-zinc-400"><span>{year(m.release_date)}</span><Rating value={m.vote_average} /></p>
              <div className="mt-2 flex gap-2 text-xs">
                <button onClick={() => setWatched(m.id, !m.watched)} className="flex-1 rounded-md bg-zinc-800 py-1 hover:bg-zinc-700">
                  {m.watched ? "Unwatch" : "✓ Watched"}
                </button>
                <button onClick={() => remove(m.id)} className="rounded-md bg-zinc-800 px-2 py-1 hover:bg-red-900" aria-label={`Remove ${m.title}`}>
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
