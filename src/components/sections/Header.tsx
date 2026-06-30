import React from 'react';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { Basics } from '../../types/resume';

interface HeaderProps {
  basics: Basics;
}

const Header: React.FC<HeaderProps> = ({ basics }) => {
  const [typewriterText] = useTypewriter({
    words: basics.titles,
    loop: true,
    delaySpeed: 2000,
    typeSpeed: 70,
    deleteSpeed: 50
  });

  return (
    <>
      <div className="flex flex-col items-center mb-6">
        <a
          href={basics.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${basics.name}'s LinkedIn profile`}
          title="View LinkedIn profile"
          className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <img
            src={basics.avatarUrl}
            alt={basics.name}
            className="rounded-full h-24 w-24 object-cover ring-2 ring-gray-200 dark:ring-gray-700 cursor-pointer transition-transform duration-200 hover:scale-105 hover:ring-blue-500"
          />
        </a>

        <h1 className="text-center mb-0 text-4xl font-bold mt-3 dark:text-white">
          {basics.name}
        </h1>

        <div className="text-center text-gray-600 dark:text-gray-300 mt-1 h-6">
          <span>{typewriterText}</span>
          <Cursor />
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-3 flex-wrap text-sm">
          <a href={`mailto:${basics.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{basics.email}</a>
          <span className="text-gray-300 dark:text-gray-600" aria-hidden="true">|</span>
          <a href={`tel:${basics.phone}`} className="dark:text-gray-300 hover:underline">{basics.phone}</a>
          <span className="text-gray-300 dark:text-gray-600" aria-hidden="true">|</span>
          <a href={basics.linkedin} className="text-blue-600 dark:text-blue-400 hover:underline">{basics.linkedinDescription}</a>
        </div>
      </div>
    </>
  );
};

export default Header; 