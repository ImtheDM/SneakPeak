import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Info, Search, Sparkles, X } from 'lucide-react';
import { useCompanies } from '../hooks/useCompanies';
import { formatCompany } from '../lib/cn';
import { logoUrl } from '../lib/logo';
import { POPULAR_COMPANIES } from '../types';

export function CompaniesPage() {
  const { companies, loading, fallback } = useCompanies();
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) return companies;
    return companies.filter(
      (c) => c.toLowerCase().includes(q) || formatCompany(c).toLowerCase().includes(q),
    );
  }, [companies, q]);

  const popular = useMemo(
    () => POPULAR_COMPANIES.filter((c) => companies.includes(c)),
    [companies],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Hero */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Pick a company to prep
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
          Browse company-wise LeetCode interview questions. Search a company below and start
          tracking your progress.
        </p>

        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 600+ companies…"
            className="h-12 w-full rounded-xl border border-input bg-card pl-12 pr-11 text-base outline-none ring-ring transition-shadow placeholder:text-muted-foreground focus-visible:ring-2"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Popular quick-picks (only when not searching) */}
        {!q && popular.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Popular
            </span>
            {popular.map((c) => (
              <Link
                key={c}
                to={`/company/${c}`}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {formatCompany(c)}
              </Link>
            ))}
          </div>
        )}
      </div>

      {fallback && (
        <div className="mx-auto mt-8 flex max-w-2xl items-start gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            GitHub’s API is rate-limited right now, so we’re showing a popular subset. The full
            list will return shortly — meanwhile you can still open any company below.
          </span>
        </div>
      )}

      {/* Results */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">
            {q ? `Results for “${query}”` : 'All companies'}
          </h2>
          {!loading && (
            <span className="text-xs text-muted-foreground">{results.length} companies</span>
          )}
        </div>

        {loading ? (
          <CompaniesSkeleton />
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <Building2 className="mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">No companies match “{query}”.</p>
            <p className="mt-1 text-xs text-muted-foreground">Try a different name.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((c) => (
              <li key={c}>
                <CompanyCard company={c} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function CompanyCard({ company }: { company: string }) {
  const label = formatCompany(company);
  const [logoFailed, setLogoFailed] = useState(false);
  return (
    <Link
      to={`/company/${company}`}
      className="group flex h-full items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {logoFailed ? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold uppercase text-primary">
          {label.charAt(0)}
        </span>
      ) : (
        <img
          src={logoUrl(company)}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          width={36}
          height={36}
          onError={() => setLogoFailed(true)}
          className="h-9 w-9 shrink-0 rounded-lg bg-white object-contain p-1 ring-1 ring-border"
        />
      )}
      <span className="min-w-0 flex-1 truncate text-sm font-medium" title={label}>
        {label}
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}

function CompaniesSkeleton() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <li
          key={i}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
        >
          <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-muted" />
          <div
            className="h-4 animate-pulse rounded bg-muted"
            style={{ width: `${45 + ((i * 11) % 40)}%` }}
          />
        </li>
      ))}
    </ul>
  );
}
