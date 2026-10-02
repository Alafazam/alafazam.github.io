import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
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
      <div className="mb-8 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 px-4 py-3 text-sm">
        <span className="font-semibold text-blue-700 dark:text-blue-300">{partLabel(post, total)}</span>
        <span className="text-gray-600 dark:text-gray-300"> · {name}</span>
        {intro && intro.slug !== post.slug && (
          <>
            <span className="text-gray-400 dark:text-gray-500"> · </span>
            <Link to={`/blog/${intro.slug}`} className="text-blue-600 dark:text-blue-400 hover:underline">
              Start with the intro
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <nav
      aria-label={`${name} series`}
      className="mt-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-5"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {partLabel(post, total)} · Series
      </p>
      <p className="mt-1 font-semibold">{name}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            to={`/blog/${prev.slug}`}
            className="block rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 hover:border-blue-400 dark:hover:border-blue-500"
          >
            <span className="block text-xs text-gray-500 dark:text-gray-400">← Previous · {partLabel(prev, total)}</span>
            <span className="block mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">{prev.frontmatter.title}</span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next && (
          <Link
            to={`/blog/${next.slug}`}
            className="block rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 sm:text-right hover:border-blue-400 dark:hover:border-blue-500"
          >
            <span className="block text-xs text-gray-500 dark:text-gray-400">Next · {partLabel(next, total)} →</span>
            <span className="block mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">{next.frontmatter.title}</span>
          </Link>
        )}
      </div>
      {intro && intro.slug !== post.slug && (
        <Link to={`/blog/${intro.slug}`} className="inline-block mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline">
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
  const url = `https://alafazam.com/blog/${post.slug}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    author: { '@type': 'Person', name: 'Alaf Azam Khan', url: 'https://alafazam.com/' },
    publisher: { '@type': 'Person', name: 'Alaf Azam Khan' },
    mainEntityOfPage: url,
    url,
  };

  return (
    <div className="py-10 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      <div className="mx-auto max-w-3xl">
        <Helmet>
          <title>{frontmatter.title} — Alaf Azam Khan</title>
          {frontmatter.description && <meta name="description" content={frontmatter.description} />}
          <link rel="canonical" href={url} />
          <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Helmet>

        <Link to="/blog" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          ← All writing
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold mt-4">{frontmatter.title}</h1>
        {frontmatter.date && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-8">
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
