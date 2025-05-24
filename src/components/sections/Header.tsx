import React from 'react';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { Basics } from '../../types/resume';

interface HeaderProps {
  basics: Basics;
}

const Header: React.FC<HeaderProps> = ({ basics }) => {
  const [typewriterText] = useTypewriter({
    words: basics.titles,
    loop: true,
    delaySpeed: 2000,
    typeSpeed: 70,
    deleteSpeed: 50
  });

  return (
    <>
      <div className="flex flex-col items-center mb-2">
        <div className="avatar-container">
          <img src={basics.avatarUrl} alt="Avatar" className="avatar-image rounded-full h-24 w-24 object-cover" />
        </div>
        
        <h1 className="text-center mb-0 text-3xl font-bold mt-3 dark:text-white">
          {basics.name}
        </h1>
        
        <div className="text-center text-gray-600 dark:text-gray-300 mt-1 h-6">
          <span>{typewriterText}</span>
          <Cursor />
        </div>
      </div>
      
      <div className="text-center">
        <p>
          <a href={`mailto:${basics.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{basics.email}</a> | 
          <a href={`tel:${basics.phone}`} className="px-1 dark:text-gray-300">{basics.phone}</a> | 
          <a href={basics.linkedin} className="text-blue-600 dark:text-blue-400 hover:underline px-1">{basics.linkedinDescription}</a>
        </p>
      </div>
    </>
  );
};

export default Header; 