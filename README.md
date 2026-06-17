# SneakPeak

A developer-friendly SPA dashboard for tracking **LeetCode company-wise interview questions**, fetched live from a public GitHub repo — no backend, no database.

Data source: [snehasishroy/leetcode-companywise-interview-questions](https://github.com/snehasishroy/leetcode-companywise-interview-questions).

## Pages

- `/` — **Companies landing page**: search across 600+ companies (with popular quick-picks) and jump into any one.
- `/company/:company` — **Tracker**: the question list + progress dashboard for the chosen company.

Routing is handled by `react-router-dom`. Selecting a company navigates to its tracker; the header logo and an "All companies" link return to the landing page.

## Features

- **Live data** fetched from raw GitHub CSV endpoints via the Fetch API.
- **Per-company period discovery** — the tracker reads which datasets a company actually has (30 days / 3 / 6 / 6+ months / all time) and defaults to one that exists, so companies without `thirty-days.csv` still load.
- **Real-time search** by problem title or LeetCode ID.
- **Difficulty filters** (Easy / Medium / Hard) and **sort** by frequency, difficulty, acceptance, or ID.
- **Progress tracking** — mark questions Completed / In progress / Review later. Persisted in `localStorage`, keyed by LeetCode problem ID so it carries across companies. Includes a progress bar.
- **Dark / light mode** with no flash on load.
- One-click **Solve** to open the problem on LeetCode.

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · Lucide React · PapaParse

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Notes

- The GitHub Contents API is rate-limited to 60 requests/hour for unauthenticated clients. If the company list fails to load, the landing page falls back to a curated popular list; period discovery falls back to assuming all windows exist.
- This dataset has columns `ID, URL, Title, Difficulty, Acceptance %, Frequency %`. There is no topic-tags column, so search covers title + ID.
- The app uses `BrowserRouter` (clean URLs). On a plain static host, deep links like `/company/google` need a SPA fallback to `index.html` (configure a rewrite, or switch to `HashRouter`). The Vite dev server and `vite preview` handle this automatically.

## Architecture

```
src/
  lib/        github.ts (endpoints/fetch + period discovery), parseCsv.ts (PapaParse), cn.ts
  hooks/      useTheme, useProgress, useQuestions, useCompanies, useCompanyPeriods
  components/ Header, ThemeToggle, PeriodSelector, Toolbar, ProgressBar,
              QuestionTable, QuestionRow, DifficultyBadge, StatusSelect, StateViews
  pages/      CompaniesPage (landing + search), TrackerPage (filter/sort/progress)
  App.tsx     router + shared header + theme
  types.ts    Question, Status, Period, Sort types + constants
```
