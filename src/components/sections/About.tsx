import React from 'react';

interface AboutProps {
  paragraphs: string[];
  stats: string;
}

const About: React.FC<AboutProps> = ({ paragraphs, stats }) => {
  return (
    <section
      className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed"
      aria-labelledby="about-heading"
    >
      <h2
        id="about-heading"
        className="text-xl text-gray-700 dark:text-gray-300 mb-2 mt-2"
      >
        About
      </h2>

      {paragraphs.map((paragraph, index) => (
        <p key={index} className="mb-3">
          {paragraph}
        </p>
      ))}

      <p className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400">
        {stats}
      </p>
    </section>
  );
};

export default About;
