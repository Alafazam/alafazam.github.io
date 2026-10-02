import { Helmet } from 'react-helmet';
import { absoluteUrl } from '../seo/site';

export interface SeoProps {
  path: string;
  title: string;
  description: string;
  /** False marks the page noindex and omits canonical/og:url. */
  indexable: boolean;
}

/**
 * Per-route head tags. index.html carries only site-wide defaults, so every
 * page renders exactly one of these; scripts/prerender.mjs fails the build if
 * a page ends up without its own canonical or description.
 *
 * Indexable pages emit no robots tag: the template's `index, follow` stands,
 * and a preview build's `noindex` (see vite.config.ts) is never overridden.
 */
const Seo = ({ path, title, description, indexable }: SeoProps) => {
  const url = absoluteUrl(path);
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {indexable && <link rel="canonical" href={url} />}
      {indexable && <meta property="og:url" content={url} />}
      {!indexable && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
};

export default Seo;
