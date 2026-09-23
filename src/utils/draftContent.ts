import { loadContent } from './content';

// This module is imported only by the local development preview.
const draftGlob = import.meta.glob('../content/blog/_drafts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const draftPosts = loadContent(draftGlob)
  .filter((post) => post.frontmatter.draft === 'true')
  .sort((a, b) => (a.frontmatter.title || '').localeCompare(b.frontmatter.title || ''));
