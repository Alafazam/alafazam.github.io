import React from 'react';

interface SummaryProps {
  summary: string;
}

const Summary: React.FC<SummaryProps> = ({ summary }) => {
  return (
    <div className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
      <h2 className="text-xl text-gray-700 dark:text-gray-300 mb-2 mt-2">Professional Summary</h2>
      <p className="mb-4" dangerouslySetInnerHTML={{ __html: summary }}></p>
    </div>
  );
};

export default Summary; 