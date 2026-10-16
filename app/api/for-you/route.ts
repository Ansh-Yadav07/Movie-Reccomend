import { NextResponse, type NextRequest } from "next/server";
import { ids } from "@/lib/filters";
import { getPrefs } from "@/lib/prefs";
import { discover, getRecommendations, getWatchProviders, streamable } from "@/lib/tmdb";
import type { Movie } from "@/lib/types";

/**
 * Personal picks from the watchlist: blends TMDB recommendations for the most recently
 * saved movies, then checks which picks stream on the user's platforms.
 */
export async function GET(req: NextRequest) {
  const prefs = await getPrefs();
  const seeds = ids(req.nextUrl.searchParams.get("seeds")).slice(0, 6);
  const exclude = new Set([...seeds, ...ids(req.nextUrl.searchParams.get("exclude"))]);

  const lists = await Promise.all(seeds.map((id) => getRecommendations(id).catch(() => [] as Movie[])));
  const scored = new Map<number, { movie: Movie; score: number }>();
  lists.forEach((list, seedIndex) =>
    list.forEach((movie, rank) => {
      if (exclude.has(movie.id)) return;
      // Earlier ranks and more recently saved seeds count more; overlap between seeds adds up.
      const gain = (1 - rank / 25) * (1 - seedIndex * 0.08);
      const cur = scored.get(movie.id);
      scored.set(movie.id, { movie, score: (cur?.score ?? 0) + gain });
    }),
  );
  let picks = [...scored.values()]
    .sort((a, b) => b.score - a.score || b.movie.vote_average - a.movie.vote_average)
    .slice(0, 24)
    .map((x) => x.movie);

  const badges: Record<number, string> = {};
  if (prefs.providers.length) {
    const checked = picks.slice(0, 18);
    const avail = await Promise.all(checked.map((m) => getWatchProviders(m.id).catch(() => ({}))));
    checked.forEach((m, i) => {
      const on = streamable((avail[i] as Record<string, never>)[prefs.region]).filter((p) => prefs.providers.includes(p.provider_id));
      if (on.length) badges[m.id] = `On ${on[0].provider_name}`;
    });
    picks = [...picks.filter((m) => badges[m.id]), ...picks.filter((m) => !badges[m.id])];
  }

  // Favourite genres across the picks, used for a platform-only discovery row.
  const genreCount = new Map<number, number>();
  picks.forEach((m) => m.genre_ids.forEach((g) => genreCount.set(g, (genreCount.get(g) ?? 0) + 1)));
  const topGenres = [...genreCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([g]) => g);
  const matches = topGenres.length
    ? (await discover({ region: prefs.region, providers: prefs.providers, monetization: "flatrate", genres: topGenres, sort: "vote_average.desc", page: 1 }))
        .results.filter((m) => !exclude.has(m.id) && !scored.has(m.id))
    : [];

  return NextResponse.json({ picks, badges, matches, topGenres, hasPlatforms: prefs.providers.length > 0 });
}
