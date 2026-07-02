import { Link } from 'react-router-dom';
import { blogPosts, formatDate } from '../utils/content';

const Blog = () => {
  return (
    <div className="py-10 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Writing</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Notes on product, engineering leadership, and building AI-native software in retail.
          </p>
        </header>

        {blogPosts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-gray-600 dark:text-gray-300">
            Posts are on the way.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {blogPosts.map((post) => (
              <li key={post.slug} className="py-6 first:pt-0">
                <Link to={`/blog/${post.slug}`} className="group block">
                  <h2 className="text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.frontmatter.title}
                  </h2>
                  {post.frontmatter.date && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(post.frontmatter.date)}
                    </p>
                  )}
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {post.frontmatter.description || post.excerpt}
                  </p>
                  <span className="inline-block mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                    Read →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Blog;
