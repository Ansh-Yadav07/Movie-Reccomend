# CineMatch

Movie recommendations limited to the streaming platforms you actually have.

## Features

- **Choose your platforms**: pick Netflix, Prime Video, JioHotstar, Disney+ and any other service available in your country. Every list in the app then shows only what you can stream.
- **Country switcher**: catalogs differ by country, so platforms and availability follow the country in the top bar (auto-detected from your browser at first).
- **Moods**: one tap for "Make me laugh", "Edge of my seat", "Mind-bending" and more.
- **Discover with filters**: platforms, how you watch (subscription, free, rent or buy), genres, era, minimum rating, length, original language and sort order, with "Load more".
- **Movie pages**: trailer, cast, director, age rating, where to watch (with your platforms highlighted), and which other countries have it on your platforms.
- **"If you like this" and similar movies** on every movie page.
- **Watchlist** with To watch and Watched tabs, saved in the browser.
- **For you**: personal picks blended from your watchlist, with movies on your platforms first.
- **Surprise me**: a random well-rated pick that respects your filters.
- **Search** by title.

## Run it

```bash
npm install
cp .env.example .env.local   # then paste your TMDB key
npm run dev                  # http://localhost:3000
```

Without a key the app runs in sample mode with 24 built-in movies and made-up platform availability, so you can try it straight away.

### Getting a TMDB key (free)

1. Create an account at https://www.themoviedb.org/signup
2. Go to https://www.themoviedb.org/settings/api and request a developer key.
3. Copy either the **API Key** or the **API Read Access Token** into `TMDB_API_KEY` in `.env.local`.

## How it's built

- Next.js 15 (App Router) with TypeScript and Tailwind CSS 4.
- `lib/tmdb.ts` is the only place that talks to TMDB. It runs on the server, so the key never reaches the browser, and it falls back to `lib/demo.ts` when no key is set.
- Your country and platforms live in cookies (`lib/prefs.ts`) so pages render already filtered. The watchlist lives in `localStorage` (`lib/watchlist.ts`).
- Filtering by platform uses TMDB's `/discover/movie` with `with_watch_providers` and `watch_region`. Streaming data comes from JustWatch via TMDB.

| Path | What it is |
| --- | --- |
| `/` | Home: moods, platform picker, rows filtered to your platforms |
| `/discover` | Full filters |
| `/movie/[id]` | Movie details and where to watch |
| `/for-you` | Picks from your watchlist |
| `/watchlist` | Saved movies |
| `/platforms` | Choose your streaming services |
| `/surprise` | Redirects to a random matching movie |
