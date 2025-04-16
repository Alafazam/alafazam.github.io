/** @jsx React.createElement */
/** @jsxFrag React.Fragment */
import * as React from 'react';
import { useState, useEffect, ReactNode } from 'react';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './index.css'; // Ensure Tailwind styles are imported

// Helper function to check if device is mobile
const isMobile = () => window.innerWidth <= 768;

// Tech Tag Component for better visual representation of skills
const TechTag = ({ text }: { text: string }) => (
  <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs font-medium px-2 py-0.5 rounded-full mr-2 mb-1">
    {text}
  </span>
);

// Platform Icon component for certifications
const PlatformIcon = ({ platform }: { platform: string }) => {
  const edxIcon = (
    <img src="/assets/edx-logo-elm.svg" alt="edX" width="60" height="60" className="mr-2 inline-block align-middle" />
  );

  const mavenIcon = (
    <img src="/assets/maven-logo.svg" alt="Maven" width="80" height="80" className="mr-2 inline-block align-middle" />
  );

  return platform.toLowerCase().includes('edx') ? edxIcon : mavenIcon;
};

function App() {
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Dark mode state
  const getInitialTheme = (): boolean => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' 
        || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme);

  // Typewriter effect
  const [typewriterText] = useTypewriter({
    words: ['Senior Product Manager', 'Engineering Leader', 'AI + E-commerce', 'Product Leader @ Increff'],
    loop: true,
    delaySpeed: 2000,
    typeSpeed: 70,
    deleteSpeed: 50
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    // Initialize mobile check
    setIsMobileDevice(isMobile());

    // Update on resize
    const handleResize = () => {
      setIsMobileDevice(isMobile());
    };

    window.addEventListener('resize', handleResize);

    // Only initialize AOS on mobile
    if (isMobile()) {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        disable: window.innerWidth > 768 // Disable on desktop
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Helper function for conditional AOS attributes
  const getAosProps = (effect: string, delay: number = 0) => {
    if (!isMobileDevice) return {};
    return {
      'data-aos': effect,
      'data-aos-delay': delay
    };
  };

  // Simple direct PDF download handler
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/assets/Alaf Azam Khan _ Sr.PM Resume.pdf';
    link.download = 'Alaf Azam Khan _ Sr.PM Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-8 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition-colors duration-200">
      {/* Download Button - Smaller version with just icon */}
      <button
        onClick={handleDownload}
        className="fixed top-4 right-4 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800 shadow-md"
        aria-label="Download Resume as PDF"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      </button>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 shadow-lg z-50"
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      <div id="resume-content" className="container mx-auto max-w-4xl">
        {/* Avatar and Profile with conditional fade-up */}
        <div className="flex flex-col items-center mb-2">
          <div className="avatar-container" {...getAosProps('fade-down')}>
            <img src="/avatar.jpg" alt="Avatar" className="avatar-image rounded-full h-24 w-24 object-cover" />
          </div>
          
          <h1 className="text-center mb-0 text-3xl font-bold mt-3 dark:text-white" {...getAosProps('fade-down', 100)}>
            Alaf Azam Khan
          </h1>
          {/* Typewriter effect for tagline */}
          <div className="text-center text-gray-600 dark:text-gray-300 mt-1 h-6" {...getAosProps('fade-down', 200)}>
            <span>{typewriterText}</span>
            <Cursor />
          </div>
        </div>
          
        {/* Contact Information with improved LinkedIn display */}
        <div className="mb-4 text-center" {...getAosProps('fade-down', 300)}>
          <p>
            <a href="mailto:alafazam@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">alafazam@gmail.com</a> | 
            <a href="tel:+917987847247" className="px-1 dark:text-gray-300">+91 7987847247</a> | 
            <a href="https://www.linkedin.com/in/alafazam/" className="text-blue-600 dark:text-blue-400 hover:underline px-1">linkedin.com/in/alafazam | Sr. PM | AI | E-commerce</a>
          </p>
        </div>

        {/* Professional Summary */}
        <div className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed" {...getAosProps('fade-up', 400)}>
          <h2 className="text-xl font-bold mb-2 dark:text-white">Professional Summary</h2>
          <p className="mb-4">
            Technology leader with <strong>8+ years of experience</strong> scaling software and product solutions in <strong>fast-paced e-commerce environments</strong>. Skilled at driving <strong>AI-powered innovation</strong>, leading cross-functional teams, and delivering customer-centric products that align technical capabilities with business outcomes.
          </p>
        </div>
          
        {/* Core Achievements section */}
        <div className="mb-6 bg-[rgb(255,250,255)] dark:bg-blue-900/20 p-3 rounded-lg border-l-4 border-blue-500 relative z-0" {...getAosProps('fade-up', 200)}>
          <h2 className="text-xl font-bold mb-2 mt-4 dark:text-white">Core Achievements</h2>
          <ul className="space-y-1">
            <li className="flex items-start">
              <span className="text-blue-500 dark:text-blue-400 mr-2">🚀</span>
              <span><strong>Scaled fulfillment platform</strong> to handle 200M+ SKUs and process 8M+ orders monthly</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 dark:text-blue-400 mr-2">🤖</span>
              <span>Integrated <strong>AI solutions</strong> that cut time-to-market by 30% and boosted developer velocity</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 dark:text-blue-400 mr-2">💰</span>
              <span>Led product management and engineering organization delivering <strong>$12M+ in ARR</strong></span>
            </li>
          </ul>
        </div>
          
        {/* Section Divider */}
        <div className="section-divider border-t border-gray-200 dark:border-gray-700 my-6"></div>
          
        {/* Experience Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 dark:text-white" {...getAosProps('fade-up')}>Experience</h2>
            
          {/* Senior Technical Product Manager */}
          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700" {...getAosProps('fade-up', 100)}>
            <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
              <h3 className="font-semibold dark:text-white">Senior Technical Product Manager - Increff</h3>
              <p className="job-period text-gray-600 dark:text-gray-400">March 2022 — Present</p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Team: 25–30 | PMs Managed: 3 | Products: 5+ | Reported to: CEO
            </p>
              
            {/* Tech Stack with TechTag component */}
            <div className="mb-2 tech-tags-container">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Tech:</span>
              <TechTag text="Spring" />
              <TechTag text="Python" />
              <TechTag text="MySQL" />
              <TechTag text="GCP" />
              <TechTag text="Kubernetes" />
              <TechTag text="Angular" />
            </div>
              
            {/* Product Tools with TechTag component */}
            <div className="mb-3 tech-tags-container">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Product Tools:</span>
              <TechTag text="Jira" />
              <TechTag text="Figma" />
              <TechTag text="Notion" />
              <TechTag text="Matomo" />
            </div>
              
            <ul className="list-disc pl-5 mb-4 dark:text-gray-300">           
              <li>Owned <strong>product vision and roadmap</strong> for all fulfillment products, powering e-commerce operations for <strong>100+ global clients</strong>.</li>
              <li>Drove <strong>$12M+ in ARR</strong> by delivering high-availability systems that supported 200M+ SKUs and processed 8M+ orders monthly.</li>
              <li>Launched <strong>AI-driven product initiatives</strong> that cut time-to-market by 30% and boosted dev velocity through rapid prototyping.</li>
              <li>Modernized product suite with <strong>event-driven architecture</strong>, enhancing scalability and enabling modular growth.</li>
              <li>Spearheaded <strong>full-stack transition</strong> across engineering and PM teams, reducing feature delivery time by 40%.</li>
              <li>Led <strong>cost optimization strategy</strong> across infrastructure, achieving 30% reduction in cloud spend.</li>
              <li>Built and scaled a <strong>high-performing PM team</strong>, improving onboarding efficiency by 40% through coaching and hiring standards.</li>
              <li>Led <strong>100+ technical interviews</strong> across SDE1–SDE2 roles; standardized hiring processes for quality and speed.</li>
            </ul>
          </div>
            
          {/* SDE-3 */}
          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700" {...getAosProps('fade-up', 200)}>
            <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
              <h3 className="font-semibold dark:text-white">Software Development Engineer 3 / Acting Technical Product Manager - Increff</h3>
              <p className="job-period text-gray-600 dark:text-gray-400">June 2021 — March 2022</p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Team: 15–20 | Reported to: CTO
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Environment: E-commerce platform scaling across OMS, WMS, and backend services
            </p>
              
            {/* Tech Stack with TechTag component */}
            <div className="mb-3">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Tech:</span>
              <TechTag text="Spring" />
              <TechTag text="Python" />
              <TechTag text="MySQL" />
              <TechTag text="GCP" />
              <TechTag text="ELK" />
            </div>
              
            <ul className="list-disc pl-5 mb-4 dark:text-gray-300">
              <li><strong>Transitioned</strong> from engineering to product leadership, owning backend roadmap and cross-functional execution for Omni Suite, enabling seamless multichannel operations for <strong>key enterprise clients</strong></li>
              <li><strong>Defined</strong> and delivered complex features like Order Splitting and Expiry Workflows, increasing inventory exposure by <strong>40%</strong> and streamlining fulfillment</li>
              <li><strong>Led</strong> solution design for all new enterprise clients, collaborating directly with customer teams to understand pain points and deliver tailored product configurations</li>
              <li><strong>Conducted</strong> discovery interviews and worked closely with key accounts to define product gaps, influencing roadmap prioritization and reducing onboarding friction by <strong>30%</strong></li>
              <li><strong>Revamped</strong> SDLC and introduced Agile ceremonies, increasing sprint predictability and reducing feature cycle time by <strong>~25%</strong></li>
              <li><strong>Facilitated</strong> team alignment as Scrum Master, ensuring timely releases and improved collaboration across engineering, QA, and product stakeholders</li>
            </ul>
          </div>
            
          {/* SDE-2 */}
          <details open className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 group" {...getAosProps('fade-up', 300)}>
            <summary className="cursor-pointer flex flex-col sm:flex-row sm:justify-between mb-1">
              <h3 className="font-semibold dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Software Development Engineer 2 - Increff</h3>
              <p className="job-period text-gray-600 dark:text-gray-400">July 2019 — June 2021 • 2 years</p>
            </summary>
            <div className="mt-2 dark:text-gray-300">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Team Size: 5-10 | Managed: 3-5 | Reported to: CTO
              </p>
              <p className="text-sm mb-2 dark:text-gray-300">
                Led architecture design, coding efforts, and Backend team for the Warehouse Management System (WMS) Product.
              </p>
              <ul className="list-disc pl-5 mb-4 dark:text-gray-300">
                <li><strong>Spearheaded</strong> design and implementation of all WMS features</li>
                <li><strong>Guided</strong> 5-10 key clients from pre-sales to production launch</li>
                <li><strong>Established</strong> documentation and coding standards</li>
                <li><strong>Led</strong> campus recruitment at approximately 10 universities</li>
              </ul>
            </div>
          </details>
            
          {/* SDE-1 */}
          <details open className="mb-6 group" {...getAosProps('fade-up', 400)}>
            <summary className="cursor-pointer flex flex-col sm:flex-row sm:justify-between mb-1">
              <h3 className="font-semibold dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Software Development Engineer - Envestnet Yodlee</h3>
              <p className="job-period text-gray-600 dark:text-gray-400">July 2016 — September 2017</p>
            </summary>
            <div className="mt-2 dark:text-gray-300">
              <div className="mb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Tech Stack:</span>
                <TechTag text="Node.js" />
                <TechTag text="SQL" />
                <TechTag text="Express.js" />
                <TechTag text="Handlebar.js" />
                <TechTag text="Backbone.js" />
                <TechTag text="Java" />
                <TechTag text="Spring" />
                <TechTag text="Hibernate" />
              </div>
              <p className="text-sm mb-2 dark:text-gray-300">
                Part of sustaining engineering team in Yodlee. Fixed bugs in existing product (Personal Finance Manager) and developed an internal tool that tracks Bugzilla productivity using XML RPC API.
              </p>
            </div>
          </details>
        </section>
          
        {/* Education Section */}
        <section className="mb-8" {...getAosProps('fade-up', 100)}>
          <h2 className="text-xl font-bold mb-4 dark:text-white">Education</h2>
            
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
              <h3 className="font-semibold dark:text-white">National Institute of Technology Srinagar</h3>
              <p className="text-gray-600 dark:text-gray-400">Bachelors in Information Technology • 2012 — 2016</p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">GPA: 8.0/10</p>
          </div>
        </section>

        {/* Certifications Section */}
        <section>
          <h2 className="text-xl font-bold mb-4 dark:text-white" {...getAosProps('fade-up')}>Licenses & Certifications</h2>

          {/* Maven Certificates */}
          <div className="mb-8" {...getAosProps('fade-up', 100)}>
            <div className="ml-0 mb-4">
              <h3 className="font-semibold mb-1">
                <a href="https://maven.com/certificate/XqbJfSva" target="_blank" rel="noopener noreferrer" className="text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  <PlatformIcon platform="maven" />
                  Improving Your Product Sense
                </a>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Issued Sep 2024 • Credential ID: XqbJfSva</p>
            </div>

            <div className="ml-0 mb-4">
              <h3 className="font-semibold mb-1">
                <a href="https://maven.com/certificate/VbVjjhlx" target="_blank" rel="noopener noreferrer" className="text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  <PlatformIcon platform="maven" />
                  Managing your PM Career in 2025 and beyond
                </a>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Issued Jul 2024 • Credential ID: VbVjjhlx</p>
            </div>
          </div>

          {/* edX Supply Chain Specialization */}
          <div className="mb-6" {...getAosProps('fade-up', 200)}>
            <h3 className="font-semibold mb-3 flex items-center dark:text-white">
              <PlatformIcon platform="edx" />
              edX Supply Chain Specialization
            </h3>
              
            <div className="ml-6 mb-4">
              <h4 className="font-semibold mb-1">
                <a href="https://courses.edx.org/certificates/2e1a26ab7c9c461db153d48acf5bc6db" target="_blank" rel="noopener noreferrer" className="text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Supply Chain Dynamics
                </a>
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Issued Dec 2021 • Credential ID: 2e1a26ab7c9c461db153d48acf5bc6db</p>
            </div>

            <div className="ml-6 mb-4 mt-2">
              <h4 className="font-semibold mb-1">
                <a href="https://courses.edx.org/certificates/ea7763df63b748769dd3f306f29eb4b0" target="_blank" rel="noopener noreferrer" className="text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Supply Chain Design
                </a>
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Issued Apr 2021 • Credential ID: ea7763df63b748769dd3f306f29eb4b0</p>
            </div>

            <div className="ml-6 mb-4 mt-2">
              <h4 className="font-semibold mb-1">
                <a href="https://courses.edx.org/certificates/0914c7fd78254817a8021a06c42790f2" target="_blank" rel="noopener noreferrer" className="text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Supply Chain Fundamentals
                </a>
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Issued Dec 2020 • Credential ID: 0914c7fd78254817a8021a06c42790f2</p>
            </div>

            <div className="ml-6 mt-2">
              <h4 className="font-semibold mb-1">
                <a href="https://courses.edx.org/certificates/6d9c3e4cb61c41f380946ab383c9c416" target="_blank" rel="noopener noreferrer" className="text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Supply Chain Technology and Systems
                </a>
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Issued Mar 2021 • Credential ID: 6d9c3e4cb61c41f380946ab383c9c416</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
