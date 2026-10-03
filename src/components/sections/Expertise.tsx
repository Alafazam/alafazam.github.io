import React from 'react';
import Badge from '../ui/Badge';

interface ExpertiseProps {
  items?: string[];
}

const Expertise: React.FC<ExpertiseProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-5">
      <h2 className="text-lg font-semibold tracking-tight text-foreground mb-3">Core Expertise</h2>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <Badge key={index} variant="secondary" className="px-2.5 py-1 text-sm font-normal">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default Expertise;
