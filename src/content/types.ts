// Shared by the build-time renderer (src/content/render.ts) and the
// runtime content API (src/utils/content.ts).

export interface Frontmatter {
  // shared
  title?: string;
  description?: string;
  tags?: string[];
  // 'true' hides the item from production builds; preview builds
  // (VITE_SHOW_DRAFTS=1) still render it for review.
  draft?: string;
  // blog
  date?: string;
  /** Posts sharing a `series` name are linked as a numbered run. */
  series?: string;
  /** Position within the series; 0 is the series intro and is not counted as a part. */
  seriesOrder?: number;
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

/** What the build emits for one Markdown file; the slug comes from its path. */
export type RenderedContent = Omit<ContentItem, 'slug'>;
