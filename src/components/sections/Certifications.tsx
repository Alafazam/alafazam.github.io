import React from 'react';
import { Certification as CertificationType } from '../../types/resume';
import PlatformIcon from '../PlatformIcon';

interface CertificationsProps {
  certifications: CertificationType[];
}

const Certifications: React.FC<CertificationsProps> = ({ certifications }) => {
  return (
    <section>
      <h2 className="text-xl font-bold mb-4 dark:text-white">Licenses & Certifications</h2>

      {certifications.map((certification, index) => (
        <div key={index} className="mb-8">
          {certification.items ? (
            // Group of certifications
            <>
              <h3 className="font-semibold mb-3 flex items-center dark:text-white">
                <PlatformIcon platform={certification.platform} />
                {certification.group}
              </h3>
              
              {certification.items.map((item, itemIndex) => (
                <div key={itemIndex} className="ml-6 mb-4 mt-2">
                  <h4 className="font-semibold mb-1">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                      {item.title}
                    </a>
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Issued {item.issueDate} • Credential ID: {item.credentialId}</p>
                </div>
              ))}
            </>
          ) : (
            // Single certification
            <div className="ml-0 mb-4">
              <h3 className="font-semibold mb-1">
                <a href={certification.url} target="_blank" rel="noopener noreferrer" className="text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  <PlatformIcon platform={certification.platform} />
                  {certification.title}
                </a>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Issued {certification.issueDate} • Credential ID: {certification.credentialId}</p>
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default Certifications; 