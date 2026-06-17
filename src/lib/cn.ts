/**
 * Minimal classnames helper — joins truthy class fragments.
 * Avoids pulling in clsx/tailwind-merge for a project this size.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** Turn a repo dir slug ("goldman-sachs") into a display name ("Goldman Sachs"). */
export function formatCompany(slug: string): string {
  return slug
    .split(/[-_]/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}
