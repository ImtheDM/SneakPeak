import { PERIOD_LABELS, type Period } from '../types';

interface Props {
  periods: Period[];
  period: Period;
  onChange: (period: Period) => void;
  disabled?: boolean;
}

/** Time-window selector for the active company, showing only available datasets. */
export function PeriodSelector({ periods, period, onChange, disabled }: Props) {
  return (
    <div className="relative inline-flex">
      <select
        aria-label="Select time window"
        value={period}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as Period)}
        className="h-9 rounded-md border border-input bg-card pl-3 pr-8 text-sm font-medium text-foreground outline-none ring-ring transition-shadow focus-visible:ring-2 disabled:opacity-50"
      >
        {periods.map((p) => (
          <option key={p} value={p}>
            {PERIOD_LABELS[p]}
          </option>
        ))}
      </select>
    </div>
  );
}
