import { cookies, headers } from "next/headers";
import { COOKIE_PROVIDERS, COOKIE_REGION, REGION_CODES } from "./constants";
import { ids, type Prefs } from "./filters";

/** Saved region and platforms. Region falls back to the browser's locale, then US. */
export async function getPrefs(): Promise<Prefs> {
  const jar = await cookies();
  let region = jar.get(COOKIE_REGION)?.value;
  if (!region) {
    const lang = (await headers()).get("accept-language") ?? "";
    region = lang.match(/[a-z]{2}-([A-Z]{2})/)?.[1];
  }
  if (!region || !REGION_CODES.includes(region)) region = "US";
  return { region, providers: ids(decodeURIComponent(jar.get(COOKIE_PROVIDERS)?.value ?? "")) };
}
