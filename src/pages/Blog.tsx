import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { blogPosts, formatDate } from '../utils/content';
import { useDraftPosts } from '../hooks/useDraftPosts';

const Blog = () => {
  const essayCount = blogPosts.length;
  const draftPosts = useDraftPosts();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white px-4 pb-20 pt-12 text-gray-900 transition-colors duration-200 dark:bg-gray-900 dark:text-white sm:px-6 sm:pt-14">
      <div className="mx-auto max-w-4xl">
        <header className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 dark:text-blue-400 sm:text-sm">
            Essays &amp; notes
          </span>
          <h1 className="mt-4 font-serif text-5xl font-bold leading-none tracking-tight sm:text-7xl lg:text-8xl">Writing</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-300 sm:font-serif sm:text-2xl sm:leading-snug">
            Notes on product, engineering leadership, and building AI-native software in retail.
          </p>
          {draftPosts && draftPosts.length > 0 && (
            <a href="#drafts-heading" className="mt-5 inline-block text-sm font-medium text-amber-700 underline underline-offset-4 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300">
              {essayCount} finished essay · {draftPosts.length} draft outlines for review ↓
            </a>
          )}
        </header>

        <div className="mt-10 min-w-0 sm:mt-12">
          {essayCount === 0 ? (
            <p className="border-y border-gray-200 py-10 text-center text-gray-600 dark:border-gray-700 dark:text-gray-300">
              Essays are on the way.
            </p>
          ) : (
            <div className="border-t border-gray-200 dark:border-gray-700">
              {blogPosts.map((post) => (
                <article key={post.slug} className="border-b border-gray-200 dark:border-gray-700">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group block py-7 outline-none transition-colors hover:bg-blue-50/50 focus-visible:bg-blue-50/50 focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-blue-950/30 dark:focus-visible:bg-blue-950/30 dark:focus-visible:ring-blue-400 sm:py-8"
                  >
                    {post.frontmatter.date && (
                      <time dateTime={post.frontmatter.date} className="block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 sm:text-sm">
                        {formatDate(post.frontmatter.date)}
                      </time>
                    )}
                    <span className="mt-4 flex items-center justify-between gap-4 sm:mt-5">
                      <h2 className="m-0 font-serif text-2xl font-semibold leading-tight tracking-tight text-blue-700 transition-colors group-hover:text-blue-800 dark:text-blue-400 dark:group-hover:text-blue-300 sm:text-6xl lg:text-7xl">
                        {post.frontmatter.title}
                      </h2>
                      <ArrowRight aria-hidden="true" className="h-6 w-6 shrink-0 text-blue-700 transition-transform group-hover:translate-x-1 dark:text-blue-400 sm:h-8 sm:w-8" />
                    </span>
                    <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:font-serif sm:text-2xl">
                      {post.frontmatter.description || post.excerpt}
                    </p>
                  </Link>
                </article>
              ))}
            </div>
          )}

          {draftPosts && draftPosts.length > 0 && (
            <section aria-labelledby="drafts-heading" className="mt-16 border-t border-gray-200 pt-8 dark:border-gray-700">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">
                Local preview only
              </span>
              <h2 id="drafts-heading" className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">
                Draft outlines
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-gray-600 dark:text-gray-300">
                These {draftPosts.length} pieces are working notes, not finished essays. They are available here for review and are excluded from the production site.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {draftPosts.map((post) => (
                  <Link
                    key={post.slug}
                    to={`/blog/drafts/${post.slug}`}
                    className="group rounded-xl border border-gray-200 p-5 outline-none transition-colors hover:border-amber-500 hover:bg-amber-50/50 focus-visible:ring-2 focus-visible:ring-amber-600 dark:border-gray-700 dark:hover:border-amber-500 dark:hover:bg-amber-950/20 dark:focus-visible:ring-amber-400"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-400">Draft outline</span>
                    <span className="mt-2 flex items-start justify-between gap-3">
                      <span className="font-serif text-xl font-semibold leading-snug group-hover:text-amber-800 dark:group-hover:text-amber-300">
                        {post.frontmatter.title}
                      </span>
                      <ArrowRight aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="mt-3 block text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      {post.frontmatter.description || post.excerpt}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
