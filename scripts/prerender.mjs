// Build-time prerender. Replaces react-snap: instead of driving a headless
// browser and serialising the resulting DOM, this renders each route with
// React's own server renderer, so the HTML carries the hydration markers
// hydrateRoot expects and the client adopts the markup instead of discarding it.
//
// Runs after both Vite builds — see the `build` script in package.json.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const clientDir = join(root, 'dist');
const serverEntry = join(root, 'dist-ssr', 'entry-server.js');

/** Routes that exist regardless of content. `/404` becomes the SPA fallback. */
const STATIC_ROUTES = [
  '/',
  '/projects',
  // A code route, not a markdown file, so it is listed here rather than picked
  // up by the content glob below.
  '/projects/emi-calculator',
  '/blog',
  '/recruiter',
  '/hiring-manager',
  '/interviewer',
  '/campusHiring',
  '/404',
];

/** Markdown-backed routes, read off disk so a new post needs no edit here. */
const contentRoutes = (dir, prefix) => {
  try {
    return readdirSync(join(root, 'src/content', dir))
      .filter((f) => f.endsWith('.md'))
      .map((f) => `${prefix}/${f.replace(/\.md$/, '')}`);
  } catch {
    return [];
  }
};

const ROUTES = [
  ...STATIC_ROUTES,
  ...contentRoutes('projects', '/projects'),
  ...contentRoutes('blog', '/blog'),
];

/**
 * Merges a route's helmet tags into the template head.
 *
 * index.html already carries site-wide SEO defaults, and helmet overrides some
 * of them per route. Appending blindly would leave two <title>s and two
 * description metas in the served HTML, so drop the template's copy of anything
 * this route sets.
 */
function mergeHead(head, helmet) {
  let merged = head;

  // react-helmet emits `<title data-react-helmet="true"></title>` even when a
  // route sets no title, so test the text rather than the tag — otherwise every
  // page that relies on the site-wide default would ship with an empty title.
  const title = (helmet.title.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [, ''])[1].trim();
  if (title) {
    merged = merged.replace(/<title[^>]*>[\s\S]*?<\/title>/, '') + helmet.title;
  }

  for (const tag of [helmet.meta, helmet.link]) {
    if (!tag) continue;
    // Strip the template's tag for each name/property/rel this route replaces.
    for (const attr of tag.matchAll(/(name|property|rel)="([^"]+)"/g)) {
      const [, kind, value] = attr;
      merged = merged.replace(
        new RegExp(`<(meta|link)[^>]*${kind}="${value}"[^>]*>\\s*`, 'g'),
        ''
      );
    }
    merged += tag;
  }

  return merged;
}

const template = readFileSync(join(clientDir, 'index.html'), 'utf8');
const headMatch = template.match(/<head>([\s\S]*?)<\/head>/);
if (!headMatch) throw new Error('dist/index.html has no <head> — did the client build run?');

const { render } = await import(pathToFileURL(serverEntry).href);

let count = 0;
for (const route of ROUTES) {
  const { html, head } = await render(route);

  const page = template
    .replace(headMatch[1], mergeHead(headMatch[1], head))
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  // A route that renders the NotFound page has no matching <Route>: the list
  // above and src/App.tsx have drifted apart. Catch it here rather than ship a
  // 404 to a URL that is in the sitemap.
  if (route !== '/404' && /<h1[^>]*>404<\/h1>/.test(html)) {
    throw new Error(`Route ${route} prerendered as the 404 page — is it declared in src/App.tsx?`);
  }

  // A page with no title is always a bug — usually a head-merge that stripped
  // the template's default. Fail the build rather than deploy it.
  const shipped = page.match(/<title[^>]*>([\s\S]*?)<\/title>/);
  if (!shipped || !shipped[1].trim()) {
    throw new Error(`Prerendered ${route} has an empty <title>`);
  }

  if (route === '/404') {
    // GitHub Pages serves /404.html for any path it has no file for, which is
    // what makes client-side routes work on a deep link or a refresh.
    writeFileSync(join(clientDir, '404.html'), page);
  } else {
    const dir = route === '/' ? clientDir : join(clientDir, route);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), page);
  }
  count++;
  console.log(`  prerendered ${route}`);
}

// dist-ssr is left in place so this step can be re-run on its own while
// iterating; it is gitignored, and `gh-pages -d dist` never publishes it.

console.log(`\nPrerendered ${count} routes.`);
