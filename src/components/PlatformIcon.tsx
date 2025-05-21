import React from 'react';

interface PlatformIconProps {
  platform: string;
}

const PlatformIcon: React.FC<PlatformIconProps> = ({ platform }) => {
  const edxIcon = (
    <img src="/assets/edx-logo-elm.svg" alt="edX" width="60" height="60" className="mr-2 inline-block align-middle" />
  );

  const mavenIcon = (
    <img src="/assets/maven-logo.svg" alt="Maven" width="80" height="80" className="mr-2 inline-block align-middle" />
  );

  return platform.toLowerCase().includes('edx') ? edxIcon : mavenIcon;
};

export default PlatformIcon; 