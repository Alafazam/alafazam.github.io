import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  const footerLinks = [
    { 
      path: '/', 
      label: 'Complete Resume', 
      icon: '📄' 
    },
    { 
      path: '/recruiter', 
      label: 'For Recruiters', 
      icon: '🎯' 
    },
    { 
      path: '/hiring-manager', 
      label: 'For Hiring Managers', 
      icon: '👨‍💼' 
    },
    { 
      path: '/interviewer', 
      label: 'For Interviewers', 
      icon: '🎤' 
    },
  ];

  return (
    <footer className="">
      <div className="container mx-auto max-w-6xl px-4 py-6">
        {/* Simple Navigation Links */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-2">
          {footerLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${isActive
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-600'
                  }
                `}
              >
                <span className="mr-2 text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Footer */}
        <div className="text-center border-t border-gray-200 dark:border-gray-600 pt-4">
          <p className="text-xs text-gray-600 dark:text-gray-400">
          Alaf Azam Khan | Senior Product Manager | Engineering Leader.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 