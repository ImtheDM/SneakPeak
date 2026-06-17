import { useCallback, useEffect, useState } from 'react';
import { isFresh, readCache, writeCache } from '../lib/cache';
import { fetchCsvText, rawCsvUrl } from '../lib/github';
import { parseQuestions } from '../lib/parseCsv';
import type { Period, Question } from '../types';

interface QuestionsState {
  questions: Question[];
  loading: boolean;
  error: string | null;
}

/**
 * Fetches + parses the CSV for the selected company/period, with abort + error
 * handling. Pass `enabled: false` to defer fetching (e.g. until the available
 * periods are known) while staying in the loading state.
 */
export function useQuestions(company: string, period: Period, enabled = true) {
  const [state, setState] = useState<QuestionsState>({
    questions: [],
    loading: true,
    error: null,
  });
  // Bumping this re-runs the fetch effect even when company/period are unchanged.
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const cacheKey = `csv:${company}:${period}`;
    const cached = readCache<Question[]>(cacheKey);
    const force = nonce > 0; // a manual refetch always re-syncs with GitHub

    // Render cached data instantly; only show the skeleton on a cold start.
    setState(
      cached
        ? { questions: cached.v, loading: false, error: null }
        : { questions: [], loading: true, error: null },
    );

    // Fresh (<24h) and not a manual refetch: serve from cache, skip the network.
    if (isFresh(cached) && !force) return;

    const controller = new AbortController();
    fetchCsvText(rawCsvUrl(company, period), controller.signal)
      .then((text) => {
        const questions = parseQuestions(text);
        writeCache(cacheKey, questions);
        setState({ questions, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        if (cached) return; // keep showing cached data if the refresh fails
        const message = err instanceof Error ? err.message : 'Something went wrong.';
        setState({ questions: [], loading: false, error: message });
      });

    return () => controller.abort();
  }, [company, period, nonce, enabled]);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  return { ...state, refetch };
}
