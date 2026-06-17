import { AlertTriangle, RefreshCw, SearchX } from 'lucide-react';

/** Skeleton placeholder shown while the CSV is being fetched. */
export function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="h-10 border-b border-border bg-muted/40" />
      <div className="divide-y divide-border">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3.5">
            <div className="h-5 w-5 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-8 animate-pulse rounded bg-muted" />
            <div
              className="h-4 animate-pulse rounded bg-muted"
              style={{ width: `${30 + ((i * 13) % 45)}%` }}
            />
            <div className="ml-auto h-5 w-16 animate-pulse rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-16 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/15 text-rose-500">
        <AlertTriangle className="h-6 w-6" />
      </span>
      <h3 className="text-base font-semibold">Couldn’t load questions</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <RefreshCw className="h-4 w-4" /> Try again
      </button>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="h-6 w-6" />
      </span>
      <h3 className="text-base font-semibold">No matching questions</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Try adjusting your search or clearing the difficulty filters.
      </p>
    </div>
  );
}
