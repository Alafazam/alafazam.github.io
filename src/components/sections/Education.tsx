import React from 'react';
import { Education as EducationType } from '../../types/resume';

interface EducationProps {
  educations: EducationType[];
}

const Education: React.FC<EducationProps> = ({ educations }) => {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold tracking-tight text-foreground mb-4">Education</h2>

      {educations.map((education, index) => (
        <div key={index} className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
            <h3 className="font-semibold">{education.institution}</h3>
            <p className="text-sm text-muted-foreground">{education.degree} • {education.period}</p>
          </div>
          <p className="text-sm text-muted-foreground">GPA: {education.gpa}</p>
        </div>
      ))}
    </section>
  );
};

export default Education; 