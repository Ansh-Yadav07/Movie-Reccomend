// Sample data used when no TMDB_API_KEY is set, so the app runs out of the box.
// Platform availability here is illustrative only.
import { REGION_CODES } from "./constants";
import type { Genre, Movie, MovieDetails, Provider, RegionProviders } from "./types";

export const DEMO_GENRES: Genre[] = [
  { id: 28, name: "Action" }, { id: 12, name: "Adventure" }, { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" }, { id: 80, name: "Crime" }, { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" }, { id: 10751, name: "Family" }, { id: 14, name: "Fantasy" },
  { id: 36, name: "History" }, { id: 27, name: "Horror" }, { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" }, { id: 10749, name: "Romance" }, { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" }, { id: 10752, name: "War" }, { id: 37, name: "Western" },
];

export const DEMO_PROVIDERS: Provider[] = [
  { provider_id: 8, provider_name: "Netflix", logo_path: null, display_priority: 1 },
  { provider_id: 9, provider_name: "Amazon Prime Video", logo_path: null, display_priority: 2 },
  { provider_id: 337, provider_name: "Disney Plus", logo_path: null, display_priority: 3 },
  { provider_id: 350, provider_name: "Apple TV+", logo_path: null, display_priority: 4 },
  { provider_id: 1899, provider_name: "Max", logo_path: null, display_priority: 5 },
  { provider_id: 15, provider_name: "Hulu", logo_path: null, display_priority: 6 },
  { provider_id: 2336, provider_name: "JioHotstar", logo_path: null, display_priority: 7 },
  { provider_id: 531, provider_name: "Paramount Plus", logo_path: null, display_priority: 8 },
  { provider_id: 237, provider_name: "Sony Liv", logo_path: null, display_priority: 9 },
  { provider_id: 11, provider_name: "MUBI", logo_path: null, display_priority: 10 },
];

type DemoMovie = Omit<Movie, "poster_path" | "backdrop_path" | "vote_count" | "popularity"> & {
  runtime: number;
  tagline: string;
  providers: number[];
  pop: number;
};

const m = (
  id: number, title: string, release_date: string, vote_average: number, genre_ids: number[],
  runtime: number, original_language: string, providers: number[], pop: number, tagline: string, overview: string,
): DemoMovie => ({ id, title, release_date, vote_average, genre_ids, runtime, original_language, providers, pop, tagline, overview });

const MOVIES: DemoMovie[] = [
  m(27205, "Inception", "2010-07-16", 8.4, [28, 878, 12], 148, "en", [8, 1899], 95, "Your mind is the scene of the crime.", "A thief who steals secrets from dreams is offered one last job: planting an idea instead of taking one."),
  m(157336, "Interstellar", "2014-11-05", 8.4, [12, 18, 878], 169, "en", [9, 531], 97, "Mankind was born on Earth. It was never meant to die here.", "A team of explorers travels through a wormhole to find humanity a new home."),
  m(155, "The Dark Knight", "2008-07-16", 8.5, [18, 28, 80, 53], 152, "en", [1899, 8], 90, "Why so serious?", "Batman faces the Joker, a criminal mastermind who wants to watch Gotham burn."),
  m(496243, "Parasite", "2019-05-30", 8.5, [35, 53, 18], 133, "ko", [15, 9], 80, "Act like you own the place.", "A poor family schemes its way into the household of a wealthy one, with unexpected results."),
  m(129, "Spirited Away", "2001-07-20", 8.5, [16, 10751, 14], 125, "ja", [8, 1899], 78, "The tunnel led Chihiro to a mysterious town.", "A girl wanders into a world of spirits and must work in a bathhouse to free her parents."),
  m(693134, "Dune: Part Two", "2024-02-27", 8.2, [878, 12], 167, "en", [1899, 9], 99, "Long live the fighters.", "Paul Atreides unites with the Fremen while seeking revenge on those who destroyed his family."),
  m(545611, "Everything Everywhere All at Once", "2022-03-24", 7.8, [28, 12, 35, 878], 140, "en", [9, 2336], 70, "The universe is so much bigger than you realize.", "A laundromat owner discovers she must connect with parallel-universe versions of herself."),
  m(872585, "Oppenheimer", "2023-07-19", 8.1, [18, 36], 181, "en", [9, 386], 96, "The world forever changes.", "The story of J. Robert Oppenheimer and the creation of the atomic bomb."),
  m(419430, "Get Out", "2017-02-24", 7.6, [9648, 53, 27], 104, "en", [8, 386], 65, "Just because you're invited, doesn't mean you're welcome.", "A young man's visit to his girlfriend's family turns into a nightmare."),
  m(313369, "La La Land", "2016-11-29", 7.9, [35, 18, 10749, 10402], 128, "en", [8, 15], 72, "Here's to the fools who dream.", "A jazz pianist and an aspiring actress fall in love while chasing their dreams in Los Angeles."),
  m(546554, "Knives Out", "2019-11-27", 7.8, [35, 80, 9648], 131, "en", [9, 2336], 74, "Hell, any of them could have done it.", "A detective investigates the death of a crime novelist amid his eccentric family."),
  m(76341, "Mad Max: Fury Road", "2015-05-13", 7.6, [28, 12, 878], 121, "en", [1899, 8], 76, "What a lovely day.", "In a desert wasteland, a drifter and a rebel warrior flee a tyrant across the sands."),
  m(244786, "Whiplash", "2014-10-10", 8.4, [18, 10402], 106, "en", [8, 237], 68, "The road to greatness can take you to the edge.", "An ambitious drummer is pushed to his limit by a ruthless music instructor."),
  m(278, "The Shawshank Redemption", "1994-09-23", 8.7, [18, 80], 142, "en", [8, 9], 88, "Fear can hold you prisoner. Hope can set you free.", "Two imprisoned men bond over years, finding solace and redemption through acts of decency."),
  m(354912, "Coco", "2017-10-27", 8.2, [10751, 16, 10402, 12], 105, "en", [337, 2336], 82, "The celebration of a lifetime.", "A boy who dreams of music journeys into the Land of the Dead to find his ancestor."),
  m(324857, "Spider-Man: Into the Spider-Verse", "2018-12-06", 8.4, [16, 28, 12, 878], 117, "en", [8, 237], 84, "More than one wears the mask.", "Teen Miles Morales becomes Spider-Man and meets heroes from other dimensions."),
  m(20453, "3 Idiots", "2009-12-23", 8.0, [35, 18], 170, "hi", [8, 9], 69, "Don't be stupid. Be an i-di-ot.", "Two friends search for their long-lost college companion who inspired them to think differently."),
  m(360814, "Dangal", "2016-12-21", 8.0, [18, 28], 161, "hi", [8, 2336], 62, "Our girls are no less than boys.", "A former wrestler trains his daughters to become world-class wrestlers."),
  m(579974, "RRR", "2022-03-24", 7.7, [28, 18], 187, "te", [8, 2336], 71, "Rise. Roar. Revolt.", "Two revolutionaries in 1920s India forge a deep friendship while fighting colonial rule."),
  m(120467, "The Grand Budapest Hotel", "2014-02-26", 8.0, [35, 18], 100, "en", [337, 15, 11], 60, "A perfect holiday without leaving the lobby.", "A legendary concierge and his lobby boy are caught up in the theft of a priceless painting."),
  m(329865, "Arrival", "2016-11-10", 7.6, [18, 878, 9648], 116, "en", [531, 9], 58, "Why are they here?", "A linguist is recruited to communicate with mysterious alien visitors."),
  m(447332, "A Quiet Place", "2018-04-03", 7.4, [27, 18, 878], 90, "en", [531, 9], 66, "If they hear you, they hunt you.", "A family must live in silence to hide from creatures that hunt by sound."),
  m(372058, "Your Name.", "2016-08-26", 8.5, [16, 10749, 18], 106, "ja", [8, 1899], 64, "", "Two strangers find themselves linked in a bizarre way as they begin swapping bodies."),
  m(493922, "Hereditary", "2018-06-07", 7.3, [27, 9648, 53], 127, "en", [1899, 11], 55, "Every family tree hides a secret.", "After the death of their grandmother, a family unravels cryptic and terrifying secrets."),
];

export function demoMovie(d: DemoMovie): Movie {
  return {
    id: d.id, title: d.title, overview: d.overview, poster_path: null, backdrop_path: null,
    release_date: d.release_date, vote_average: d.vote_average, vote_count: 1000 + d.pop * 100,
    genre_ids: d.genre_ids, original_language: d.original_language, popularity: d.pop,
  };
}

export const DEMO_MOVIES = MOVIES;

const providerList = (idList: number[]) =>
  idList.map((id) => DEMO_PROVIDERS.find((p) => p.provider_id === id)!).filter(Boolean);

export function demoWatchProviders(d: DemoMovie): Record<string, RegionProviders> {
  const entry: RegionProviders = { flatrate: providerList(d.providers), rent: providerList([350]), buy: providerList([350, 9]) };
  return Object.fromEntries(REGION_CODES.map((r) => [r, entry]));
}

export function demoRecommendations(d: DemoMovie): Movie[] {
  return MOVIES.filter((x) => x.id !== d.id)
    .map((x) => ({ x, score: x.genre_ids.filter((g) => d.genre_ids.includes(g)).length + x.vote_average / 10 }))
    .filter((r) => r.score >= 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((r) => demoMovie(r.x));
}

export function demoDetails(id: number): MovieDetails | null {
  const d = MOVIES.find((x) => x.id === id);
  if (!d) return null;
  const recs = demoRecommendations(d);
  const page = (results: Movie[]) => ({ page: 1, results, total_pages: 1, total_results: results.length });
  return {
    ...demoMovie(d),
    runtime: d.runtime,
    tagline: d.tagline,
    status: "Released",
    genres: DEMO_GENRES.filter((g) => d.genre_ids.includes(g.id)),
    spoken_languages: [],
    videos: { results: [] },
    credits: { cast: [], crew: [] },
    recommendations: page(recs.slice(0, 8)),
    similar: page(recs.slice(4)),
    "watch/providers": { results: demoWatchProviders(d) },
  };
}
