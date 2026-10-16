import { NextResponse, type NextRequest } from "next/server";
import { parseFilters } from "@/lib/filters";
import { getPrefs } from "@/lib/prefs";
import { discover } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

/** Picks a random well-rated movie that matches the filters and redirects to it. */
export async function GET(req: NextRequest) {
  const filters = parseFilters(req.nextUrl.searchParams, await getPrefs());
  filters.minRating ??= 6.5;
  const first = await discover({ ...filters, page: 1 });
  const pages = Math.min(first.total_pages, 15);
  const page = 1 + Math.floor(Math.random() * pages);
  const pool = page === 1 ? first : await discover({ ...filters, page });
  const list = pool.results.length ? pool.results : first.results;
  if (!list.length) return NextResponse.redirect(new URL("/discover", req.url));
  const pick = list[Math.floor(Math.random() * list.length)];
  return NextResponse.redirect(new URL(`/movie/${pick.id}?surprise=1`, req.url));
}
