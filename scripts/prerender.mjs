// Build-time prerender. Replaces react-snap: instead of driving a headless
// browser and serialising the resulting DOM, this renders each route with
// React's own server renderer, so the HTML carries the hydration markers
// hydrateRoot expects and the client adopts the markup instead of discarding it.
//
// Runs after both Vite builds — see the `build` script in package.json.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const clientDir = join(root, 'dist');
const serverEntry = join(root, 'dist-ssr', 'entry-server.js');

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

  // JSON-LD (FAQPage, BlogPosting, …) is route-specific; index.html carries
  // only the site-wide Person schema, so there is nothing to strip.
  if (helmet.script) merged += helmet.script;

  return merged;
}

const template = readFileSync(join(clientDir, 'index.html'), 'utf8');
const headMatch = template.match(/<head>([\s\S]*?)<\/head>/);
if (!headMatch) throw new Error('dist/index.html has no <head> — did the client build run?');

const count = (html, re) => (html.match(re) || []).length;
const attr = (tag, name) => (tag.match(new RegExp(`${name}="([^"]*)"`)) || [])[1];

/**
 * SEO invariants every prerendered page must hold. Each one is a mistake that
 * already shipped once or is easy to make silently (see docs/seo.md), so the
 * build fails rather than deploying it.
 */
function assertSeo(entry, page, descriptions) {
  const fail = (msg) => {
    throw new Error(`Prerendered ${entry.path}: ${msg}`);
  };
  const head = page.match(/<head>([\s\S]*?)<\/head>/)[1];

  const h1s = count(page, /<h1[\s>]/g);
  if (h1s !== 1) fail(`expected exactly one <h1>, found ${h1s}`);

  const imgWithoutAlt = page.match(/<img\b(?![^>]*\salt=)[^>]*>/);
  if (imgWithoutAlt) fail(`<img> without alt: ${imgWithoutAlt[0]}`);

  const descTags = head.match(/<meta[^>]*name="description"[^>]*>/g) || [];
  if (descTags.length !== 1) fail(`expected one description meta, found ${descTags.length}`);
  const description = (attr(descTags[0], 'content') || '').trim();
  if (!description) fail('empty meta description');
  if (descriptions.has(description)) {
    fail(`meta description duplicates ${descriptions.get(description)} — set one in src/seo/routes.ts`);
  }
  descriptions.set(description, entry.path);

  const canonicals = head.match(/<link[^>]*rel="canonical"[^>]*>/g) || [];
  const ogUrls = head.match(/<meta[^>]*property="og:url"[^>]*>/g) || [];
  const robots = head.match(/<meta[^>]*name="robots"[^>]*>/g) || [];
  if (robots.length !== 1) fail(`expected one robots meta, found ${robots.length}`);
  const noindex = attr(robots[0], 'content').includes('noindex');

  if (entry.indexable) {
    if (noindex) fail('indexable route is marked noindex');
    if (canonicals.length !== 1 || attr(canonicals[0], 'href') !== entry.url) {
      fail(`expected one canonical pointing at ${entry.url}, found ${canonicals.join(' ') || 'none'}`);
    }
    if (ogUrls.length !== 1 || attr(ogUrls[0], 'content') !== entry.url) {
      fail(`expected one og:url of ${entry.url}, found ${ogUrls.join(' ') || 'none'}`);
    }
  } else {
    if (!noindex) fail('non-indexable route is missing noindex');
    if (canonicals.length || ogUrls.length) fail('noindex route must not carry a canonical or og:url');
  }
}

const { render, routeManifest } = await import(pathToFileURL(serverEntry).href);
const manifest = routeManifest();
const descriptions = new Map();

for (const entry of manifest) {
  const route = entry.path;
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

  assertSeo(entry, page, descriptions);

  if (route === '/404') {
    // GitHub Pages serves /404.html for any path it has no file for, which is
    // what makes client-side routes work on a deep link or a refresh.
    writeFileSync(join(clientDir, '404.html'), page);
  } else {
    const dir = route === '/' ? clientDir : join(clientDir, route);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), page);
    // GitHub Pages answers /projects with a 301 to /projects/ when only the
    // directory exists. A sibling projects.html is served at /projects
    // directly, so the canonical (slash-less) URL resolves in one hop.
    if (route !== '/') writeFileSync(join(clientDir, `${route}.html`), page);
  }
  console.log(`  prerendered ${route}`);
}

// Sitemap is generated from the same manifest, so it can't drift from the
// routes that actually exist.
const urls = manifest
  .filter((entry) => entry.indexable)
  .map((entry) => {
    if (entry.lastmod && !/^\d{4}-\d{2}-\d{2}$/.test(entry.lastmod)) {
      throw new Error(`${entry.path}: frontmatter date "${entry.lastmod}" is not YYYY-MM-DD`);
    }
    const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : '';
    return `  <url>\n    <loc>${entry.url}</loc>${lastmod}\n  </url>`;
  });
writeFileSync(
  join(clientDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
);
console.log(`  wrote sitemap.xml (${urls.length} URLs)`);

// dist-ssr is left in place so this step can be re-run on its own while
// iterating; it is gitignored, and `gh-pages -d dist` never publishes it.

console.log(`\nPrerendered ${manifest.length} routes.`);
