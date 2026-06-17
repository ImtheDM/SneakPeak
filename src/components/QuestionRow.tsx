import { Bookmark, CheckCircle2, Circle, ExternalLink } from 'lucide-react';
import { cn } from '../lib/cn';
import type { Question, QuestionProgress } from '../types';
import { DifficultyBadge } from './DifficultyBadge';

interface Props {
  question: Question;
  progress: QuestionProgress;
  onToggleCompleted: () => void;
  onToggleReview: () => void;
}

function FrequencyMeter({ value }: { value: number | null }) {
  if (value === null) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary/70"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="w-11 text-right text-xs tabular-nums text-muted-foreground">
        {value.toFixed(1)}%
      </span>
    </div>
  );
}

export function QuestionRow({ question, progress, onToggleCompleted, onToggleReview }: Props) {
  const open = () => window.open(question.url, '_blank', 'noopener,noreferrer');
  const completed = !!progress.completed;
  const review = !!progress.review;

  return (
    <tr
      onClick={open}
      className={cn(
        'group cursor-pointer border-b border-border transition-colors hover:bg-accent/60',
        completed && 'opacity-65',
      )}
    >
      <td className="px-2 py-3 pl-4 text-sm tabular-nums text-muted-foreground">{question.id}</td>
      <td className="px-2 py-3">
        <span
          className={cn(
            'text-sm font-medium',
            completed && 'line-through decoration-muted-foreground/50',
          )}
        >
          {question.title}
        </span>
      </td>
      <td className="px-2 py-3">
        <DifficultyBadge difficulty={question.difficulty} />
      </td>
      <td className="hidden px-2 py-3 sm:table-cell">
        <FrequencyMeter value={question.frequency} />
      </td>
      <td className="px-2 py-3">
        <button
          type="button"
          aria-pressed={completed}
          title={completed ? 'Mark as not completed' : 'Mark as completed'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompleted();
          }}
          className="inline-flex items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {completed ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
          )}
        </button>
      </td>
      <td className="px-2 py-3">
        <button
          type="button"
          aria-pressed={review}
          title={review ? 'Remove from review' : 'Mark for review'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleReview();
          }}
          className="inline-flex items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Bookmark
            className={cn(
              'h-5 w-5 transition-colors',
              review
                ? 'fill-sky-500 text-sky-500'
                : 'text-muted-foreground hover:text-foreground',
            )}
          />
        </button>
      </td>
      <td className="py-3 pl-2 pr-4 text-right">
        <a
          href={question.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Solve <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </td>
    </tr>
  );
}
