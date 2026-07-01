import { Link, useLocation } from 'react-router-dom';

interface SiteNavProps {
  onDownload: () => void;
}

const links = [
  { path: '/', label: 'Home' },
  { path: '/projects', label: 'Side Projects' },
  { path: '/blog', label: 'Blog' },
];

const SiteNav = ({ onDownload }: SiteNavProps) => {
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-end sm:justify-between h-14">
          <Link
            to="/"
            className="hidden sm:block font-bold text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
          >
            Alaf Azam Khan
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            {links.map(({ path, label }) => {
              const isActive = pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            <button
              onClick={onDownload}
              aria-label="Download résumé (PDF)"
              title="Download résumé (PDF)"
              className="ml-1 p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SiteNav;
