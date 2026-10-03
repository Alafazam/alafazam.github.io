import { STATIC_ROUTES } from './routes';
import { absoluteUrl, blogPath, projectPath } from './site';
import { blogPosts, projects } from '../utils/content';

export interface ManifestEntry {
  path: string;
  url: string;
  indexable: boolean;
  /** YYYY-MM-DD, from frontmatter `date` where the content has one. */
  lastmod?: string;
}

/**
 * Every route the build prerenders. Server-only (imported by entry-server):
 * it pulls in the Markdown content, which the homepage bundle must not.
 */
export function routeManifest(): ManifestEntry[] {
  return [
    ...STATIC_ROUTES.map((r) => ({ path: r.path, url: absoluteUrl(r.path), indexable: r.indexable })),
    ...projects.map((p) => ({
      path: projectPath(p.slug),
      url: absoluteUrl(projectPath(p.slug)),
      indexable: true,
      lastmod: p.frontmatter.date,
    })),
    ...blogPosts.map((p) => ({
      path: blogPath(p.slug),
      url: absoluteUrl(blogPath(p.slug)),
      indexable: true,
      lastmod: p.frontmatter.date,
    })),
  ];
}
