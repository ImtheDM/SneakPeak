import { useEffect, useState } from 'react';
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
    const controller = new AbortController();
    setState({ periods: [], loading: true });

    fetchCompanyPeriods(company, controller.signal)
      .then((periods) => {
        if (controller.signal.aborted) return;
        setState({ periods: periods.length ? periods : ALL_PERIODS, loading: false });
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setState({ periods: ALL_PERIODS, loading: false });
      });

    return () => controller.abort();
  }, [company]);

  return { ...state, defaultPeriod: pickDefault(state.periods) };
}
