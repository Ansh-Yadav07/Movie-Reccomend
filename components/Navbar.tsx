import Link from "next/link";
import { Suspense } from "react";
import { getPrefs } from "@/lib/prefs";
import { RegionSelect } from "./RegionSelect";
import { SearchBox } from "./SearchBox";

const LINKS = [
  { href: "/discover", label: "Discover" },
  { href: "/for-you", label: "For you" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/platforms", label: "My platforms" },
];

export async function Navbar() {
  const { region } = await getPrefs();
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-900 bg-zinc-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3">
        <Link href="/" className="text-lg font-black tracking-tight">
          Cine<span className="text-accent">Match</span>
        </Link>
        <nav className="order-3 flex w-full gap-4 overflow-x-auto text-sm text-zinc-300 no-scrollbar sm:order-none sm:w-auto">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="whitespace-nowrap hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:justify-end">
          <Suspense>
            <SearchBox />
          </Suspense>
          <RegionSelect region={region} />
        </div>
      </div>
    </header>
  );
}
