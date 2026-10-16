import Link from "next/link";
import { MovieRow } from "@/components/MovieGrid";
import { PlatformPicker } from "@/components/PlatformPicker";
import { ProviderLogo } from "@/components/ProviderLogo";
import { MOODS } from "@/lib/constants";
import { filtersToQuery, parseFilters } from "@/lib/filters";
import { getPrefs } from "@/lib/prefs";
import { discover, getProviders, getTrending } from "@/lib/tmdb";

export default async function Home() {
  const prefs = await getPrefs();
  const base = parseFilters({}, prefs);
  const [providers, trending, popular, topRated, fresh] = await Promise.all([
    getProviders(prefs.region),
    getTrending(),
    discover(base),
    discover({ ...base, sort: "vote_average.desc" }),
    discover({ ...base, sort: "primary_release_date.desc", minRating: 6 }),
  ]);
  const mine = providers.filter((p) => prefs.providers.includes(p.provider_id));
  const has = mine.length > 0;
  const on = has ? "on your platforms" : "right now";

  return (
    <div>
      <section className="mb-10 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-rose-950/60 p-6 ring-1 ring-zinc-800 sm:p-10">
        <h1 className="max-w-2xl text-3xl font-black leading-tight sm:text-5xl">
          What should you watch <span className="text-accent">tonight?</span>
        </h1>
        <p className="mt-3 max-w-xl text-zinc-300">
          Pick a mood and we&apos;ll find movies you can actually stream{has ? " on " : "."}
          {has && <strong className="text-white">{mine.map((p) => p.provider_name).join(", ")}</strong>}
          {has && "."}
        </p>
        {has && (
          <div className="mt-4 flex items-center gap-2">
            {mine.slice(0, 8).map((p) => <ProviderLogo key={p.provider_id} provider={p} size={32} />)}
            <Link href="/platforms" className="ml-2 text-sm text-accent-soft hover:underline">Change</Link>
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <Link
              key={m.slug}
              href={`/discover?${filtersToQuery({ genres: m.genres, minRating: m.minRating, sort: m.sort })}`}
              className="rounded-full bg-zinc-800/80 px-4 py-2 text-sm hover:bg-zinc-700"
            >
              {m.emoji} {m.label}
            </Link>
          ))}
          <a href="/surprise" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-soft">
            🎲 Surprise me
          </a>
        </div>
      </section>

      {!has && (
        <section className="mb-10 rounded-2xl border border-zinc-800 p-5">
          <h2 className="text-xl font-bold">Which platforms do you have?</h2>
          <p className="mb-4 text-sm text-zinc-400">Choose your subscriptions and every recommendation will only show what you can watch.</p>
          <PlatformPicker providers={providers} selected={prefs.providers} initialCount={12} />
        </section>
      )}

      <MovieRow title={`Popular ${on}`} movies={popular.results} href="/discover" />
      <MovieRow title={`Top rated ${on}`} movies={topRated.results} href={`/discover?${filtersToQuery({ sort: "vote_average.desc" })}`} />
      <MovieRow title={`New ${on}`} movies={fresh.results} href={`/discover?${filtersToQuery({ sort: "primary_release_date.desc", minRating: 6 })}`} />
      <MovieRow title="Trending everywhere this week" movies={trending} />
    </div>
  );
}
