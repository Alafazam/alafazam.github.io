import React, { useState } from 'react';
import { TrendingUp, Lightbulb, Users, Gauge, Wrench } from 'lucide-react';
import { Experience as ExperienceType } from '../../types/resume';
import Modal from '../Modal';
import Badge from '../ui/Badge';

// Strip emojis/symbols and convert to kebab-case id
const toCategorySlug = (cat: string) =>
  cat.replace(/[^a-zA-Z0-9 ]/g, '').trim().toLowerCase().replace(/\s+/g, '-');

interface ExperienceProps {
  experiences: ExperienceType[];
}

const Experience: React.FC<ExperienceProps> = ({ experiences }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold tracking-tight text-foreground mb-3">Experience</h2>
      
      {experiences.map((experience, index) => (
        <div 
          key={index} 
          className={`${index < experiences.length - 1 ? 'mb-4 pb-4 border-b border-border' : 'mb-4'}`}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
            <div className="flex items-center gap-2">
              {index === 0 ? (
                <h3
                  role="button"
                  tabIndex={0}
                  onClick={() => setIsModalOpen(true)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsModalOpen(true)}
                  className="font-semibold hover:text-primary transition-colors cursor-pointer"
                >
                  {experience.title} - {experience.company}
                </h3>
              ) : (
                <h3 className="font-semibold">
                  {experience.title} - {experience.company}
                </h3>
              )}
              {index === 0 && (
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </div>
            <p className="text-sm text-muted-foreground tabular-nums">{experience.period}</p>
          </div>

          {/* Content */}
          <div>
            {experience.teamInfo && (
              <p className="text-sm text-muted-foreground mb-1">
                {experience.teamInfo}
              </p>
            )}
            
            {experience.scope && (
              <p className="text-sm text-muted-foreground mb-1">
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
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground mr-2">Tech</span>
                    {experience.techStack.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="mr-2 mb-1">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {experience.productTools && experience.productTools.length > 0 && (
                  <div className="flex flex-wrap items-center">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground mr-2">Tools</span>
                    {experience.productTools.map((tool, toolIndex) => (
                      <Badge key={toolIndex} variant="secondary" className="mr-2 mb-1">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Achievements */}
            {(() => {
              const seenSlugs = new Set<string>();
              return (
                <ul className="list-none pl-0 space-y-2 mb-4">
                  {experience.achievements.map((achievement, achievementIndex) => {
                    const cat = experience.achievementCategories?.[achievementIndex];
                    const slug = cat ? toCategorySlug(cat) : undefined;
                    const isFirst = slug ? !seenSlugs.has(slug) : false;
                    if (slug && isFirst) seenSlugs.add(slug);
                    return (
                      <li key={achievementIndex} id={isFirst ? slug : undefined} className="mb-2 flex">
                        <span className="mr-2 text-muted-foreground/60">•</span>
                        <span dangerouslySetInnerHTML={{ __html: achievement }}></span>
                      </li>
                    );
                  })}
                </ul>
              );
            })()}
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
          <div className="space-y-6 text-muted-foreground">
            <div className="mb-4">
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2">Role Overview</h3>
              <p dangerouslySetInnerHTML={{ __html: experiences[0].modalDetails.roleOverview }}></p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" />Revenue &amp; Growth Impact</h3>
              <ul className="list-disc pl-5 space-y-2">
                {experiences[0].modalDetails.revenueAndGrowth.map((achievement, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: achievement }}></li>
                ))}
              </ul>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-primary" />Product Innovation</h3>
              <ul className="list-disc pl-5 space-y-2">
                {experiences[0].modalDetails.productInnovation.map((achievement, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: achievement }}></li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2 flex items-center gap-2"><Users className="w-5 h-5 text-primary" />Team Leadership</h3>
              <ul className="list-disc pl-5 space-y-2">
                {experiences[0].modalDetails.teamLeadership.map((achievement, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: achievement }}></li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2 flex items-center gap-2"><Gauge className="w-5 h-5 text-primary" />Process Optimization</h3>
              <ul className="list-disc pl-5 space-y-2">
                {experiences[0].modalDetails.processOptimization.map((achievement, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: achievement }}></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2 flex items-center gap-2"><Wrench className="w-5 h-5 text-primary" />Technical Execution</h3>
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