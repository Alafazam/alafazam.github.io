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
        className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      >
        <img
          src={basics.avatarUrl}
          alt={basics.name}
          className="rounded-full h-24 w-24 object-cover ring-2 ring-border cursor-pointer transition-transform duration-200 hover:scale-105 hover:ring-primary"
        />
      </a>

      <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">{basics.name}</h1>
      <p className="mt-1 text-xs sm:text-sm font-medium uppercase tracking-wider text-muted-foreground">
        {hero.eyebrow}
      </p>

      <h2 className="mt-6 max-w-2xl text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
        {hero.headline}
      </h2>
      <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
        {hero.subhead}
      </p>

      {/* Audience-segmented CTAs */}
      <div className="no-print mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link to="/projects" className="btn-primary">
          See my work
        </Link>
        <Link to="/blog" className="btn-outline">
          Read my thinking
        </Link>
        <a
          href={basics.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          Let's talk
        </a>
      </div>

      {/* Contact line */}
      <div className="mt-6 flex items-center justify-center gap-3 flex-wrap text-sm">
        <a href={`mailto:${basics.email}`} className="text-primary hover:underline">{basics.email}</a>
        <span className="text-border" aria-hidden="true">·</span>
        <a href={`tel:${basics.phone}`} className="text-muted-foreground hover:text-foreground transition-colors">{basics.phone}</a>
        <span className="text-border" aria-hidden="true">·</span>
        <a href={basics.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn</a>
      </div>
    </header>
  );
};

export default Header;
