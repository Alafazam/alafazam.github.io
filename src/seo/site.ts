/** Production origin. Canonicals, og:url and the sitemap are all built from it. */
export const SITE_URL = 'https://alafazam.com';

/** Suffix for every page title except the homepage, which sets its own. */
export const TITLE_SUFFIX = ' — Alaf Azam Khan';

/**
 * Absolute URL for a route path. URLs carry no trailing slash (except the
 * root) — scripts/prerender.mjs writes a flat `<route>.html` so GitHub Pages
 * serves exactly this form without a redirect.
 */
export const absoluteUrl = (path: string): string =>
  path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;

export const projectPath = (slug: string): string => `/projects/${slug}`;
export const blogPath = (slug: string): string => `/blog/${slug}`;
