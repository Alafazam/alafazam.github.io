import { Link } from 'react-router-dom';
import { blogPosts, formatDate } from '../utils/content';

const Blog = () => {
  return (
    <div className="py-12 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Writing</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Notes on product, engineering leadership, and building AI-native software in retail.
          </p>
        </header>

        {blogPosts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-gray-600 dark:text-gray-300">
            Posts are on the way.
          </div>
        ) : (
          <div className="space-y-4">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group block rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-5 transition-all hover:-translate-y-0.5 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md"
              >
                {post.frontmatter.date && (
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {formatDate(post.frontmatter.date)}
                  </p>
                )}
                <h2 className="text-xl font-semibold mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.frontmatter.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {post.frontmatter.description || post.excerpt}
                </p>
                <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-blue-600 dark:text-blue-400">
                  Read →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
