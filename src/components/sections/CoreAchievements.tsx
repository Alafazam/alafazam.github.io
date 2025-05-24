import React from 'react';

interface AchievementNavigationProps {
  // We don't need the old CoreAchievement interface anymore
  // This component will show category navigation buttons
}

const AchievementNavigation: React.FC<AchievementNavigationProps> = () => {
  const categories = [
    { label: "Vision & Strategy", id: "strategic-vision" },
    { label: "AI Innovation", id: "ai-innovation" },
    { label: "Commercial Sense", id: "commercial-sense" },
    { label: "Organization Building", id: "organization-building" },
    { label: "Architecture", id: "technical-architecture" },
    { label: "Mentorship", id: "mentorship" },
  ];

  const scrollToCategory = () => {
    const element = document.getElementById("senior-pm-achievements");
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Add a brief highlight effect to the whole section
      element.classList.add('highlight-achievement');
      setTimeout(() => {
        element.classList.remove('highlight-achievement');
      }, 2000);
    }
  };

  return (
    <div className="rounded-lg">
      <div className="flex flex-wrap gap-2 justify-center ">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => scrollToCategory()}
            className="px-3 py-1.5 text-sm font-medium rounded-full border border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 transform hover:scale-105"
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AchievementNavigation; 