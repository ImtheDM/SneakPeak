import { useCallback, useEffect, useState } from 'react';
import type { QuestionProgress } from '../types';

const STORAGE_KEY = 'sneakpeak:progress';

/**
 * Map of LeetCode problem ID -> progress flags. Progress is keyed by problem ID
 * (not by company), so solving "Two Sum" stays solved across every company list.
 */
export type ProgressMap = Record<number, QuestionProgress>;

function loadProgress(): ProgressMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<number, unknown>;
    return migrate(parsed);
  } catch {
    return {};
  }
}

/** Convert any legacy string-status entries ("completed"/"review"/…) to flags. */
function migrate(parsed: Record<number, unknown>): ProgressMap {
  const next: ProgressMap = {};
  for (const [key, value] of Object.entries(parsed)) {
    const id = Number(key);
    if (typeof value === 'string') {
      if (value === 'completed') next[id] = { completed: true };
      else if (value === 'review') next[id] = { review: true };
    } else if (value && typeof value === 'object') {
      next[id] = value as QuestionProgress;
    }
  }
  return next;
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>(loadProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const getProgress = useCallback(
    (id: number): QuestionProgress => progress[id] ?? {},
    [progress],
  );

  const toggleFlag = useCallback((id: number, flag: keyof QuestionProgress) => {
    setProgress((prev) => {
      const current = prev[id] ?? {};
      const updated: QuestionProgress = { ...current, [flag]: !current[flag] };
      const next = { ...prev };
      if (updated.completed || updated.review) next[id] = updated;
      else delete next[id]; // no flags set -> drop the entry entirely
      return next;
    });
  }, []);

  const toggleCompleted = useCallback((id: number) => toggleFlag(id, 'completed'), [toggleFlag]);
  const toggleReview = useCallback((id: number) => toggleFlag(id, 'review'), [toggleFlag]);

  const resetProgress = useCallback(() => setProgress({}), []);

  return { progress, getProgress, toggleCompleted, toggleReview, resetProgress };
}
