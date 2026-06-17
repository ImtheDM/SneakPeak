import { useCallback, useEffect, useState } from 'react';
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
    const controller = new AbortController();
    setState({ questions: [], loading: true, error: null });

    fetchCsvText(rawCsvUrl(company, period), controller.signal)
      .then((text) => {
        const questions = parseQuestions(text);
        setState({ questions, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : 'Something went wrong.';
        setState({ questions: [], loading: false, error: message });
      });

    return () => controller.abort();
  }, [company, period, nonce, enabled]);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  return { ...state, refetch };
}
