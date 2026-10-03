import React from 'react';
import { Certification as CertificationType } from '../../types/resume';
import PlatformIcon from '../PlatformIcon';

interface CertificationsProps {
  certifications: CertificationType[];
}

const Certifications: React.FC<CertificationsProps> = ({ certifications }) => {
  return (
    <section>
      <h2 className="text-lg font-semibold tracking-tight text-foreground mb-4">Licenses & Certifications</h2>

      {certifications.map((certification, index) => (
        <div key={index} className="mb-8">
          {certification.items ? (
            // Group of certifications
            <>
              <h3 className="font-semibold mb-3 flex items-center">
                <PlatformIcon platform={certification.platform} />
                {certification.group}
              </h3>
              
              {certification.items.map((item, itemIndex) => (
                <div key={itemIndex} className="ml-6 mb-4 mt-2">
                  <h4 className="font-semibold mb-1">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
                      {item.title}
                    </a>
                  </h4>
                  <p className="text-sm text-muted-foreground">Issued {item.issueDate} • Credential ID: {item.credentialId}</p>
                </div>
              ))}
            </>
          ) : (
            // Single certification
            <div className="ml-0 mb-4">
              <h3 className="font-semibold mb-1">
                {certification.url ? (
                  <a href={certification.url} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
                    <PlatformIcon platform={certification.platform} />
                    {certification.title}
                  </a>
                ) : (
                  <span className="text-foreground inline-flex items-center">
                    <PlatformIcon platform={certification.platform} />
                    {certification.title}
                  </span>
                )}
              </h3>
              {(certification.issueDate || certification.credentialId) && (
                <p className="text-sm text-muted-foreground">
                  {certification.issueDate && <>Issued {certification.issueDate}</>}
                  {certification.credentialId && <> • Credential ID: {certification.credentialId}</>}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default Certifications; 