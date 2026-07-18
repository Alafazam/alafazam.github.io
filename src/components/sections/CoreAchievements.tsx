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
    <div className="no-print rounded-lg">
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => scrollToCategory(category.id)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
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
