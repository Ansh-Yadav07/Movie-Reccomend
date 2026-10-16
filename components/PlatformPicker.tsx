"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { saveProviders } from "@/lib/client-prefs";
import type { Provider } from "@/lib/types";
import { ProviderLogo } from "./ProviderLogo";

type Props = {
  providers: Provider[];
  selected: number[];
  /** When set, changes are reported here instead of being saved as "my platforms". */
  onChange?: (ids: number[]) => void;
  initialCount?: number;
  compact?: boolean;
};

export function PlatformPicker({ providers, selected, onChange, initialCount = 18, compact }: Props) {
  const router = useRouter();
  const [chosen, setChosen] = useState<number[]>(selected);
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? providers.filter((p) => p.provider_name.toLowerCase().includes(q)) : providers;
    if (q || showAll) return list;
    // Always keep chosen ones visible, even if they rank low.
    const top = list.slice(0, initialCount);
    const extra = list.filter((p) => chosen.includes(p.provider_id) && !top.includes(p));
    return [...top, ...extra];
  }, [providers, query, showAll, initialCount, chosen]);

  function update(next: number[]) {
    setChosen(next);
    if (onChange) return onChange(next);
    saveProviders(next);
    router.refresh();
  }

  const toggle = (id: number) => update(chosen.includes(id) ? chosen.filter((x) => x !== id) : [...chosen, id]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${providers.length} platforms`}
          className="min-w-0 flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-accent"
        />
        {chosen.length > 0 && (
          <button onClick={() => update([])} className="rounded-lg px-3 py-2 text-sm text-zinc-400 hover:text-white">
            Clear ({chosen.length})
          </button>
        )}
      </div>
      <div className={`grid gap-2 ${compact ? "grid-cols-2 text-xs sm:grid-cols-3 lg:grid-cols-2" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"}`}>
        {visible.map((p) => {
          const on = chosen.includes(p.provider_id);
          return (
            <button
              key={p.provider_id}
              onClick={() => toggle(p.provider_id)}
              aria-pressed={on}
              className={`flex items-center gap-3 rounded-xl border p-2 text-left text-sm transition ${
                on ? "border-accent bg-accent/15 text-white" : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-600"
              }`}
            >
              <ProviderLogo provider={p} size={compact ? 28 : 36} />
              <span className="line-clamp-2 flex-1">{p.provider_name}</span>
              {on && <span className="text-accent">✓</span>}
            </button>
          );
        })}
      </div>
      {!query && providers.length > initialCount && (
        <button onClick={() => setShowAll((v) => !v)} className="mt-3 text-sm text-accent-soft hover:underline">
          {showAll ? "Show fewer" : `Show all ${providers.length} platforms`}
        </button>
      )}
    </div>
  );
}
