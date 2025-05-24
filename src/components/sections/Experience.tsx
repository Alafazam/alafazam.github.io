import React, { useState } from 'react';
import { Experience as ExperienceType } from '../../types/resume';
import Modal from '../Modal';

interface ExperienceProps {
  experiences: ExperienceType[];
}

const Experience: React.FC<ExperienceProps> = ({ experiences }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="mb-6">
      <h2 className="text-xl text-gray-700 dark:text-gray-300 mb-3">Experience</h2>
      
      {experiences.map((experience, index) => (
        <div 
          key={index} 
          className={`${index < experiences.length - 1 ? 'mb-4 pb-4 border-b border-gray-200 dark:border-gray-700' : 'mb-4'}`}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
            <div className="flex items-center gap-2">
              {index === 0 ? (
                <h3 
                  onClick={() => setIsModalOpen(true)}
                  className="font-semibold dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {experience.title} - {experience.company}
                </h3>
              ) : (
                <h3 className="font-semibold dark:text-white">
                  {experience.title} - {experience.company}
                </h3>
              )}
              {index === 0 && (
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400">{experience.period}</p>
          </div>

          {/* Content */}
          <div className="dark:text-gray-300">
            {experience.teamInfo && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {experience.teamInfo}
              </p>
            )}
            
            {experience.scope && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                <strong>Scope:</strong> {experience.scope}
              </p>
            )}
            
            {experience.description && (
              <p className="text-sm mb-1">{experience.description}</p>
            )}
            
            {/* Tech Stack & Product Tools Combined */}
            {((experience.techStack && experience.techStack.length > 0) || 
              (experience.productTools && experience.productTools.length > 0)) && (
              <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                {experience.techStack && experience.techStack.length > 0 && (
                  <div className="flex flex-wrap items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Tech:</span>
                    {experience.techStack.map((tech, techIndex) => (
                      <span 
                        key={techIndex} 
                        className="inline-block bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-xs font-medium px-2 py-0.5 rounded mr-2 mb-1"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                
                {experience.productTools && experience.productTools.length > 0 && (
                  <div className="flex flex-wrap items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Tools:</span>
                    {experience.productTools.map((tool, toolIndex) => (
                      <span 
                        key={toolIndex} 
                        className="inline-block bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-xs font-medium px-2 py-0.5 rounded mr-2 mb-1"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Achievements */}
            <ul className="list-none pl-0 space-y-2 mb-4 dark:text-gray-300">
              {experience.achievements.map((achievement, achievementIndex) => (
                <li key={achievementIndex} className="mb-2">
                  {experience.achievementCategories && experience.achievementCategories[achievementIndex] && (
                    <span className="inline-block bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-xs font-medium px-2 py-1 rounded mr-2 mb-1 border border-gray-200 dark:border-gray-700">
                      {experience.achievementCategories[achievementIndex]}
                    </span>
                  )}
                  <span dangerouslySetInnerHTML={{ __html: achievement }}></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {/* Modal - Only for first experience */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${experiences[0]?.title} - Detailed Achievements`}
      >
        {experiences[0]?.modalDetails && (
          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Role Overview</h3>
              <p dangerouslySetInnerHTML={{ __html: experiences[0].modalDetails.roleOverview }}></p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">💰 Revenue & Growth Impact</h3>
              <ul className="list-disc pl-5 space-y-2">
                {experiences[0].modalDetails.revenueAndGrowth.map((achievement, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: achievement }}></li>
                ))}
              </ul>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">💡 Product Innovation</h3>
              <ul className="list-disc pl-5 space-y-2">
                {experiences[0].modalDetails.productInnovation.map((achievement, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: achievement }}></li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">👥 Team Leadership</h3>
              <ul className="list-disc pl-5 space-y-2">
                {experiences[0].modalDetails.teamLeadership.map((achievement, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: achievement }}></li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">⚡ Process Optimization</h3>
              <ul className="list-disc pl-5 space-y-2">
                {experiences[0].modalDetails.processOptimization.map((achievement, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: achievement }}></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">🔧 Technical Execution</h3>
              <ul className="list-disc pl-5 space-y-2">
                {experiences[0].modalDetails.technicalExecution.map((achievement, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: achievement }}></li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default Experience; 