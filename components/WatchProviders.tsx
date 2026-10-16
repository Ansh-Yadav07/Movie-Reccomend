import { REGIONS, flag } from "@/lib/constants";
import { streamable } from "@/lib/tmdb";
import type { Provider, RegionProviders } from "@/lib/types";
import { ProviderLogo } from "./ProviderLogo";

const GROUPS: { key: keyof RegionProviders; label: string }[] = [
  { key: "flatrate", label: "Stream" },
  { key: "free", label: "Free" },
  { key: "ads", label: "Free with ads" },
  { key: "rent", label: "Rent" },
  { key: "buy", label: "Buy" },
];

type Props = { all: Record<string, RegionProviders>; region: string; mine: number[]; providerNames: Map<number, string> };

export function WatchProviders({ all, region, mine, providerNames }: Props) {
  const here = all[region];
  const regionName = REGIONS.find((r) => r.code === region)?.name ?? region;
  const onMine = streamable(here).filter((p) => mine.includes(p.provider_id));

  // Where else this streams on platforms the user has, for when it's not available locally.
  const elsewhere = mine.length && !onMine.length
    ? REGIONS.filter((r) => r.code !== region)
        .map((r) => ({ r, ps: streamable(all[r.code]).filter((p) => mine.includes(p.provider_id)) }))
        .filter((x) => x.ps.length)
    : [];

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold">Where to watch in {flag(region)} {regionName}</h2>
        {here?.link && (
          <a href={here.link} target="_blank" rel="noreferrer" className="text-xs text-accent-soft hover:underline">
            All options →
          </a>
        )}
      </div>

      {mine.length > 0 && (
        <p className={`mb-4 rounded-lg px-3 py-2 text-sm ${onMine.length ? "bg-emerald-950/60 text-emerald-300" : "bg-zinc-800/60 text-zinc-300"}`}>
          {onMine.length
            ? `✓ Included with your ${onMine.map((p) => p.provider_name).join(" and ")}`
            : "Not included with any of your platforms here."}
        </p>
      )}

      {here ? (
        <div className="space-y-4">
          {GROUPS.map(({ key, label }) => {
            const list = here[key] as Provider[] | undefined;
            if (!list?.length) return null;
            return (
              <div key={key}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</h3>
                <div className="flex flex-wrap gap-2">
                  {list.map((p) => (
                    <span
                      key={p.provider_id}
                      title={p.provider_name}
                      className={`flex items-center gap-2 rounded-lg pr-3 text-sm ${mine.includes(p.provider_id) ? "bg-emerald-900/40 ring-1 ring-emerald-600" : "bg-zinc-800/70"}`}
                    >
                      <ProviderLogo provider={p} size={34} />
                      {p.provider_name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-zinc-400">No streaming, rental or purchase options listed in {regionName} yet.</p>
      )}

      {elsewhere.length > 0 && (
        <div className="mt-5 border-t border-zinc-800 pt-4 text-sm text-zinc-300">
          <p className="mb-2 font-semibold">On your platforms in other countries</p>
          <ul className="space-y-1 text-zinc-400">
            {elsewhere.slice(0, 6).map(({ r, ps }) => (
              <li key={r.code}>
                {flag(r.code)} {r.name}: {ps.map((p) => providerNames.get(p.provider_id) ?? p.provider_name).join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
