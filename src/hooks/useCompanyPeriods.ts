import { useEffect, useState } from 'react';
import { isFresh, readCache, writeCache } from '../lib/cache';
import { fetchCompanyPeriods } from '../lib/github';
import { ALL_PERIODS, type Period } from '../types';

interface PeriodsState {
  periods: Period[];
  loading: boolean;
}

/** Prefer 30 days, then fall back to the broadest window the company offers. */
function pickDefault(periods: Period[]): Period {
  if (periods.includes('thirty-days')) return 'thirty-days';
  if (periods.includes('all')) return 'all';
  return periods[0] ?? 'thirty-days';
}

/**
 * Discovers which period datasets a company has, so the tracker can show an
 * accurate selector and default to one that exists. If discovery fails (e.g.
 * rate limit), we optimistically assume all periods exist.
 */
export function useCompanyPeriods(company: string) {
  const [state, setState] = useState<PeriodsState>({ periods: [], loading: true });

  useEffect(() => {
    const cacheKey = `periods:${company}`;
    const cached = readCache<Period[]>(cacheKey);
    setState(cached ? { periods: cached.v, loading: false } : { periods: [], loading: true });

    // Fresh (<24h): use the cached periods and skip the rate-limited Contents API.
    if (isFresh(cached)) return;

    const controller = new AbortController();
    fetchCompanyPeriods(company, controller.signal)
      .then((periods) => {
        if (controller.signal.aborted) return;
        const resolved = periods.length ? periods : ALL_PERIODS;
        writeCache(cacheKey, resolved);
        setState({ periods: resolved, loading: false });
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        if (cached) return; // keep cached periods if the refresh fails
        setState({ periods: ALL_PERIODS, loading: false });
      });

    return () => controller.abort();
  }, [company]);

  return { ...state, defaultPeriod: pickDefault(state.periods) };
}
