import { blogPath, projectPath } from './site';

export interface Crumb {
  label: string;
  path: string;
}

// Labels match the SiteNav entries, so the trail reads like the menu.
const HOME: Crumb = { label: 'Home', path: '/' };
const WORK: Crumb = { label: 'Work', path: '/projects' };
const BLOG: Crumb = { label: 'Blog', path: '/blog' };

/** Trail for anything under /projects; `slug` is the path segment after it. */
export const workTrail = (label: string, slug: string): Crumb[] => [
  HOME,
  WORK,
  { label, path: projectPath(slug) },
];

export const blogTrail = (label: string, slug: string): Crumb[] => [
  HOME,
  BLOG,
  { label, path: blogPath(slug) },
];
