"use client";
import { COOKIE_PROVIDERS, COOKIE_REGION } from "./constants";

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax`;
}

export const saveRegion = (region: string) => setCookie(COOKIE_REGION, region);
export const saveProviders = (ids: number[]) => setCookie(COOKIE_PROVIDERS, ids.join(","));
