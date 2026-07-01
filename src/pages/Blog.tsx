// Stub blog index. The full blog engine (post rendering, RSS, Article schema)
// arrives in Phase 3; for now this is a navigable "coming soon" with the
// planned inaugural topics.
const upcoming = [
  'Adversarial Product Thinking: how I stress-test every idea before building it',
  'Why I manage engineers AND write product specs: the case for the dual-track director',
  '9 years inside a startup: what growing from 20 to 250 people actually teaches you',
  "What 'AI-native product development' actually means in practice (not a buzzword)",
  "The merchandising intelligence gap: why retail tech's planning stack is still broken",
];

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

        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-6">
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
            Coming soon
          </p>
          <ul className="space-y-3">
            {upcoming.map((title) => (
              <li key={title} className="flex gap-3 text-gray-700 dark:text-gray-300">
                <span aria-hidden="true" className="text-blue-500">•</span>
                <span>{title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Blog;
