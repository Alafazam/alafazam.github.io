import React from 'react';

interface SummaryProps {
  summary: string;
}

const Summary: React.FC<SummaryProps> = ({ summary }) => {
  return (
    <div className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
      <h2 className="text-xl font-bold mb-2 dark:text-white">Professional Summary</h2>
      <p className="mb-4" dangerouslySetInnerHTML={{ __html: summary }}></p>
    </div>
  );
};

export default Summary; 