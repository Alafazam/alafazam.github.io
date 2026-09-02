import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getProject } from '../utils/content';
import MarkdownContent from '../components/MarkdownContent';
import Badge from '../components/ui/Badge';

const statusVariants: Record<string, 'success' | 'warning'> = {
  Active: 'success',
  'In progress': 'warning',
};

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProject(slug) : undefined;

  if (!project) return <Navigate to="/projects" replace />;

  const { frontmatter, html } = project;
  const { name, tagline, status, tags, link, category, impact } = frontmatter;
  const title = name || frontmatter.title || project.slug;

  return (
    <div className="py-10 px-4">
      <div className="mx-auto max-w-3xl">
        <Helmet>
          <title>{title} — Alaf Azam Khan</title>
          {project.excerpt && <meta name="description" content={project.excerpt} />}
          <link rel="canonical" href={`https://alafazam.com/projects/${project.slug}`} />
        </Helmet>

        <Link to="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← All work
        </Link>

        {category && (
          <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {category}
          </p>
        )}
        <div className="flex items-start justify-between gap-3 mt-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
          {status && (
            <Badge variant={statusVariants[status] || 'secondary'} className="shrink-0 mt-2">
              {status}
            </Badge>
          )}
        </div>
        {tagline && <p className="text-lg text-muted-foreground mt-1">{tagline}</p>}
        {impact && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 text-sm font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            {impact}
          </p>
        )}

        {(tags && tags.length > 0) && (
          <div className="flex flex-wrap gap-2 mt-4 mb-8">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <MarkdownContent html={html} />

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-8"
          >
            Visit project →
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
