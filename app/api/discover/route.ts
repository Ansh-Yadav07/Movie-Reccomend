import { NextResponse, type NextRequest } from "next/server";
import { parseFilters } from "@/lib/filters";
import { getPrefs } from "@/lib/prefs";
import { discover } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const filters = parseFilters(req.nextUrl.searchParams, await getPrefs());
  return NextResponse.json(await discover(filters));
}
