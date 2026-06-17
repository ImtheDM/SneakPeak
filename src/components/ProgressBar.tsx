import { Bookmark, CheckCircle2 } from 'lucide-react';

interface Props {
  total: number;
  completed: number;
  review: number;
  onReset: () => void;
}

/** One message per 5% milestone, indexed by Math.floor(pct / 5) → 0…20. */
const MILESTONES: string[] = [
  'Every expert was once a beginner. Start now! 🚀',
  'First steps taken — keep the momentum going! 👣',
  'You’re warming up. One problem at a time! 🔥',
  'Nice start! Consistency beats intensity. 💪',
  'Building the habit — keep showing up! 📈',
  'A quarter of the way there. Solid pace! 🎯',
  'You’re rolling now. Don’t stop! ⚡',
  'Momentum is on your side. Keep pushing! 🌟',
  'Almost halfway — your hard work is paying off! 🛠️',
  'So close to the halfway mark. Push on! 🧗',
  'Halfway there! The summit is in sight. 🏔️',
  'More than half done. You’re unstoppable! 🚂',
  'Crushing it — the finish line is calling! 📞',
  'Two-thirds in. Stay sharp, stay hungry! 🦈',
  'You’re in the home stretch now! 🏃',
  'Three-quarters done. Incredible discipline! 🏅',
  'The end is near — finish strong! 💎',
  'Almost there. Don’t let up now! 🔋',
  'So close you can taste it! 🍫',
  'One final push to greatness! 🥇',
  'Complete! You absolutely crushed it! 🏆',
];

export function ProgressBar({ total, completed, review, onReset }: Props) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const message = MILESTONES[Math.min(Math.floor(pct / 5), MILESTONES.length - 1)];

  return (
    <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">Your progress</h2>
          <span className="text-sm text-muted-foreground">
            {completed} / {total} solved
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {completed} done
          </span>
          <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
            <Bookmark className="h-3.5 w-3.5 text-sky-500" /> {review} review
          </span>
          <button
            type="button"
            onClick={onReset}
            disabled={completed + review === 0}
            className="rounded text-xs font-medium text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 disabled:hover:no-underline"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="w-10 text-right text-sm font-semibold tabular-nums">{pct}%</span>
      </div>

      <p className="mt-3 text-xs font-medium text-muted-foreground">{message}</p>
    </section>
  );
}
