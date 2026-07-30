import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getBlogPost, formatDate } from '../utils/content';
import MarkdownContent from '../components/MarkdownContent';

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

        <MarkdownContent html={html} />
      </div>
    </div>
  );
};

export default BlogPost;
