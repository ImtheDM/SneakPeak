import { Search, X } from 'lucide-react';
import { cn } from '../lib/cn';
import { DIFFICULTIES, type Difficulty, type SortDir, type SortKey } from '../types';

export interface ToolbarState {
  query: string;
  difficulties: Set<Difficulty>;
  sortKey: SortKey;
  sortDir: SortDir;
}

interface Props {
  state: ToolbarState;
  onQueryChange: (q: string) => void;
  onToggleDifficulty: (d: Difficulty) => void;
}

const DIFF_ACTIVE: Record<Difficulty, string> = {
  Easy: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/40',
  Medium: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/40',
  Hard: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 ring-rose-500/40',
};

export function Toolbar({ state, onQueryChange, onToggleDifficulty }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={state.query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by title or problem ID…"
          className="h-11 w-full rounded-lg border border-input bg-card pl-10 pr-10 text-sm outline-none ring-ring transition-shadow placeholder:text-muted-foreground focus-visible:ring-2"
        />
        {state.query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onQueryChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Difficulty filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Difficulty</span>
        {DIFFICULTIES.map((d) => {
          const active = state.difficulties.has(d);
          return (
            <button
              key={d}
              type="button"
              aria-pressed={active}
              onClick={() => onToggleDifficulty(d)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active
                  ? DIFF_ACTIVE[d]
                  : 'bg-transparent text-muted-foreground ring-border hover:bg-accent',
              )}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
