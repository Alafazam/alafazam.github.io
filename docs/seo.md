# SEO

How the site's head tags, sitemap and prerendered HTML fit together.

## Where things live

| What | Where |
|---|---|
| Origin, title suffix, URL builders | `src/seo/site.ts` |
| Title, description and indexability of every static route | `src/seo/routes.ts` (`STATIC_ROUTES`) |
| Per-page head tags (title, description, canonical, og/twitter, robots) | `src/components/Seo.tsx` |
| Full list of prerendered routes (static + Markdown) | `src/seo/manifest.ts` |
| FAQPage JSON-LD | `src/components/sections/Faq.tsx`, built from the same `faqItems` it renders |
| BlogPosting JSON-LD | `src/pages/BlogPost.tsx` |
| Breadcrumb trails + BreadcrumbList JSON-LD | `src/seo/breadcrumbs.ts` (trails), `src/components/Breadcrumbs.tsx` (render + schema) |
| Site-wide defaults (Person JSON-LD, og:image, theme) | `index.html` |

`index.html` is the template for every prerendered page, so it must hold nothing that is specific to one route. Its title and description are fallbacks only. The prerender replaces them on every page.

## Adding a page

- **Code route:** add the `<Route>` in `src/App.tsx`, add an entry to `STATIC_ROUTES`, and render `<Seo {...staticRoute('/your-path')} />` in the page.
- **Markdown post or project:** drop the `.md` file into `src/content/blog` or `src/content/projects`. The route, the sitemap entry and the `<lastmod>` (from frontmatter `date`, `YYYY-MM-DD`) come from it automatically.

Set `indexable: false` to keep a page live but out of search: it gets `noindex, nofollow`, no canonical, and no sitemap entry.

## What the build does

`pnpm build` runs `scripts/prerender.mjs`, which for every manifest route:

1. Renders the page and merges its head tags into the template.
2. Writes `dist/<route>/index.html` **and** `dist/<route>.html`. GitHub Pages serves the `.html` file at the slash-less URL, so canonical URLs resolve without a 301.
3. Fails the build if the page breaks one of these rules:
   - exactly one `<h1>`
   - every `<img>` has an `alt`
   - exactly one meta description, non-empty, and unique across the site
   - exactly one robots meta
   - indexable pages: one canonical and one `og:url`, both equal to the page's own URL
   - noindex pages: no canonical and no `og:url`

It then writes `dist/sitemap.xml` from the indexable manifest entries. There is no hand-maintained sitemap.

Finally, `scripts/check-links.mjs` scans every `dist/**/*.html` for internal `href`, `src` and `content` URLs (including `https://alafazam.com/...` in og tags), plus every sitemap `<loc>`. It resolves each one the way GitHub Pages would. The build fails on any URL that would 404, or that would only work through a trailing-slash redirect.

## Markdown content

Posts and projects are rendered **at build time**. The `markdown-content` plugin in `vite.config.ts` turns each `*.md?content` import (the globs in `src/utils/content.ts`) into `{ frontmatter, html, excerpt }` using `src/content/render.ts`. So markdown-it and highlight.js never ship to the browser; highlight.js is only a runtime dependency for its stylesheet.

`draft: true` content becomes `null` at build time unless `VITE_SHOW_DRAFTS=1` (set by `deploy:preview`). Drafts therefore never reach production pages, the sitemap, or the JavaScript bundle.

## Lint

`pnpm lint` uses `.eslintrc.cjs` (ESLint 8, Vite's React + TypeScript rules). Build output (`dist*`) is ignored.

## Deploying

The repo uses pnpm only (`packageManager` in `package.json`). Deploy with `pnpm run deploy`, not `pnpm deploy`, which is a built-in pnpm command. It builds and publishes `dist/` to the `gh-pages` branch.

## One-time setup outside the repo

Google Search Console, Domain property (covers http/https and www/apex):

1. Go to https://search.google.com/search-console, choose **Add property**, then **Domain**, and enter `alafazam.com`.
2. Copy the `google-site-verification=…` TXT value Google shows you.
3. At your DNS provider, add a TXT record on the root host (`@`) with that value.
4. Back in Search Console, click **Verify**. DNS can take a few minutes to an hour to propagate.
5. Under **Sitemaps**, submit `https://alafazam.com/sitemap.xml`.
6. Use **URL Inspection** on `/` and `/projects` and request indexing.
