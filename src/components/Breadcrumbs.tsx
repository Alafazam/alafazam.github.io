import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { absoluteUrl } from '../seo/site';
import type { Crumb } from '../seo/breadcrumbs';

/**
 * Visible breadcrumb trail plus its BreadcrumbList JSON-LD, built from the
 * same list so the two can't disagree. The last crumb is the current page.
 */
const Breadcrumbs = ({ items }: { items: Crumb[] }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      item: absoluteUrl(crumb.path),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <ol className="flex flex-wrap items-center gap-1.5 text-gray-500 dark:text-gray-400">
        {items.map((crumb, i) => {
          const isCurrent = i === items.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">›</span>}
              {isCurrent ? (
                <span aria-current="page" className="text-gray-700 dark:text-gray-300">
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.path} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
