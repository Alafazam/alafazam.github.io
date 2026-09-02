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
import Badge from '../components/ui/Badge';

const iconMap: Record<string, LucideIcon> = {
  boxes: Boxes,
  bot: Bot,
  brain: Brain,
  calculator: Calculator,
  clock: Clock,
  play: PlayCircle,
  target: Target,
};

const statusVariants: Record<string, 'success' | 'warning'> = {
  Active: 'success',
  'In progress': 'warning',
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
    <Link to={to} className="card-interactive group relative flex flex-col p-5">
      <div className="flex items-start gap-3">
        <span className="shrink-0 grid place-items-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors">
              {name}
            </h3>
            {status && (
              <Badge variant={statusVariants[status] || 'secondary'} className="shrink-0">
                {status}
              </Badge>
            )}
          </div>
          {tagline && <p className="text-sm text-muted-foreground mt-0.5">{tagline}</p>}
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">{body}</p>

      {impact && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          {impact}
        </p>
      )}

      <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center gap-2">
        {tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
        <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
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
    <div className="py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Selected Work</h1>
          <p className="text-muted-foreground">
            Products and systems I've built, and the frameworks I've designed to build them well.
          </p>
        </header>

        <div className="space-y-12">
          {groups.map((group) => (
            <section key={group.category}>
              <div className="mb-5">
                <h2 className="text-lg font-semibold tracking-tight">{group.category}</h2>
                <p className="text-sm text-muted-foreground">{group.description}</p>
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
                <p className="text-sm text-muted-foreground">
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
