import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getProject } from '../utils/content';
import MarkdownContent from '../components/MarkdownContent';

const statusStyles: Record<string, string> = {
  Active: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  'In progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
};

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProject(slug) : undefined;

  if (!project) return <Navigate to="/projects" replace />;

  const { frontmatter, html } = project;
  const { name, tagline, status, tags, link, category, impact } = frontmatter;
  const title = name || frontmatter.title || project.slug;

  return (
    <div className="py-10 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      <div className="mx-auto max-w-3xl">
        <Helmet>
          <title>{title} — Alaf Azam Khan</title>
          {project.excerpt && <meta name="description" content={project.excerpt} />}
          <link rel="canonical" href={`https://alafazam.com/projects/${project.slug}`} />
        </Helmet>

        <Link to="/projects" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          ← All work
        </Link>

        {category && (
          <p className="mt-4 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {category}
          </p>
        )}
        <div className="flex items-start justify-between gap-3 mt-1">
          <h1 className="text-3xl sm:text-4xl font-bold">{title}</h1>
          {status && (
            <span className={`shrink-0 mt-2 text-xs font-medium px-2 py-1 rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
              {status}
            </span>
          )}
        </div>
        {tagline && <p className="text-lg text-blue-600 dark:text-blue-400 mt-1">{tagline}</p>}
        {impact && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" aria-hidden="true" />
            {impact}
          </p>
        )}

        {(tags && tags.length > 0) && (
          <div className="flex flex-wrap gap-2 mt-4 mb-8">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <MarkdownContent html={html} />

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Visit project →
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
