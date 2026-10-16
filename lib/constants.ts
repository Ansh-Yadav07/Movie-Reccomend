export const REGIONS = [
  { code: "US", name: "United States" },
  { code: "IN", name: "India" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "IE", name: "Ireland" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "ZA", name: "South Africa" },
] as const;

export const REGION_CODES: string[] = REGIONS.map((r) => r.code);

export function flag(code: string) {
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)));
}

export const SORTS = [
  { value: "popularity.desc", label: "Most popular" },
  { value: "vote_average.desc", label: "Highest rated" },
  { value: "primary_release_date.desc", label: "Newest" },
  { value: "revenue.desc", label: "Box office hits" },
] as const;
export type SortKey = (typeof SORTS)[number]["value"];

export const MONETIZATION = [
  { value: "flatrate", label: "Included in subscription" },
  { value: "free|ads", label: "Free" },
  { value: "rent|buy", label: "Rent or buy" },
  { value: "any", label: "Any way" },
] as const;

export const LANGUAGES = [
  { value: "", label: "Any language" },
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
  { value: "ml", label: "Malayalam" },
  { value: "ko", label: "Korean" },
  { value: "ja", label: "Japanese" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "zh", label: "Chinese" },
];

export type Mood = {
  slug: string;
  label: string;
  emoji: string;
  genres: number[];
  minRating?: number;
  sort?: SortKey;
};

export const MOODS: Mood[] = [
  { slug: "laugh", label: "Make me laugh", emoji: "😂", genres: [35] },
  { slug: "edge", label: "Edge of my seat", emoji: "😰", genres: [53, 9648] },
  { slug: "mind", label: "Mind-bending", emoji: "🌀", genres: [878], minRating: 7 },
  { slug: "cozy", label: "Feel-good", emoji: "🥰", genres: [10749, 10751] },
  { slug: "action", label: "Adrenaline rush", emoji: "💥", genres: [28, 12] },
  { slug: "scary", label: "Scare me", emoji: "👻", genres: [27] },
  { slug: "cry", label: "A good cry", emoji: "😭", genres: [18], minRating: 7.5 },
  { slug: "animated", label: "Animated", emoji: "✨", genres: [16] },
  { slug: "classics", label: "All-time greats", emoji: "🏆", genres: [], minRating: 8, sort: "vote_average.desc" },
];

export const COOKIE_REGION = "cm_region";
export const COOKIE_PROVIDERS = "cm_providers";

export const IMG = (path: string | null | undefined, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export const year = (date?: string) => (date ? date.slice(0, 4) : "");
