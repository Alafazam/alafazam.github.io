// NOTE: Draft copy — descriptions/status/links to be confirmed by Alaf.
interface Project {
  name: string;
  tagline: string;
  description: string;
  status: 'Active' | 'In progress';
  tags: string[];
  link?: { label: string; url: string };
}

const projects: Project[] = [
  {
    name: 'KidQueue',
    tagline: 'Parent-controlled video curation',
    description:
      "A parent-first app that replaces algorithmic autoplay with an intentional, hand-picked library — parents choose exactly what their kids can watch and queue it up, safety by design rather than by moderation.",
    status: 'In progress',
    tags: ['Consumer', 'Product design', 'Safety-first'],
  },
  {
    name: 'GAN Thinking Mode',
    tagline: 'Adversarial reasoning framework',
    description:
      "A reasoning framework I built in Notion that stress-tests every idea before it ships: a 'generator' proposes, a 'discriminator' attacks, and only ideas that survive the adversarial loop move forward — surfacing weak assumptions early.",
    status: 'Active',
    tags: ['Methodology', 'Product thinking', 'Notion'],
  },
];

const statusStyles: Record<Project['status'], string> = {
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
          {projects.map((project) => (
            <article
              key={project.name}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6 flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 mb-1">
                <h2 className="text-xl font-semibold">{project.name}</h2>
                <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${statusStyles[project.status]}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
                {project.tagline}
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {project.description}
              </p>

              <div className="mt-auto flex flex-wrap items-center gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
                {project.link && (
                  <a
                    href={project.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {project.link.label} →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideProjects;
