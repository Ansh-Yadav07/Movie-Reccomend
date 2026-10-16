import { isDemo } from "@/lib/tmdb";

export function DemoBanner() {
  if (!isDemo()) return null;
  return (
    <div className="border-b border-amber-900/50 bg-amber-950/40 px-4 py-2 text-center text-xs text-amber-200">
      Sample mode: showing 24 built-in movies with made-up platform availability. Add a free TMDB key as{" "}
      <code className="rounded bg-black/40 px-1">TMDB_API_KEY</code> in <code className="rounded bg-black/40 px-1">.env.local</code> for real data.
    </div>
  );
}
