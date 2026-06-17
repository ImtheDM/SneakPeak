import { useEffect, useState } from 'react';
import { fetchCompanies } from '../lib/github';
import { POPULAR_COMPANIES } from '../types';

interface CompaniesState {
  companies: string[];
  loading: boolean;
  /** True when the full list couldn't be fetched and we fell back to popular companies. */
  fallback: boolean;
}

/**
 * Loads the full list of company directories for the landing page. The GitHub
 * Contents API is rate-limited (60 req/hr unauthenticated), so on failure we
 * fall back to a curated popular list instead of showing an empty page.
 */
export function useCompanies() {
  const [state, setState] = useState<CompaniesState>({
    companies: [],
    loading: true,
    fallback: false,
  });

  useEffect(() => {
    const controller = new AbortController();
    fetchCompanies(controller.signal)
      .then((companies) => setState({ companies, loading: false, fallback: false }))
      .catch(() => {
        if (controller.signal.aborted) return;
        setState({ companies: [...POPULAR_COMPANIES].sort(), loading: false, fallback: true });
      });
    return () => controller.abort();
  }, []);

  return state;
}
