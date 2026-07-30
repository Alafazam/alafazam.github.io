import React from 'react';
import { Link } from 'react-router-dom';
import { Basics, Hero } from '../../types/resume';

interface HeaderProps {
  basics: Basics;
  hero: Hero;
}

const Header: React.FC<HeaderProps> = ({ basics, hero }) => {
  return (
    <header className="flex flex-col items-center text-center mb-10">
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

      <h1 className="mt-4 text-3xl sm:text-4xl font-bold dark:text-white">{basics.name}</h1>
      <p className="mt-1 text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {hero.eyebrow}
      </p>

      <h2 className="mt-6 max-w-2xl text-2xl sm:text-3xl font-bold leading-snug dark:text-white">
        {hero.headline}
      </h2>
      <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
        {hero.subhead}
      </p>

      {/* Audience-segmented CTAs */}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/projects"
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          See my work
        </Link>
        <Link
          to="/blog"
          className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Read my thinking
        </Link>
        <a
          href={basics.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Let's talk
        </a>
      </div>

      {/* Contact line */}
      <div className="mt-6 flex items-center justify-center gap-3 flex-wrap text-sm">
        <a href={`mailto:${basics.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{basics.email}</a>
        <span className="text-gray-300 dark:text-gray-600" aria-hidden="true">|</span>
        <a href={`tel:${basics.phone}`} className="dark:text-gray-300 hover:underline">{basics.phone}</a>
        <span className="text-gray-300 dark:text-gray-600" aria-hidden="true">|</span>
        <a href={basics.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">LinkedIn</a>
      </div>
    </header>
  );
};

export default Header;
