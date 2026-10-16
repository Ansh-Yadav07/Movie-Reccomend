import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MovieRow } from "@/components/MovieGrid";
import { Rating } from "@/components/MovieCard";
import { Poster } from "@/components/Poster";
import { WatchlistButton } from "@/components/WatchlistButton";
import { WatchProviders } from "@/components/WatchProviders";
import { IMG, year } from "@/lib/constants";
import { getPrefs } from "@/lib/prefs";
import { getMovie, getProviders } from "@/lib/tmdb";
import type { MovieDetails } from "@/lib/types";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ surprise?: string }> };

async function load(id: string) {
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? getMovie(n) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const movie = await load((await params).id);
  return { title: movie ? `${movie.title} (${year(movie.release_date)})` : "Movie not found" };
}

const runtime = (min: number | null) => (min ? `${Math.floor(min / 60)}h ${min % 60}m` : null);

function certification(m: MovieDetails, region: string) {
  const r = m.release_dates?.results.find((x) => x.iso_3166_1 === region);
  return r?.release_dates.find((d) => d.certification)?.certification;
}

export default async function MoviePage({ params, searchParams }: Props) {
  const [movie, prefs, { surprise }] = await Promise.all([load((await params).id), getPrefs(), searchParams]);
  if (!movie) notFound();
  const providers = await getProviders(prefs.region);
  const providerNames = new Map(providers.map((p) => [p.provider_id, p.provider_name]));

  const trailer =
    movie.videos.results.find((v) => v.site === "YouTube" && v.type === "Trailer" && v.official) ??
    movie.videos.results.find((v) => v.site === "YouTube" && v.type === "Trailer");
  const hasMain = Boolean(trailer) || movie.credits.cast.length > 0;
  const director = movie.credits.crew.find((c) => c.job === "Director");
  const backdrop = IMG(movie.backdrop_path, "w1280");
  const facts = [year(movie.release_date), certification(movie, prefs.region), runtime(movie.runtime)].filter(Boolean);

  return (
    <div>
      <section className="relative -mx-4 -mt-6 mb-8 overflow-hidden px-4 pb-8 pt-10 sm:rounded-b-3xl">
        {backdrop && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={backdrop} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
        <div className="relative flex flex-col gap-6 sm:flex-row">
          <div className="w-44 shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-zinc-700 sm:w-60">
            <Poster path={movie.poster_path} title={movie.title} id={movie.id} size="w500" />
          </div>
          <div className="max-w-3xl">
            {surprise && (
              <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-accent/20 px-3 py-1 text-accent-soft">🎲 Your surprise pick</span>
                <a href="/surprise" className="text-zinc-400 hover:text-white">Roll again</a>
              </div>
            )}
            <h1 className="text-3xl font-black sm:text-4xl">{movie.title}</h1>
            {movie.tagline && <p className="mt-1 italic text-zinc-400">{movie.tagline}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
              <Rating value={movie.vote_average} />
              {facts.map((f) => <span key={f}>{f}</span>)}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <Link key={g.id} href={`/discover?genres=${g.id}`} className="rounded-full bg-zinc-800 px-3 py-1 text-xs hover:bg-zinc-700">
                  {g.name}
                </Link>
              ))}
            </div>
            <p className="mt-4 leading-relaxed text-zinc-200">{movie.overview}</p>
            {director && <p className="mt-3 text-sm text-zinc-400">Directed by <span className="text-zinc-200">{director.name}</span></p>}
            <div className="mt-5 flex flex-wrap gap-3">
              <WatchlistButton movie={{ ...movie, genre_ids: movie.genres.map((g) => g.id) }} variant="full" />
              {trailer && (
                <a href="#trailer" className="rounded-xl bg-zinc-800 px-5 py-2.5 text-sm font-semibold hover:bg-zinc-700">▶ Watch trailer</a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className={`mb-10 grid gap-8 ${hasMain ? "lg:grid-cols-[1fr_380px]" : "max-w-2xl"}`}>
        <div className={hasMain ? "space-y-8" : "hidden"}>
          {trailer && (
            <section id="trailer">
              <h2 className="mb-3 text-xl font-bold">Trailer</h2>
              <div className="aspect-video overflow-hidden rounded-2xl ring-1 ring-zinc-800">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${trailer.key}`}
                  title={trailer.name}
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          )}
          {movie.credits.cast.length > 0 && (
            <section>
              <h2 className="mb-3 text-xl font-bold">Cast</h2>
              <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar">
                {movie.credits.cast.slice(0, 14).map((c) => (
                  <div key={c.id} className="w-24 shrink-0 text-center">
                    <div className="mx-auto h-24 w-24 overflow-hidden rounded-full bg-zinc-800">
                      {c.profile_path && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={IMG(c.profile_path, "w185")!} alt={c.name} loading="lazy" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs font-medium">{c.name}</p>
                    <p className="line-clamp-1 text-[11px] text-zinc-500">{c.character}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <WatchProviders all={movie["watch/providers"].results} region={prefs.region} mine={prefs.providers} providerNames={providerNames} />
      </div>

      <MovieRow title={`If you like ${movie.title}`} movies={movie.recommendations.results} />
      <MovieRow title="Similar movies" movies={movie.similar.results} />
    </div>
  );
}
