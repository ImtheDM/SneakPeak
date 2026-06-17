import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '../lib/cn';
import type { Question, QuestionProgress, SortDir, SortKey } from '../types';
import { QuestionRow } from './QuestionRow';

interface Props {
  questions: Question[];
  getProgress: (id: number) => QuestionProgress;
  onToggleCompleted: (id: number) => void;
  onToggleReview: (id: number) => void;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}

export function QuestionTable({
  questions,
  getProgress,
  onToggleCompleted,
  onToggleReview,
  sortKey,
  sortDir,
  onSort,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <SortableHeader
              label="#"
              column="id"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={onSort}
              className="pl-4"
            />
            <SortableHeader
              label="Problem"
              column="title"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={onSort}
            />
            <SortableHeader
              label="Difficulty"
              column="difficulty"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={onSort}
            />
            <SortableHeader
              label="Frequency"
              column="frequency"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={onSort}
              className="hidden sm:table-cell"
            />
            <th className="px-2 py-2.5 font-semibold">Status</th>
            <th className="px-2 py-2.5 font-semibold">Review</th>
            <th className="py-2.5 pl-2 pr-4" />
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <QuestionRow
              key={q.id}
              question={q}
              progress={getProgress(q.id)}
              onToggleCompleted={() => onToggleCompleted(q.id)}
              onToggleReview={() => onToggleReview(q.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface SortableHeaderProps {
  label: string;
  column: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  className?: string;
}

function SortableHeader({
  label,
  column,
  sortKey,
  sortDir,
  onSort,
  className,
}: SortableHeaderProps) {
  const active = sortKey === column;
  return (
    <th className={cn('px-2 py-2.5 font-semibold', className)} aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          'group inline-flex items-center gap-1 rounded text-xs font-semibold uppercase tracking-wide transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          active ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {label}
        {active ? (
          sortDir === 'asc' ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" />
          )
        ) : (
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-60" />
        )}
      </button>
    </th>
  );
}
