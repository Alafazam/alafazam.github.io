import { Link } from 'react-router-dom';
import { projects } from '../utils/content';

const statusStyles: Record<string, string> = {
  Active: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  'In progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
};

const SideProjects = () => {
  return (
    <div className="py-10 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">What I'm Building</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Side projects where I get to be the whole team — product, design, and engineering.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => {
            const { name, tagline, status, tags } = project.frontmatter;
            return (
              <Link
                key={project.slug}
                to={`/projects/${project.slug}`}
                className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6 flex flex-col hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h2 className="text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {name}
                  </h2>
                  {status && (
                    <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                      {status}
                    </span>
                  )}
                </div>
                {tagline && (
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">{tagline}</p>
                )}
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{project.excerpt}</p>

                <div className="mt-auto flex flex-wrap items-center gap-2">
                  {(tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="ml-auto text-sm font-medium text-blue-600 dark:text-blue-400">Read →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SideProjects;
