// Build-time link check. Runs after the prerender (see the `build` script in
// package.json) and fails the build if any internal link, asset reference or
// sitemap URL in dist/ would 404 — or would only resolve through a redirect —
// once GitHub Pages serves it.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');
const SITE_ORIGIN = 'https://alafazam.com';

const isFile = (p) => {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
};

const htmlFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });

/**
 * How GitHub Pages answers a path: 'ok' (served directly), 'redirect' (only
 * a directory exists, so it 301s to the trailing-slash form) or 'missing'.
 */
function resolvePath(pathname) {
  const target = join(distDir, decodeURIComponent(pathname));
  if (isFile(target)) return 'ok';
  if (pathname.endsWith('/')) return isFile(join(target, 'index.html')) ? 'ok' : 'missing';
  if (isFile(`${target}.html`)) return 'ok';
  return isFile(join(target, 'index.html')) ? 'redirect' : 'missing';
}

/** Site-relative pathname for a URL this site serves, or null if external. */
function internalPath(value) {
  if (value.startsWith(`${SITE_ORIGIN}/`) || value === SITE_ORIGIN) {
    return new URL(value).pathname;
  }
  if (value.startsWith('/') && !value.startsWith('//')) {
    return new URL(value, SITE_ORIGIN).pathname;
  }
  return null;
}

const problems = [];
let checked = 0;

function check(value, source) {
  const pathname = internalPath(value);
  if (pathname === null) return;
  checked++;
  const result = resolvePath(pathname);
  if (result !== 'ok') problems.push(`${source}: ${value} → ${result}`);
}

for (const file of htmlFiles(distDir)) {
  const html = readFileSync(file, 'utf8');
  const source = relative(distDir, file);
  // href/src cover links and assets; content covers og:url and og:image.
  for (const [, value] of html.matchAll(/\s(?:href|src|content)="([^"]+)"/g)) {
    check(value.replace(/&amp;/g, '&'), source);
  }
}

const sitemap = readFileSync(join(distDir, 'sitemap.xml'), 'utf8');
for (const [, loc] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) check(loc, 'sitemap.xml');

if (problems.length) {
  console.error(`\nBroken or redirecting internal links (${problems.length}):`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log(`Link check: ${checked} internal references resolve.`);
