import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { PeriodSelector } from '../components/PeriodSelector';
import { ProgressBar } from '../components/ProgressBar';
import { QuestionTable } from '../components/QuestionTable';
import { EmptyState, ErrorState, TableSkeleton } from '../components/StateViews';
import { Toolbar, type ToolbarState } from '../components/Toolbar';
import { useCompanyPeriods } from '../hooks/useCompanyPeriods';
import { useProgress, type ProgressMap } from '../hooks/useProgress';
import { useQuestions } from '../hooks/useQuestions';
import { formatCompany } from '../lib/cn';
import type { Difficulty, Period, Question, SortDir, SortKey } from '../types';

const DIFFICULTY_RANK: Record<Difficulty, number> = { Easy: 0, Medium: 1, Hard: 2 };

/** Direction applied when a column is first selected for sorting. */
const DEFAULT_SORT_DIR: Record<SortKey, SortDir> = {
  id: 'asc',
  title: 'asc',
  difficulty: 'asc',
  frequency: 'desc',
  acceptance: 'desc',
};

export function TrackerPage() {
  const { company = '' } = useParams();

  // Discover which periods this company offers; default to one that exists.
  const { periods, loading: periodsLoading, defaultPeriod } = useCompanyPeriods(company);
  const [override, setOverride] = useState<Period | null>(null);
  useEffect(() => setOverride(null), [company]); // reset choice when company changes
  const period = override && periods.includes(override) ? override : defaultPeriod;

  const { questions, loading, error, refetch } = useQuestions(company, period, !periodsLoading);
  const { progress, getProgress, toggleCompleted, toggleReview, resetProgress } = useProgress();

  const [toolbar, setToolbar] = useState<ToolbarState>({
    query: '',
    difficulties: new Set<Difficulty>(),
    sortKey: 'frequency',
    sortDir: 'desc',
  });

  const visible = useMemo(() => {
    const q = toolbar.query.trim().toLowerCase();
    const filtered = questions.filter((item) => {
      if (toolbar.difficulties.size && !toolbar.difficulties.has(item.difficulty)) return false;
      if (!q) return true;
      return item.title.toLowerCase().includes(q) || String(item.id).includes(q);
    });

    const dir = toolbar.sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      let diff = 0;
      switch (toolbar.sortKey) {
        case 'frequency':
          diff = (a.frequency ?? -1) - (b.frequency ?? -1);
          break;
        case 'difficulty':
          diff = DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty];
          break;
        case 'acceptance':
          diff = a.acceptance - b.acceptance;
          break;
        case 'title':
          diff = a.title.localeCompare(b.title);
          break;
        case 'id':
          diff = a.id - b.id;
          break;
      }
      if (diff === 0) diff = a.id - b.id; // stable tiebreak
      return diff * dir;
    });
  }, [questions, toolbar]);

  const stats = useMemo(() => countStatuses(questions, progress), [questions, progress]);

  const update = (patch: Partial<ToolbarState>) => setToolbar((prev) => ({ ...prev, ...patch }));
  // Toggle direction when re-clicking the active column, else switch with its default dir.
  const sortBy = (key: SortKey) =>
    setToolbar((prev) => ({
      ...prev,
      sortKey: key,
      sortDir:
        prev.sortKey === key
          ? prev.sortDir === 'asc'
            ? 'desc'
            : 'asc'
          : DEFAULT_SORT_DIR[key],
    }));
  const toggleDifficulty = (d: Difficulty) =>
    setToolbar((prev) => {
      const difficulties = new Set(prev.difficulties);
      difficulties.has(d) ? difficulties.delete(d) : difficulties.add(d);
      return { ...prev, difficulties };
    });

  const busy = periodsLoading || loading;

  return (
    <main className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
      >
        <ChevronLeft className="h-4 w-4" /> All companies
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            {formatCompany(company)} interview questions
          </h2>
          <p className="text-sm text-muted-foreground">
            {busy ? 'Loading…' : `${questions.length} questions`} · sourced from GitHub
          </p>
        </div>
        <PeriodSelector
          periods={periods}
          period={period}
          disabled={periodsLoading}
          onChange={setOverride}
        />
      </div>

      <ProgressBar
        total={questions.length}
        completed={stats.completed}
        review={stats.review}
        onReset={resetProgress}
      />

      <Toolbar
        state={toolbar}
        onQueryChange={(query) => update({ query })}
        onToggleDifficulty={toggleDifficulty}
      />

      {busy ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : visible.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <QuestionTable
            questions={visible}
            getProgress={getProgress}
            onToggleCompleted={toggleCompleted}
            onToggleReview={toggleReview}
            sortKey={toolbar.sortKey}
            sortDir={toolbar.sortDir}
            onSort={sortBy}
          />
          <p className="pb-4 text-center text-xs text-muted-foreground">
            Showing {visible.length} of {questions.length} questions
          </p>
        </>
      )}
    </main>
  );
}

function countStatuses(questions: Question[], progress: ProgressMap) {
  let completed = 0;
  let review = 0;
  for (const q of questions) {
    const p = progress[q.id];
    if (p?.completed) completed++;
    if (p?.review) review++;
  }
  return { completed, review };
}
