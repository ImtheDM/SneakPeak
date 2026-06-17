/**
 * Company logo URLs via Google's favicon service — no API key, served from
 * Google's CDN, and tiny. Logos are loaded lazily per card (see CompanyCard),
 * so nothing is bundled and only on-screen logos are ever fetched.
 */

/**
 * Slugs whose web domain isn't just `<slug without dashes>.com`. Only the cases
 * the naive guess gets wrong need an entry here; everything else falls through.
 */
const DOMAIN_OVERRIDES: Record<string, string> = {
  'the-walt-disney-company': 'disney.com',
  'walmart-labs': 'walmart.com',
  'walmart-global-tech': 'walmart.com',
  twitter: 'x.com',
  x: 'x.com',
  'jane-street': 'janestreet.com',
  'two-sigma': 'twosigma.com',
  'morgan-stanley': 'morganstanley.com',
  'american-express': 'americanexpress.com',
  'bank-of-america': 'bankofamerica.com',
  'capital-one': 'capitalone.com',
  'general-motors': 'gm.com',
  'palo-alto-networks': 'paloaltonetworks.com',
  'national-instruments': 'ni.com',
  'texas-instruments': 'ti.com',
  'expedia-group': 'expedia.com',
  'booking-com': 'booking.com',
  zomato: 'zomato.com',
};

/** Best-effort web domain for a company slug. */
export function companyDomain(slug: string): string {
  return DOMAIN_OVERRIDES[slug] ?? `${slug.replace(/-/g, '')}.com`;
}

/** Google favicon URL for a company slug, sized for a crisp small avatar. */
export function logoUrl(slug: string, size = 64): string {
  return `https://www.google.com/s2/favicons?domain=${companyDomain(slug)}&sz=${size}`;
}
