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
      <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
        {items.map((crumb, i) => {
          const isCurrent = i === items.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">›</span>}
              {isCurrent ? (
                <span aria-current="page" className="text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.path} className="text-primary hover:underline">
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
