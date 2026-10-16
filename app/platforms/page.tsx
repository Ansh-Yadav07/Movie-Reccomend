import type { Metadata } from "next";
import Link from "next/link";
import { PlatformPicker } from "@/components/PlatformPicker";
import { REGIONS, flag } from "@/lib/constants";
import { getPrefs } from "@/lib/prefs";
import { getProviders } from "@/lib/tmdb";

export const metadata: Metadata = { title: "My platforms" };

export default async function PlatformsPage() {
  const prefs = await getPrefs();
  const providers = await getProviders(prefs.region);
  const region = REGIONS.find((r) => r.code === prefs.region);
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold">My streaming platforms</h1>
      <p className="mb-6 mt-1 text-sm text-zinc-400">
        Showing platforms available in {flag(prefs.region)} {region?.name}. Change the country in the top bar. Recommendations
        across the app will be limited to what you pick here.
      </p>
      <PlatformPicker providers={providers} selected={prefs.providers} initialCount={24} />
      <div className="mt-8">
        <Link href="/" className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-soft">
          Done, show me movies
        </Link>
      </div>
    </div>
  );
}
