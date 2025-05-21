/** @jsx React.createElement */
/** @jsxFrag React.Fragment */
import * as React from 'react';
import { useState, useEffect } from 'react';
import './index.css'; // Ensure Tailwind styles are imported

// Import components
import Header from './components/sections/Header';
import Summary from './components/sections/Summary';
import CoreAchievements from './components/sections/CoreAchievements';
import Experience from './components/sections/Experience';
import Education from './components/sections/Education';
import Certifications from './components/sections/Certifications';

// Import data utilities
import getResumeData from './utils/resumeData';

function App() {
  const resumeData = getResumeData();
  
  // Dark mode state
  const getInitialTheme = (): boolean => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' 
        || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    // Update HTML class for dark mode
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Simple direct PDF download handler
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resumeData.basics.resumePdfUrl;
    link.download = 'Alaf Azam Khan _ Sr.PM Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-8 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition-colors duration-200">
      {/* Download Button - Smaller version with just icon */}
      <button
        onClick={handleDownload}
        className="fixed top-4 right-4 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800 shadow-md"
        aria-label="Download Resume as PDF"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      </button>

      {/* Theme Toggle */}
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

      <div id="resume-content" className="container mx-auto max-w-4xl">
        {/* Header Section */}
        <Header basics={resumeData.basics} />
          
        {/* Professional Summary */}
        <Summary summary={resumeData.summary} />
          
        {/* Core Achievements section */}
        <CoreAchievements achievements={resumeData.coreAchievements} />
          
        {/* Section Divider */}
        <div className="section-divider border-t border-gray-200 dark:border-gray-700 my-6"></div>
          
        {/* Experience Section */}
        <Experience experiences={resumeData.experience} />
          
        {/* Education Section */}
        <Education educations={resumeData.education} />

        {/* Certifications Section */}
        <Certifications certifications={resumeData.certifications} />
      </div>
    </div>
  );
}

export default App;
