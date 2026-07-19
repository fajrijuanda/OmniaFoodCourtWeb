import { Preferences } from "@capacitor/preferences";

const CACHE_PREFIX = "omnia-api-cache:";

function cacheKey(path: string, token: string | null) {
  return `${CACHE_PREFIX}${token?.slice(-16) ?? "guest"}:${path}`;
}

export async function cacheApiResponse(path: string, token: string | null, data: unknown) {
  try {
    await Preferences.set({ key: cacheKey(path, token), value: JSON.stringify({ cachedAt: Date.now(), data }) });
  } catch {
    // Cache is an enhancement; live API responses must still succeed without it.
  }
}

export async function getCachedApiResponse<T>(path: string, token: string | null): Promise<T | null> {
  try {
    const { value } = await Preferences.get({ key: cacheKey(path, token) });
    if (!value) return null;
    return (JSON.parse(value) as { data?: T }).data ?? null;
  } catch {
    return null;
  }
}
