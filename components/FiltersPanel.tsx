"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LANGUAGES, MONETIZATION, SORTS } from "@/lib/constants";
import { filtersToQuery, type Filters } from "@/lib/filters";
import type { Genre, Provider } from "@/lib/types";
import { PlatformPicker } from "./PlatformPicker";

const THIS_YEAR = new Date().getFullYear();
const ERAS = [
  { label: "Any year", from: undefined, to: undefined },
  { label: "Last 2 years", from: THIS_YEAR - 1, to: undefined },
  { label: "2020s", from: 2020, to: 2029 },
  { label: "2010s", from: 2010, to: 2019 },
  { label: "2000s", from: 2000, to: 2009 },
  { label: "1990s", from: 1990, to: 1999 },
  { label: "Before 1990", from: undefined, to: 1989 },
];
const RATINGS = [0, 6, 7, 7.5, 8];
const RUNTIMES = [0, 90, 120, 150];

const select = "w-full rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-2 text-sm outline-none focus:border-accent";

type Props = { filters: Filters; genres: Genre[]; providers: Provider[]; saved: number[] };

export function FiltersPanel({ filters, genres, providers, saved }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);

  const apply = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch, page: 1 };
    start(() => router.replace(`/discover?${filtersToQuery(next)}`, { scroll: false }));
  };

  const eraIndex = Math.max(0, ERAS.findIndex((e) => e.from === filters.yearFrom && e.to === filters.yearTo));
  const toggleGenre = (id: number) =>
    apply({ genres: filters.genres.includes(id) ? filters.genres.filter((g) => g !== id) : [...filters.genres, id] });
  const same = (a: number[], b: number[]) => a.length === b.length && a.every((x) => b.includes(x));

  return (
    <aside className={`space-y-6 ${pending ? "opacity-70" : ""}`}>
      <button onClick={() => setOpen((o) => !o)} className="w-full rounded-lg bg-zinc-900 py-2 text-sm font-semibold lg:hidden">
        {open ? "Hide filters" : "Show filters"}
      </button>
      <div className={`space-y-6 ${open ? "" : "hidden lg:block"}`}>
        <section>
          <h3 className="mb-2 text-sm font-semibold text-zinc-200">Platforms</h3>
          <div className="mb-3 flex flex-wrap gap-2 text-xs">
            {saved.length > 0 && (
              <button
                onClick={() => apply({ providers: saved })}
                className={`rounded-full px-3 py-1 ${same(filters.providers, saved) ? "bg-accent text-white" : "bg-zinc-800 hover:bg-zinc-700"}`}
              >
                My platforms
              </button>
            )}
            <button
              onClick={() => apply({ providers: [] })}
              className={`rounded-full px-3 py-1 ${filters.providers.length === 0 ? "bg-accent text-white" : "bg-zinc-800 hover:bg-zinc-700"}`}
            >
              All movies
            </button>
          </div>
          <PlatformPicker
            key={filters.providers.join(",")}
            providers={providers}
            selected={filters.providers}
            onChange={(ids) => apply({ providers: ids })}
            initialCount={8}
            compact
          />
          {filters.providers.length > 0 && (
            <select value={filters.monetization} onChange={(e) => apply({ monetization: e.target.value })} className={`${select} mt-3`}>
              {MONETIZATION.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          )}
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-zinc-200">Genres</h3>
          <div className="flex flex-wrap gap-1.5">
            {genres.map((g) => {
              const on = filters.genres.includes(g.id);
              return (
                <button
                  key={g.id}
                  onClick={() => toggleGenre(g.id)}
                  aria-pressed={on}
                  className={`rounded-full border px-2.5 py-1 text-xs ${on ? "border-accent bg-accent/20 text-white" : "border-zinc-800 text-zinc-300 hover:border-zinc-600"}`}
                >
                  {g.name}
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <label className="text-xs text-zinc-400">
            Sort by
            <select value={filters.sort} onChange={(e) => apply({ sort: e.target.value as Filters["sort"] })} className={`${select} mt-1`}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
          <label className="text-xs text-zinc-400">
            Released
            <select value={eraIndex} onChange={(e) => { const era = ERAS[Number(e.target.value)]; apply({ yearFrom: era.from, yearTo: era.to }); }} className={`${select} mt-1`}>
              {ERAS.map((e, i) => <option key={e.label} value={i}>{e.label}</option>)}
            </select>
          </label>
          <label className="text-xs text-zinc-400">
            Minimum rating
            <select value={filters.minRating ?? 0} onChange={(e) => apply({ minRating: Number(e.target.value) || undefined })} className={`${select} mt-1`}>
              {RATINGS.map((r) => <option key={r} value={r}>{r ? `★ ${r}+` : "Any rating"}</option>)}
            </select>
          </label>
          <label className="text-xs text-zinc-400">
            Length
            <select value={filters.maxRuntime ?? 0} onChange={(e) => apply({ maxRuntime: Number(e.target.value) || undefined })} className={`${select} mt-1`}>
              {RUNTIMES.map((r) => <option key={r} value={r}>{r ? `Under ${r / 60 >= 1 ? `${Math.floor(r / 60)}h${r % 60 ? ` ${r % 60}m` : ""}` : `${r}m`}` : "Any length"}</option>)}
            </select>
          </label>
          <label className="col-span-2 text-xs text-zinc-400 lg:col-span-1">
            Original language
            <select value={filters.language ?? ""} onChange={(e) => apply({ language: e.target.value || undefined })} className={`${select} mt-1`}>
              {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </label>
        </section>

        <a
          href={`/surprise?${filtersToQuery(filters)}`}
          className="block rounded-xl bg-gradient-to-r from-accent to-orange-500 py-2.5 text-center text-sm font-bold text-white hover:opacity-90"
        >
          🎲 Surprise me with these filters
        </a>
      </div>
    </aside>
  );
}
