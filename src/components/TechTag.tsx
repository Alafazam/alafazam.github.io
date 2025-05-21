import React from 'react';

interface TechTagProps {
  text: string;
}

const TechTag: React.FC<TechTagProps> = ({ text }) => (
  <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs font-medium px-2 py-0.5 rounded-full mr-2 mb-1">
    {text}
  </span>
);

export default TechTag; 