import React from 'react';
import { CoreAchievement } from '../../types/resume';

interface CoreAchievementsProps {
  achievements: CoreAchievement[];
}

const CoreAchievements: React.FC<CoreAchievementsProps> = ({ achievements }) => {
  return (
    <div className="mb-6 bg-[rgb(255,250,255)] dark:bg-blue-900/20 p-3 rounded-lg border-l-4 border-blue-500 relative z-0">
      <h2 className="text-xl font-bold mb-2 mt-4 dark:text-white">Core Achievements</h2>
      <ul className="space-y-1">
        {achievements.map((achievement, index) => (
          <li key={index} className="flex items-start">
            <span className="text-blue-500 dark:text-blue-400 mr-2">{achievement.icon}</span>
            <span>
              <strong>{achievement.title}:</strong> {achievement.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoreAchievements; 