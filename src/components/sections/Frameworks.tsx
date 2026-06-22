import React from 'react';
import { Clock, Target, Bot, Boxes, type LucideIcon } from 'lucide-react';

interface Framework {
  title: string;
  description: string;
  icon?: string;
}

interface FrameworksProps {
  frameworks?: Framework[];
}

const iconMap: Record<string, LucideIcon> = {
  clock: Clock,
  target: Target,
  bot: Bot,
  boxes: Boxes,
};

const Frameworks: React.FC<FrameworksProps> = ({ frameworks }) => {
  if (!frameworks || frameworks.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-xl text-gray-700 dark:text-gray-300 mb-3">Frameworks &amp; Systems I Built</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {frameworks.map((framework, index) => {
          const Icon = iconMap[framework.icon ?? ''] ?? Target;
          return (
            <div
              key={index}
              className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <h3 className="font-semibold text-sm dark:text-white">{framework.title}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{framework.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Frameworks;
