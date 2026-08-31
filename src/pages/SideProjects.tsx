import { Link } from 'react-router-dom';
import {
  Boxes,
  Bot,
  Brain,
  Calculator,
  Clock,
  PlayCircle,
  Target,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { TOOLS, projectsByCategory } from '../utils/content';

const iconMap: Record<string, LucideIcon> = {
  boxes: Boxes,
  bot: Bot,
  brain: Brain,
  calculator: Calculator,
  clock: Clock,
  play: PlayCircle,
  target: Target,
};

const statusStyles: Record<string, string> = {
  Active: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  'In progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
};

interface CardProps {
  to: string;
  icon: string;
  name: string;
  tagline?: string;
  status?: string;
  body: string;
  impact?: string;
  tags: string[];
  /** "Read" for a write-up, "Open" for something you can actually use. */
  cta: string;
}

const Card = ({ to, icon, name, tagline, status, body, impact, tags, cta }: CardProps) => {
  const Icon = iconMap[icon] || Boxes;
  return (
    <Link
      to={to}
      className="group relative flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-5 transition-all hover:-translate-y-0.5 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <span className="shrink-0 grid place-items-center h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {name}
            </h3>
            {status && (
              <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                {status}
              </span>
            )}
          </div>
          {tagline && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{tagline}</p>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
        {body}
      </p>

      {impact && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-300">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" aria-hidden="true" />
          {impact}
        </p>
      )}

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-2">
        {tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
          >
            {tag}
          </span>
        ))}
        <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400">
          {cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
};

const SideProjects = () => {
  const groups = projectsByCategory();

  return (
    <div className="py-12 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Selected Work</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Products and systems I've built, and the frameworks I've designed to build them well.
          </p>
        </header>

        <div className="space-y-12">
          {groups.map((group) => (
            <section key={group.category}>
              <div className="mb-5">
                <h2 className="text-lg font-semibold tracking-tight">{group.category}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{group.description}</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {group.items.map((project) => {
                  const { name, tagline, status, tags, impact, icon } = project.frontmatter;
                  return (
                    <Card
                      key={project.slug}
                      to={`/projects/${project.slug}`}
                      icon={icon || ''}
                      name={name || project.slug}
                      tagline={tagline}
                      status={status}
                      body={project.excerpt}
                      impact={impact}
                      tags={tags || []}
                      cta="Read"
                    />
                  );
                })}
              </div>
            </section>
          ))}

          {TOOLS.length > 0 && (
            <section>
              <div className="mb-5">
                <h2 className="text-lg font-semibold tracking-tight">Tools</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Small things I built because I wanted to use them. They run entirely in your browser.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {TOOLS.map((tool) => (
                  <Card
                    key={tool.href}
                    to={tool.href}
                    icon={tool.icon}
                    name={tool.name}
                    tagline={tool.tagline}
                    body={tool.description}
                    tags={tool.tags}
                    cta="Open"
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideProjects;
