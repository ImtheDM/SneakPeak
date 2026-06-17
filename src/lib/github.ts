import { ALL_PERIODS, type Period } from '../types';

const REPO_OWNER = 'snehasishroy';
const REPO_NAME = 'leetcode-companywise-interview-questions';

const RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/master`;
const CONTENTS_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`;

/** Build the raw CSV URL for a given company + time-window dataset. */
export function rawCsvUrl(company: string, period: Period): string {
  return `${RAW_BASE}/${company}/${period}.csv`;
}

/** Fetch a CSV file as text, throwing a friendly error on failure. */
export async function fetchCsvText(url: string, signal?: AbortSignal): Promise<string> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('This dataset does not exist for the selected company.');
    }
    throw new Error(`Failed to load data (HTTP ${res.status}).`);
  }
  return res.text();
}

interface ContentEntry {
  name: string;
  type: 'file' | 'dir';
}

// Entries at the repo root that are not company directories.
const NON_COMPANY = new Set(['.gitignore', '.github', 'readme.md', 'license']);

/**
 * Fetch the list of company directory names from the GitHub Contents API.
 * Used to populate the company switcher. Note: the unauthenticated API is
 * rate-limited (60 req/hr/IP), so callers should treat failure as non-fatal.
 */
export async function fetchCompanies(signal?: AbortSignal): Promise<string[]> {
  const res = await fetch(CONTENTS_BASE, { signal });
  if (!res.ok) {
    throw new Error(`Failed to load company list (HTTP ${res.status}).`);
  }
  const entries = (await res.json()) as ContentEntry[];
  return entries
    .filter((e) => e.type === 'dir' && !NON_COMPANY.has(e.name.toLowerCase()))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));
}

/**
 * Fetch which time-window CSVs a company directory actually contains, returned
 * in canonical order. Companies vary — some have `thirty-days.csv`, some only
 * `all.csv` etc. Lets the tracker show an accurate period selector and pick a
 * default that won't 404.
 */
export async function fetchCompanyPeriods(
  company: string,
  signal?: AbortSignal,
): Promise<Period[]> {
  const res = await fetch(`${CONTENTS_BASE}/${encodeURIComponent(company)}`, { signal });
  if (!res.ok) {
    if (res.status === 404) throw new Error(`Company "${company}" was not found.`);
    throw new Error(`Failed to load datasets (HTTP ${res.status}).`);
  }
  const entries = (await res.json()) as ContentEntry[];
  const files = new Set(entries.filter((e) => e.type === 'file').map((e) => e.name));
  return ALL_PERIODS.filter((p) => files.has(`${p}.csv`));
}
