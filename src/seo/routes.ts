import { TITLE_SUFFIX } from './site';

export interface StaticRoute {
  path: string;
  title: string;
  description: string;
  /** False keeps the page out of the sitemap and marks it noindex. */
  indexable: boolean;
}

/**
 * Every route that exists regardless of content, with its head metadata.
 * The single source for both the page's <Seo> tags and the build-time
 * prerender/sitemap (via src/seo/manifest.ts). Markdown-backed routes are
 * derived from src/content instead, so a new post needs no edit here.
 */
export const STATIC_ROUTES: StaticRoute[] = [
  {
    path: '/',
    title: 'Alaf Azam Khan — Director of Engineering & Product',
    description:
      '9 years inside Increff — from SDE to Director. Built a 40-person org, 6 products, $12M+ ARR. Now building AI-native merchandising intelligence for global retail.',
    indexable: true,
  },
  {
    path: '/projects',
    title: `Selected Work${TITLE_SUFFIX}`,
    description:
      "Products and systems Alaf Azam Khan has built in retail SaaS, and the operating frameworks he's designed to build them well.",
    indexable: true,
  },
  {
    path: '/projects/emi-calculator',
    title: `EMI Scenario Planner${TITLE_SUFFIX}`,
    description:
      'Build and compare home-loan repayment scenarios side by side: a higher EMI, a longer or shorter tenure, an annual step-up, a 13th EMI or a one-off prepayment — and see the interest and years each one saves.',
    indexable: true,
  },
  {
    path: '/blog',
    title: `Writing${TITLE_SUFFIX}`,
    description:
      'Notes by Alaf Azam Khan on product, engineering leadership, and building AI-native software in retail.',
    indexable: true,
  },
  // Job-search pages: kept live for links already shared, but out of the index
  // so they don't dilute the personal-brand pages.
  {
    path: '/recruiter',
    title: `Recruiter Notes${TITLE_SUFFIX}`,
    description: "A recruiter's-eye summary of Alaf Azam Khan, Director of Engineering & Product at Increff.",
    indexable: false,
  },
  {
    path: '/hiring-manager',
    title: `Hiring Manager's Perspective${TITLE_SUFFIX}`,
    description: "Why Alaf Azam Khan fits an engineering and product leadership role, from a hiring manager's view.",
    indexable: false,
  },
  {
    path: '/interviewer',
    title: `Interviewer's Perspective${TITLE_SUFFIX}`,
    description: 'Interview questions and answers about Alaf Azam Khan, grouped by category.',
    indexable: false,
  },
  // Internal utility, reachable only by direct URL.
  {
    path: '/campusHiring',
    title: 'Campus Hiring — Proctoring Network Audit',
    description: 'Network audit scripts for campus hiring proctoring.',
    indexable: false,
  },
  // Becomes 404.html, which GitHub Pages serves for any unknown path.
  {
    path: '/404',
    title: `Page not found${TITLE_SUFFIX}`,
    description: 'This page does not exist.',
    indexable: false,
  },
];

/** Head metadata for a static route. Throws so a typo fails the build, not SEO. */
export function staticRoute(path: string): StaticRoute {
  const route = STATIC_ROUTES.find((r) => r.path === path);
  if (!route) throw new Error(`No STATIC_ROUTES entry for ${path} — add it to src/seo/routes.ts`);
  return route;
}
