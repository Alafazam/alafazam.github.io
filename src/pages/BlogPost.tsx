import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import { blogTrail } from '../seo/breadcrumbs';
import { absoluteUrl, blogPath, SITE_URL, TITLE_SUFFIX } from '../seo/site';
import { getBlogPost, getSeries, seriesOrderOf, formatDate, type ContentItem } from '../utils/content';
import MarkdownContent from '../components/MarkdownContent';

/** "Part N of M" label. Order 0 is the series intro and is not counted as a part. */
const partLabel = (post: ContentItem, total: number): string => {
  const n = seriesOrderOf(post);
  return n === 0 ? 'Series intro' : `Part ${n} of ${total}`;
};

interface SeriesBoxProps {
  post: ContentItem;
  /** `top` is the compact orientation strip; `bottom` adds prev/next navigation. */
  placement: 'top' | 'bottom';
}

// Links a post to the rest of its series: where you are, the intro, and the
// neighbouring parts. Renders nothing for posts without a `series`.
const SeriesBox = ({ post, placement }: SeriesBoxProps) => {
  const name = post.frontmatter.series;
  if (!name) return null;

  const series = getSeries(name);
  const index = series.findIndex((p) => p.slug === post.slug);
  const total = series.filter((p) => seriesOrderOf(p) > 0).length;
  const intro = series.find((p) => seriesOrderOf(p) === 0);
  const prev = index > 0 ? series[index - 1] : undefined;
  const next = index >= 0 && index < series.length - 1 ? series[index + 1] : undefined;

  if (placement === 'top') {
    return (
      <div className="mb-8 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm">
        <span className="font-semibold text-primary">{partLabel(post, total)}</span>
        <span className="text-muted-foreground"> · {name}</span>
        {intro && intro.slug !== post.slug && (
          <>
            <span className="text-muted-foreground"> · </span>
            <Link to={`/blog/${intro.slug}`} className="text-primary hover:underline">
              Start with the intro
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <nav aria-label={`${name} series`} className="mt-12 rounded-xl border border-border bg-muted/40 p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {partLabel(post, total)} · Series
      </p>
      <p className="mt-1 font-semibold">{name}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link to={`/blog/${prev.slug}`} className="card-interactive p-3">
            <span className="block text-xs text-muted-foreground">← Previous · {partLabel(prev, total)}</span>
            <span className="block mt-1 text-sm font-medium text-primary">{prev.frontmatter.title}</span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next && (
          <Link to={`/blog/${next.slug}`} className="card-interactive p-3 sm:text-right">
            <span className="block text-xs text-muted-foreground">Next · {partLabel(next, total)} →</span>
            <span className="block mt-1 text-sm font-medium text-primary">{next.frontmatter.title}</span>
          </Link>
        )}
      </div>
      {intro && intro.slug !== post.slug && (
        <Link to={`/blog/${intro.slug}`} className="inline-block mt-4 text-sm text-primary hover:underline">
          Series intro: all {total} parts →
        </Link>
      )}
    </nav>
  );
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : undefined;

  if (!post) return <Navigate to="/blog" replace />;

  const { frontmatter, html } = post;
  const url = absoluteUrl(blogPath(post.slug));
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    author: { '@type': 'Person', name: 'Alaf Azam Khan', url: `${SITE_URL}/` },
    publisher: { '@type': 'Person', name: 'Alaf Azam Khan' },
    mainEntityOfPage: url,
    url,
  };

  return (
    <div className="py-10 px-4">
      <div className="mx-auto max-w-3xl">
        <Seo
          path={blogPath(post.slug)}
          title={`${frontmatter.title}${TITLE_SUFFIX}`}
          description={frontmatter.description || post.excerpt}
          indexable
        />
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Helmet>

        <Breadcrumbs items={blogTrail(frontmatter.title || post.slug, post.slug)} />

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-4">{frontmatter.title}</h1>
        {frontmatter.date && (
          <p className="text-sm text-muted-foreground mt-2 mb-8">
            {formatDate(frontmatter.date)}
          </p>
        )}

        <SeriesBox post={post} placement="top" />

        <MarkdownContent html={html} />

        <SeriesBox post={post} placement="bottom" />
      </div>
    </div>
  );
};

export default BlogPost;
