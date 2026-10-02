// Build-time Markdown rendering. Imported only by the markdown-content plugin
// in vite.config.ts, so markdown-it and highlight.js never reach the browser
// bundle; pages receive ready-made HTML.

import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/common';
import type { Frontmatter, RenderedContent } from './types';

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(code: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(code, { language: lang }).value}</code></pre>`;
      } catch {
        /* fall through to escaped */
      }
    }
    return `<pre class="hljs"><code>${escapeHtml(code)}</code></pre>`;
  },
});

// Minimal frontmatter parser for our controlled `key: value` / `key: [a, b]` blocks.
function parseFrontmatter(raw: string): { data: Frontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };

  const data: Record<string, unknown> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const rawVal = line.slice(idx + 1).trim();
    if (!key) continue;
    if (rawVal.startsWith('[') && rawVal.endsWith(']')) {
      data[key] = rawVal
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      data[key] = rawVal.replace(/^["']|["']$/g, '');
    }
  }
  return { data: data as Frontmatter, body: match[2] };
}

/** Drafts (`draft: true`) are built only when previewing (VITE_SHOW_DRAFTS=1). */
export const isPublished = (frontmatter: Frontmatter, showDrafts: boolean): boolean =>
  showDrafts || frontmatter.draft !== 'true';

export function renderContent(raw: string): RenderedContent {
  const { data, body } = parseFrontmatter(raw);
  const html = md.render(body);
  const excerpt =
    data.description ||
    body.replace(/<!--[\s\S]*?-->/g, '').replace(/[#>*`_[\]]/g, '').trim().slice(0, 160);
  return { frontmatter: data, html, excerpt };
}
