import Papa from 'papaparse';
import type { Difficulty, Question } from '../types';

/** Raw CSV row shape. Headers: ID,URL,Title,Difficulty,Acceptance %,Frequency % */
interface RawRow {
  ID?: string;
  URL?: string;
  Title?: string;
  Difficulty?: string;
  'Acceptance %'?: string;
  'Frequency %'?: string;
}

/** Parse a "57.5%" style string into a number (57.5). Returns null if unparseable. */
function parsePercent(value: string | undefined): number | null {
  if (!value) return null;
  const n = parseFloat(value.replace('%', '').trim());
  return Number.isFinite(n) ? n : null;
}

function normalizeDifficulty(value: string | undefined): Difficulty {
  switch ((value ?? '').trim().toLowerCase()) {
    case 'easy':
      return 'Easy';
    case 'hard':
      return 'Hard';
    default:
      return 'Medium';
  }
}

/**
 * Parse company CSV text into typed Question objects.
 * Rows missing an ID/URL/Title are skipped defensively.
 */
export function parseQuestions(csv: string): Question[] {
  const { data } = Papa.parse<RawRow>(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  const questions: Question[] = [];
  for (const row of data) {
    const id = parseInt((row.ID ?? '').trim(), 10);
    const title = (row.Title ?? '').trim();
    const url = (row.URL ?? '').trim();
    if (!Number.isFinite(id) || !title || !url) continue;

    questions.push({
      id,
      url,
      title,
      difficulty: normalizeDifficulty(row.Difficulty),
      acceptance: parsePercent(row['Acceptance %']) ?? 0,
      frequency: parsePercent(row['Frequency %']),
    });
  }
  return questions;
}
