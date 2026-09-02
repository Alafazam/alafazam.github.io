import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'; // Ensure Tailwind styles are imported

// Import components
import Header from './components/sections/Header';
import About from './components/sections/About';
import Expertise from './components/sections/Expertise';
import AchievementNavigation from './components/sections/CoreAchievements';
import Experience from './components/sections/Experience';
import Education from './components/sections/Education';
import Certifications from './components/sections/Certifications';
import Faq from './components/sections/Faq';

// Import site chrome + pages
import SiteNav from './components/SiteNav';
import RecruiterPerspective from './pages/RecruiterPerspective';
import HiringManagerPerspective from './pages/HiringManagerPerspective';
import InterviewerPerspective from './pages/InterviewerPerspective';
import NotFound from './components/NotFound';

// Content pages are code-split so the Markdown renderer + syntax highlighter
// only load when visiting Blog/Projects — keeping the homepage bundle light.
const SideProjects = lazy(() => import('./pages/SideProjects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

// Standalone browser tool. Code-split so the amortisation engine and charts load
// only for visitors who actually open it.
const EmiCalculator = lazy(() => import('./pages/EmiCalculator'));

// Internal proctoring utility, reachable only by direct URL. Code-split so it
// costs the public pages nothing.
const CampusHiring = lazy(() => import('./pages/CampusHiring'));

// Import data utilities
import getResumeData from './utils/resumeData';

// Router base so the app works whether served from the production root ("/")
// or a staging subfolder ("/preview/"). Vite injects BASE_URL from `base`.
export const routerBasename = import.meta.env.BASE_URL.replace(/\/+$/, '') || '/';

// Resume Page Component — getResumeData() is synchronous (imports JSON directly)
const ResumePage = () => {
  const resumeData = getResumeData();

  return (
    <div className="py-8 px-4">
      <div id="resume-content" className="mx-auto max-w-4xl [&>section]:mb-10">
        <Header basics={resumeData.basics} hero={resumeData.hero} />
        <AchievementNavigation />
        <About paragraphs={resumeData.about} stats={resumeData.aboutStats} />
        <Expertise items={resumeData.coreExpertise} />
        <Experience experiences={resumeData.experience} />
        <Education educations={resumeData.education} />
        <Certifications certifications={resumeData.certifications} />
        <Faq />
      </div>
    </div>
  );
};

/**
 * Everything inside the router. Kept separate from <App> so the build-time
 * prerender (scripts/prerender.mjs) can render the same tree under a
 * StaticRouter — a BrowserRouter needs `window.history`, which Node has not.
 */
export function AppShell() {
  const getInitialTheme = (): boolean => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark'
        || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme);

  const toggleTheme = useCallback(() => setIsDarkMode(prev => !prev), []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleDownload = useCallback(() => {
    const { resumePdfUrl } = getResumeData().basics;
    const link = document.createElement('a');
    link.href = resumePdfUrl;
    link.download = 'Alaf_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Primary navigation — visible on all pages */}
      <SiteNav onDownload={handleDownload} />

      {/* Theme toggle — visible on all pages */}
      <button
        onClick={toggleTheme}
        className="no-print fixed bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full border border-border bg-background/80 backdrop-blur shadow-sm hover:bg-accent transition-colors z-50"
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading…</div>}>
        <Routes>
          <Route path="/" element={<ResumePage />} />
          <Route path="/projects" element={<SideProjects />} />
          {/* Static segments outrank dynamic ones in React Router, so this
              wins over /projects/:slug regardless of order — which matters,
              since ProjectDetail redirects unknown slugs back to /projects. */}
          <Route path="/projects/emi-calculator" element={<EmiCalculator />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/recruiter" element={<RecruiterPerspective />} />
          <Route path="/hiring-manager" element={<HiringManagerPerspective />} />
          <Route path="/interviewer" element={<InterviewerPerspective />} />

          {/* Internal utility. Not linked from SiteNav and not in the sitemap.
              React Router compiles path patterns with the `i` flag unless a
              route opts into `caseSensitive`, so /campushiring, /CampusHiring
              and any other casing already resolve here. A separate lowercase
              redirect route would rank identically and never be reached. */}
          <Route path="/campusHiring" element={<CampusHiring />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
