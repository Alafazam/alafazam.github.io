import { Link } from 'react-router-dom';
import Seo from './Seo';
import { staticRoute } from '../seo/routes';

// Rendered for unmatched routes. scripts/prerender.mjs renders this at /404, which
// GitHub Pages serves as 404.html for any deep link that isn't a prerendered route.
const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Seo {...staticRoute('/404')} />
      <h1 className="text-5xl font-bold mb-3">404</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
        This page doesn't exist.
      </p>
      <Link
        to="/"
        className="text-blue-600 dark:text-blue-400 hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
};

export default NotFound;
