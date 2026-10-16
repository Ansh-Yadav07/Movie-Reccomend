"use client";
import { useRouter } from "next/navigation";
import { REGIONS, flag } from "@/lib/constants";
import { saveRegion } from "@/lib/client-prefs";

export function RegionSelect({ region }: { region: string }) {
  const router = useRouter();
  return (
    <label className="flex items-center gap-1 text-sm">
      <span className="sr-only">Country</span>
      <select
        value={region}
        onChange={(e) => {
          saveRegion(e.target.value);
          router.refresh();
        }}
        className="rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1.5 outline-none focus:border-accent"
        title="Platforms and availability depend on your country"
      >
        {REGIONS.map((r) => (
          <option key={r.code} value={r.code}>
            {flag(r.code)} {r.name}
          </option>
        ))}
      </select>
    </label>
  );
}
