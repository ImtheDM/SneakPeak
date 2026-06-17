/** A single LeetCode question parsed from a company CSV. */
export interface Question {
  /** LeetCode problem number (e.g. 1 for "Two Sum"). */
  id: number;
  /** Canonical LeetCode problem URL. */
  url: string;
  title: string;
  difficulty: Difficulty;
  /** Acceptance rate as a number, e.g. 57.5 (parsed from "57.5%"). */
  acceptance: number;
  /** Frequency as a number, e.g. 100.0 (parsed from "100.0%"). May be null if absent. */
  frequency: number | null;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

/**
 * Per-question progress tracked by the user, persisted to localStorage.
 * `completed` and `review` are independent flags surfaced as separate columns.
 */
export interface QuestionProgress {
  completed?: boolean;
  review?: boolean;
}

export type SortKey = 'frequency' | 'difficulty' | 'id' | 'acceptance' | 'title';
export type SortDir = 'asc' | 'desc';

/** A repo company directory + the time-window dataset selected within it. */
export interface DatasetSelection {
  company: string;
  period: Period;
}

export type Period =
  | 'thirty-days'
  | 'three-months'
  | 'six-months'
  | 'more-than-six-months'
  | 'all';

export const PERIOD_LABELS: Record<Period, string> = {
  'thirty-days': '30 Days',
  'three-months': '3 Months',
  'six-months': '6 Months',
  'more-than-six-months': '6+ Months',
  all: 'All Time',
};

export const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

/** Canonical period order, from most to least recent window. */
export const ALL_PERIODS: Period[] = [
  'thirty-days',
  'three-months',
  'six-months',
  'more-than-six-months',
  'all',
];

/**
 * Well-known companies surfaced as quick-pick shortcuts on the landing page,
 * and used as a fallback list when the GitHub Contents API is rate-limited.
 * All are confirmed directories in the source repo.
 */
export const POPULAR_COMPANIES: string[] = [
  'amazon',
  'google',
  'microsoft',
  'meta',
  'apple',
  'uber',
  'bloomberg',
  'goldman-sachs',
  'salesforce',
  'tiktok',
  'flipkart',
  'visa',
];
