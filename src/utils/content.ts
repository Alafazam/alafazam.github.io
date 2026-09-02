import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/common';

export interface Frontmatter {
  // shared
  title?: string;
  description?: string;
  tags?: string[];
  // blog
  date?: string;
  // projects / work
  name?: string;
  tagline?: string;
  status?: string;
  order?: number;
  link?: string;
  category?: string;
  impact?: string;
  icon?: string;
}

export interface ContentItem {
  slug: string;
  frontmatter: Frontmatter;
  html: string;
  excerpt: string;
}

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

function load(glob: Record<string, string>): ContentItem[] {
  return Object.entries(glob).map(([path, raw]) => {
    const slug = path.split('/').pop()!.replace(/\.md$/, '');
    const { data, body } = parseFrontmatter(raw);
    const html = md.render(body);
    const excerpt =
      data.description ||
      body.replace(/<!--[\s\S]*?-->/g, '').replace(/[#>*`_[\]]/g, '').trim().slice(0, 160);
    return { slug, frontmatter: data, html, excerpt };
  });
}

const blogGlob = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const projectGlob = import.meta.glob('../content/projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const blogPosts: ContentItem[] = load(blogGlob).sort((a, b) =>
  (b.frontmatter.date || '').localeCompare(a.frontmatter.date || '')
);

export const projects: ContentItem[] = load(projectGlob).sort(
  (a, b) => Number(a.frontmatter.order || 0) - Number(b.frontmatter.order || 0)
);

export const getBlogPost = (slug: string) => blogPosts.find((p) => p.slug === slug);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

// Order the "See My Work" categories deliberately (Builds first).
export const PROJECT_CATEGORIES = ['Builds', 'Frameworks & Processes'] as const;

export interface ProjectGroup {
  category: string;
  description: string;
  items: ContentItem[];
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Builds: "Products and systems I've designed and shipped.",
  'Frameworks & Processes': "Operating frameworks and processes I've designed and run at scale.",
};

export const projectsByCategory = (): ProjectGroup[] => {
  const known = PROJECT_CATEGORIES.map((category) => ({
    category,
    description: CATEGORY_DESCRIPTIONS[category] || '',
    items: projects.filter((p) => (p.frontmatter.category || 'Builds') === category),
  }));
  return known.filter((group) => group.items.length > 0);
};

/**
 * Interactive tools that live on the site. These are code, not markdown, so they
 * are listed explicitly rather than through a `.md` file whose body would never
 * be rendered — the route serves the app itself, not a write-up.
 */
export interface ToolEntry {
  href: string;
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  /** Key into the icon map in SideProjects. */
  icon: string;
}

export const TOOLS: ToolEntry[] = [
  {
    href: '/projects/emi-calculator',
    name: 'EMI Scenario Planner',
    tagline: 'Loan what-ifs, side by side',
    description:
      'Build home-loan repayment scenarios and compare them: a higher EMI, a longer or shorter tenure, an annual step-up, a 13th EMI, a one-off prepayment — and what each one saves in interest and years.',
    tags: ['Personal finance', 'Home loan', 'India'],
    icon: 'calculator',
  },
];

export const formatDate = (d?: string): string =>
  d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
