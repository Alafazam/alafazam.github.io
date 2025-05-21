import React from 'react';
import { Education as EducationType } from '../../types/resume';

interface EducationProps {
  educations: EducationType[];
}

const Education: React.FC<EducationProps> = ({ educations }) => {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Education</h2>
      
      {educations.map((education, index) => (
        <div key={index} className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
            <h3 className="font-semibold dark:text-white">{education.institution}</h3>
            <p className="text-gray-600 dark:text-gray-400">{education.degree} • {education.period}</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">GPA: {education.gpa}</p>
        </div>
      ))}
    </section>
  );
};

export default Education; 