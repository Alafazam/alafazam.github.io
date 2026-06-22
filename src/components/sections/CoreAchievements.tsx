import React from 'react';
import { Compass, Sparkles, TrendingUp, Users, Network, GraduationCap, type LucideIcon } from 'lucide-react';

const AchievementNavigation: React.FC = () => {
  const categories: { label: string; id: string; Icon: LucideIcon }[] = [
    { label: "Organization Building", id: "organization-building", Icon: Users },
    { label: "Strategic Innovation", id: "strategic-innovation", Icon: Compass },
    { label: "AI Leadership", id: "ai-leadership", Icon: Sparkles },
    { label: "Revenue Generation", id: "revenue-generation", Icon: TrendingUp },
    { label: "Team Development", id: "team-development", Icon: GraduationCap },
    { label: "Process Optimization", id: "process-optimization", Icon: Network },
  ];

  const scrollToCategory = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight-achievement');
      setTimeout(() => element.classList.remove('highlight-achievement'), 2000);
    }
  };

  return (
    <div className="rounded-lg">
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => scrollToCategory(category.id)}
            className="px-3 py-1.5 text-sm font-medium rounded-full border border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 transform hover:scale-105 inline-flex items-center gap-1.5"
          >
            <category.Icon className="w-4 h-4" />
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AchievementNavigation;
