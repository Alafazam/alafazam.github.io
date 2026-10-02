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

## One-time setup outside the repo

Google Search Console: add a **Domain** property for `alafazam.com` (verified with a DNS TXT record, which covers http/https and www/apex). Then submit `https://alafazam.com/sitemap.xml`.
