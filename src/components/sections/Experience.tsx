import React, { useState } from 'react';
import { Experience as ExperienceType } from '../../types/resume';
import Modal from '../Modal';
import TechTag from '../TechTag';

interface ExperienceProps {
  experiences: ExperienceType[];
}

const Experience: React.FC<ExperienceProps> = ({ experiences }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceType | null>(null);

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Experience</h2>
      
      {experiences.map((experience, index) => (
        <div key={index} className={`${index < experiences.length - 1 ? 'mb-6 pb-6 border-b border-gray-200 dark:border-gray-700' : 'mb-6'}`}>
          {experience.isCollapsible ? (
            <details open className="group">
              <summary className="cursor-pointer flex flex-col sm:flex-row sm:justify-between mb-1">
                <h3 className="font-semibold dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {experience.title} - {experience.company}
                </h3>
                <p className="job-period text-gray-600 dark:text-gray-400">{experience.period}</p>
              </summary>
              <ExperienceContent experience={experience} />
            </details>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold dark:text-white">
                    {experience.title} - {experience.company}
                  </h3>
                  {experience.modalDetails && (
                    <button
                      onClick={() => {
                        setSelectedRole(experience.title);
                        setSelectedExperience(experience);
                        setIsModalOpen(true);
                      }}
                      className="inline-flex items-center justify-center p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors"
                      aria-label="View more details"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  )}
                </div>
                <p className="job-period text-gray-600 dark:text-gray-400">{experience.period}</p>
              </div>
              <ExperienceContent experience={experience} />
            </>
          )}
        </div>
      ))}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRole || ''}
      >
        {selectedExperience?.modalDetails && (
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Role Overview</h3>
              <p>{selectedExperience.modalDetails.roleOverview}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Key Achievements</h3>
              <ul className="list-disc pl-5 space-y-2">
                {selectedExperience.modalDetails.keyAchievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Technical Leadership</h3>
              <ul className="list-disc pl-5 space-y-2">
                {selectedExperience.modalDetails.technicalLeadership.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Team & Scope</h3>
              <ul className="list-disc pl-5 space-y-2">
                {selectedExperience.modalDetails.teamScope.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

// Sub-component for rendering experience content
const ExperienceContent: React.FC<{ experience: ExperienceType }> = ({ experience }) => {
  return (
    <div className="mt-2 dark:text-gray-300">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        {experience.teamInfo}
      </p>
      
      {experience.scope && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          <strong>Scope:</strong> {experience.scope}
        </p>
      )}
      
      {experience.environment && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {experience.environment}
        </p>
      )}
      
      {experience.description && (
        <p className="text-sm mb-2 dark:text-gray-300">
          {experience.description}
        </p>
      )}
      
      {experience.techStack && (
        <div className="mb-2 tech-tags-container">
          <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Tech:</span>
          {experience.techStack.map((tech, index) => (
            <TechTag key={index} text={tech} />
          ))}
        </div>
      )}
      
      {experience.productTools && (
        <div className="mb-3 tech-tags-container">
          <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Product Tools:</span>
          {experience.productTools.map((tool, index) => (
            <TechTag key={index} text={tool} />
          ))}
        </div>
      )}
      
      <ul className="list-disc pl-5 mb-4 dark:text-gray-300">
        {experience.achievements.map((achievement, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: achievement }}></li>
        ))}
      </ul>
    </div>
  );
};

export default Experience; 