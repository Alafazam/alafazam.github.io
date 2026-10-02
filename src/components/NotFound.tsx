import { Link } from 'react-router-dom';
import Seo from './Seo';
import { staticRoute } from '../seo/routes';

// Rendered for unmatched routes. scripts/prerender.mjs renders this at /404, which
// GitHub Pages serves as 404.html for any deep link that isn't a prerendered route.
const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <Seo {...staticRoute('/404')} />
      <h1 className="text-5xl font-bold tracking-tight mb-3">404</h1>
      <p className="text-lg text-muted-foreground mb-6">
        This page doesn't exist.
      </p>
      <Link to="/" className="text-primary hover:underline">
        ← Back to home
      </Link>
    </div>
  );
};

export default NotFound;
