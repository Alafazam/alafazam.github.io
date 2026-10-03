import type { ContentItem, RenderedContent } from '../content/types';

export type { Frontmatter, ContentItem } from '../content/types';

// Each `?content` import is rendered to { frontmatter, html, excerpt } at build
// time by the markdown-content plugin in vite.config.ts. Drafts arrive as null
// unless the build is a preview (see isPublished in src/content/render.ts).
type ContentGlob = Record<string, RenderedContent | null>;

function load(glob: ContentGlob): ContentItem[] {
  return Object.entries(glob).flatMap(([path, item]) =>
    item ? [{ slug: path.split('/').pop()!.replace(/\.md$/, ''), ...item }] : []
  );
}

const blogGlob: ContentGlob = import.meta.glob('../content/blog/*.md', {
  query: '?content',
  import: 'default',
  eager: true,
});

const projectGlob: ContentGlob = import.meta.glob('../content/projects/*.md', {
  query: '?content',
  import: 'default',
  eager: true,
});

export const blogPosts: ContentItem[] = load(blogGlob).sort((a, b) =>
  (b.frontmatter.date || '').localeCompare(a.frontmatter.date || '')
);

export const projects: ContentItem[] = load(projectGlob).sort(
  (a, b) => Number(a.frontmatter.order || 0) - Number(b.frontmatter.order || 0)
);

export const getBlogPost = (slug: string) => blogPosts.find((p) => p.slug === slug);

/**
 * A post's position in its series. The frontmatter parser leaves every value as a
 * string, so `seriesOrder` is coerced here, the same way `order` is.
 */
export const seriesOrderOf = (post: ContentItem): number => Number(post.frontmatter.seriesOrder || 0);

/** Posts in a series, in reading order. */
export const getSeries = (name: string, posts: ContentItem[] = blogPosts): ContentItem[] =>
  posts
    .filter((p) => p.frontmatter.series === name)
    .sort((a, b) => seriesOrderOf(a) - seriesOrderOf(b));

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
