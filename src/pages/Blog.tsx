import { Link } from 'react-router-dom';
import { blogPosts, formatDate, seriesOrderOf } from '../utils/content';
import Seo from '../components/Seo';
import { staticRoute } from '../seo/routes';

const Blog = () => {
  return (
    <div className="py-12 px-4">
      <Seo {...staticRoute('/blog')} />
      <div className="mx-auto max-w-4xl">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Writing</h1>
          <p className="text-muted-foreground">
            Notes on product, engineering leadership, and building AI-native software in retail.
          </p>
        </header>

        {blogPosts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-muted-foreground">
            Posts are on the way.
          </div>
        ) : (
          <div className="space-y-4">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="card-interactive group p-5"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {post.frontmatter.date && (
                    <p className="text-xs font-medium text-muted-foreground">
                      {formatDate(post.frontmatter.date)}
                    </p>
                  )}
                  {post.frontmatter.series && (
                    <span
                      title={post.frontmatter.series}
                      className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                    >
                      {seriesOrderOf(post) === 0 ? 'Series intro' : `Series · Part ${seriesOrderOf(post)}`}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-semibold tracking-tight mt-1 group-hover:text-primary transition-colors">
                  {post.frontmatter.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                  {post.frontmatter.description || post.excerpt}
                </p>
                <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary">
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
