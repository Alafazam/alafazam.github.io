import React from 'react';
import { GraduationCap } from 'lucide-react';

interface PlatformIconProps {
  platform: string;
}

const PlatformIcon: React.FC<PlatformIconProps> = ({ platform }) => {
  const p = platform.toLowerCase();

  if (p.includes('edx')) {
    return <img src="/assets/edx-logo-elm.svg" alt="edX" width="60" height="60" className="mr-2 inline-block align-middle" />;
  }

  if (p.includes('maven')) {
    return <img src="/assets/maven-logo.svg" alt="Maven" width="80" height="80" className="mr-2 inline-block align-middle" />;
  }

  // Fallback for other learning platforms (Reforge, discovery courses, etc.)
  return <GraduationCap className="w-5 h-5 mr-2 inline-block align-middle text-blue-600 dark:text-blue-400" />;
};

export default PlatformIcon;
