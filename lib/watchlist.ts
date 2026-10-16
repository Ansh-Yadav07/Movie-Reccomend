"use client";
import { useCallback, useSyncExternalStore } from "react";
import type { Movie, SavedMovie } from "./types";

const KEY = "cinematch:watchlist";
const EVENT = "cinematch:watchlist";
const EMPTY: SavedMovie[] = [];

let cachedRaw: string | null | undefined;
let cached: SavedMovie[] = EMPTY;

function read(): SavedMovie[] {
  let raw: string | null = null;
  try { raw = localStorage.getItem(KEY); } catch {}
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try { cached = raw ? (JSON.parse(raw) as SavedMovie[]) : EMPTY; } catch { cached = EMPTY; }
  }
  return cached;
}

function write(list: SavedMovie[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useWatchlist() {
  const list = useSyncExternalStore(subscribe, read, () => EMPTY);
  const toggle = useCallback((m: Movie | SavedMovie) => {
    const cur = read();
    if (cur.some((x) => x.id === m.id)) return write(cur.filter((x) => x.id !== m.id));
    const { id, title, poster_path, release_date, vote_average } = m;
    write([{ id, title, poster_path, release_date, vote_average, genre_ids: m.genre_ids ?? [], addedAt: Date.now() }, ...cur]);
  }, []);
  const setWatched = useCallback((id: number, watched: boolean) => {
    write(read().map((x) => (x.id === id ? { ...x, watched } : x)));
  }, []);
  const remove = useCallback((id: number) => write(read().filter((x) => x.id !== id)), []);
  return { list, has: (id: number) => list.some((x) => x.id === id), toggle, setWatched, remove };
}
