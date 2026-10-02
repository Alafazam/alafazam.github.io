import React from 'react';

interface AboutProps {
  paragraphs: string[];
  stats: string;
}

const About: React.FC<AboutProps> = ({ paragraphs, stats }) => {
  return (
    <section
      className="mb-6 text-muted-foreground leading-relaxed"
      aria-labelledby="about-heading"
    >
      <h2
        id="about-heading"
        className="text-lg font-semibold tracking-tight text-foreground mb-3"
      >
        About
      </h2>

      {paragraphs.map((paragraph, index) => (
        <p key={index} className="mb-3">
          {paragraph}
        </p>
      ))}

      <p className="mt-4 pt-3 border-t border-border text-sm font-medium text-muted-foreground">
        {stats}
      </p>
    </section>
  );
};

export default About;
