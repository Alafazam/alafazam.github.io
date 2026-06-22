import React from 'react';

interface ExpertiseProps {
  items?: string[];
}

const Expertise: React.FC<ExpertiseProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-5">
      <h2 className="text-xl text-gray-700 dark:text-gray-300 mb-2">Core Expertise</h2>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={index}
            className="inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-800 text-sm font-medium px-3 py-1 rounded-full"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Expertise;
