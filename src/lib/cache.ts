/**
 * localStorage-backed cache for GitHub-sourced data with a 24h freshness window.
 *
 * The app reads cached data synchronously (instant render) and only re-syncs
 * with GitHub when an entry is older than the TTL — so each dataset is fetched
 * at most once per day per browser, and the UI is never blocked on the network.
 */

const VERSION = 'v1';
const PREFIX = 'sneakpeak:cache:';
export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

interface Entry<T> {
  /** Epoch ms when the value was cached. */
  t: number;
  v: T;
}

const storageKey = (key: string) => `${PREFIX}${VERSION}:${key}`;

export function readCache<T>(key: string): Entry<T> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(storageKey(key));
    return raw ? (JSON.parse(raw) as Entry<T>) : null;
  } catch {
    return null;
  }
}

export function writeCache<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  const payload = JSON.stringify({ t: Date.now(), v: value } satisfies Entry<T>);
  try {
    localStorage.setItem(storageKey(key), payload);
  } catch {
    // Likely a quota error: drop our cached entries and retry once.
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k?.startsWith(PREFIX)) localStorage.removeItem(k);
      }
      localStorage.setItem(storageKey(key), payload);
    } catch {
      // Caching is best-effort; ignore if storage is unavailable.
    }
  }
}

/** True when the entry exists and is younger than the TTL (default 24h). */
export function isFresh(entry: { t: number } | null, ttl = ONE_DAY_MS): boolean {
  return !!entry && Date.now() - entry.t < ttl;
}
