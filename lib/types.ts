export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  popularity?: number;
};

export type Genre = { id: number; name: string };

export type Provider = {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority?: number;
};

export type Paged<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type RegionProviders = {
  link?: string;
  flatrate?: Provider[];
  free?: Provider[];
  ads?: Provider[];
  rent?: Provider[];
  buy?: Provider[];
};

export type CastMember = { id: number; name: string; character: string; profile_path: string | null };
export type Video = { key: string; site: string; type: string; name: string; official: boolean };

export type MovieDetails = Omit<Movie, "genre_ids"> & {
  genre_ids?: number[];
  runtime: number | null;
  tagline: string;
  status: string;
  genres: Genre[];
  spoken_languages: { english_name: string }[];
  videos: { results: Video[] };
  credits: { cast: CastMember[]; crew: { id: number; name: string; job: string }[] };
  recommendations: Paged<Movie>;
  similar: Paged<Movie>;
  "watch/providers": { results: Record<string, RegionProviders> };
  release_dates?: { results: { iso_3166_1: string; release_dates: { certification: string }[] }[] };
};

/** What the browser keeps in the watchlist. */
export type SavedMovie = Pick<
  Movie,
  "id" | "title" | "poster_path" | "release_date" | "vote_average" | "genre_ids"
> & { addedAt: number; watched?: boolean };
