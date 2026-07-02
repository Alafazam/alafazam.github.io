import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'; // Ensure Tailwind styles are imported

// Import components
import Header from './components/sections/Header';
import About from './components/sections/About';
import Expertise from './components/sections/Expertise';
import Frameworks from './components/sections/Frameworks';
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

// Import data utilities
import getResumeData from './utils/resumeData';

// Router base so the app works whether served from the production root ("/")
// or a staging subfolder ("/preview/"). Vite injects BASE_URL from `base`.
const routerBasename = import.meta.env.BASE_URL.replace(/\/+$/, '') || '/';

// Resume Page Component — getResumeData() is synchronous (imports JSON directly)
const ResumePage = () => {
  const resumeData = getResumeData();

  return (
    <div className="py-8 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      <div id="resume-content" className="mx-auto max-w-4xl">
        <Header basics={resumeData.basics} hero={resumeData.hero} />
        <AchievementNavigation />
        <About paragraphs={resumeData.about} stats={resumeData.aboutStats} />
        <Expertise items={resumeData.coreExpertise} />
        <Experience experiences={resumeData.experience} />
        <Frameworks frameworks={resumeData.frameworks} />
        <Education educations={resumeData.education} />
        <Certifications certifications={resumeData.certifications} />
        <Faq />
      </div>
    </div>
  );
};

function App() {
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
    <Router basename={routerBasename}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
        {/* Primary navigation — visible on all pages */}
        <SiteNav onDownload={handleDownload} />

        {/* Theme toggle — visible on all pages */}
        <button
          onClick={toggleTheme}
          className="fixed bottom-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 shadow-lg z-50"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        <Suspense fallback={<div className="py-20 text-center text-gray-500 dark:text-gray-400">Loading…</div>}>
          <Routes>
            <Route path="/" element={<ResumePage />} />
            <Route path="/projects" element={<SideProjects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/recruiter" element={<RecruiterPerspective />} />
            <Route path="/hiring-manager" element={<HiringManagerPerspective />} />
            <Route path="/interviewer" element={<InterviewerPerspective />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
