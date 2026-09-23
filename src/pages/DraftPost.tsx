import { Link, Navigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MarkdownContent from '../components/MarkdownContent';
import { useDraftPosts } from '../hooks/useDraftPosts';

const DraftPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const draftPosts = useDraftPosts();
  const post = draftPosts?.find((item) => item.slug === slug);

  if (!import.meta.env.DEV) return <Navigate to="/blog" replace />;
  if (draftPosts && !post) return <Navigate to="/blog" replace />;

  return (
    <div className="bg-white px-4 py-10 text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto max-w-3xl">
        <Helmet>
          <meta name="robots" content="noindex,nofollow" />
          <title>{post?.frontmatter.title || 'Draft outline'} — Local preview</title>
        </Helmet>
        <Link to="/blog" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
          ← All writing
        </Link>
        {post ? (
          <>
            <div className="mt-8 rounded-lg border-l-4 border-amber-500 bg-amber-50 px-5 py-4 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
              <p className="text-xs font-bold uppercase tracking-[0.16em]">Draft outline · Local preview only</p>
              <p className="mt-2 text-sm">Working notes for review. This is not a published article.</p>
            </div>
            <h1 className="mt-8 font-serif text-4xl font-bold leading-tight">{post.frontmatter.title}</h1>
            <MarkdownContent html={post.html} />
          </>
        ) : (
          <p className="mt-8 text-gray-600 dark:text-gray-300">Loading draft…</p>
        )}
      </div>
    </div>
  );
};

export default DraftPost;
