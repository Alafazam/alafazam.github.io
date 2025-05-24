import { useState } from 'react';

interface Question {
  id: string;
  category: string;
  question: string;
  answer: string;
  keyPoints: string[];
}

const InterviewerPerspective = () => {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const questions: Question[] = [
    {
      id: "technical-depth",
      category: "Technical Depth",
      question: "Walk me through the WMS2 architecture decision and how you convinced stakeholders",
      answer: "WMS2 represented a fundamental shift from serialized to non-serialized warehouse operations. The key challenge was that our existing WMS required strict sequential workflows, limiting our ability to serve clients with more dynamic warehouse operations.\n\nI led the strategic pivot by first conducting deep discovery with clients who had rejected our serialized approach. I identified that non-serialized workflows could unlock a $2M+ TAM expansion, particularly for US market entry.\n\nTo convince stakeholders, I created a working prototype using Cursor and AI tools, reducing the typical design-to-demo cycle from months to weeks. This prototype demonstrated the technical feasibility and business impact.\n\nThe architecture uses event-driven microservices that can handle parallel warehouse operations while maintaining data consistency through eventual consistency patterns. I worked closely with the engineering team to design the state management system that could track inventory across multiple concurrent workflows.",
      keyPoints: [
        "Market research identified $2M+ TAM expansion opportunity",
        "Used AI tools to rapidly prototype and validate concept",
        "Event-driven architecture for parallel workflow handling",
        "Stakeholder buy-in through working demo, not just presentations"
      ]
    },
    {
      id: "technical-implementation",
      category: "Technical Leadership",
      question: "Explain the Kubernetes scaling solution - what were the technical trade-offs?",
      answer: "The Kubernetes modernization was critical as we were hitting scaling bottlenecks at 8M+ monthly orders. Our legacy monolithic deployment couldn't handle traffic spikes during peak seasons.\n\nI led the architectural design for a microservices-based deployment using Kubernetes auto-scaling. Key technical decisions:\n\n1. **Service Decomposition**: We broke the monolith into 12 core microservices (inventory, orders, integrations, etc.) based on business domain boundaries\n\n2. **Auto-scaling Strategy**: Implemented HPA (Horizontal Pod Autoscaler) based on CPU and custom metrics like order queue depth\n\n3. **Trade-offs Made**:\n   - Increased operational complexity but gained independent scaling\n   - Higher initial latency due to service calls but better overall throughput\n   - More complex debugging but improved fault isolation\n\nThe result: we can now handle 3x order volume with the same infrastructure cost, and zero-downtime deployments became standard.",
      keyPoints: [
        "Decomposed monolith into 12 domain-driven microservices",
        "Custom metrics-based auto-scaling (queue depth, not just CPU)",
        "Conscious trade-offs: complexity vs scalability",
        "3x capacity improvement with same infrastructure cost"
      ]
    },
    {
      id: "hands-on",
      category: "Technical Leadership",
      question: "How did you personally deliver 45+ story points while managing a team?",
      answer: "This happened during a critical period when we were implementing Al-Abdul Karim (our most complex client onboarding) while facing significant team attrition. We had committed to a Q4 revenue target, and delays would have cost us ₹10L+ monthly revenue.\n\nI made the strategic decision to personally take on development work in three areas:\n\n1. **Critical WMS modules**: Vendor management workflows that were blocking the onboarding\n2. **Integration toolkits**: Custom APIs for their ERP system\n3. **Performance optimizations**: Database query improvements for their 50M+ SKU catalog\n\nI maintained team leadership by:\n- Conducting daily standups early morning before coding\n- Using asynchronous communication for code reviews\n- Delegating team coordination to my senior PM\n\nThis taught me that technical credibility isn't just about past experience - it's about being willing to solve critical problems directly when the team needs it most.",
      keyPoints: [
        "Strategic decision during team attrition crisis",
        "₹10L+ monthly revenue at stake",
        "Balanced hands-on coding with team leadership",
        "Delivered vendor management, integrations, and performance optimizations"
      ]
    },
    {
      id: "leadership-style",
      category: "Leadership Style",
      question: "How did you transition from engineer to establishing the entire PM function?",
      answer: "The transition happened organically as Increff grew from a 15-person engineering team to a 100+ client business. I realized that pure engineering execution wasn't enough - we needed product strategy and stakeholder alignment.\n\nKey steps in establishing the PM function:\n\n1. **Process Creation**: I started by formalizing our ad-hoc prioritization into structured frameworks involving sales, success, and engineering inputs\n\n2. **Cross-functional Integration**: Created regular touchpoints between teams - weekly prioritization meetings, monthly roadmap reviews, quarterly planning cycles\n\n3. **Hiring & Development**: Hired 3 Associate PMs and spent significant time mentoring them through real client scenarios\n\n4. **Metrics & Accountability**: Established PM success metrics tied to delivery predictability (60% to 85% on-time delivery) and stakeholder satisfaction\n\nThe biggest learning was that PM isn't just about managing products - it's about being the communication backbone that enables engineering, sales, and success teams to work effectively together.",
      keyPoints: [
        "Organic transition driven by business needs",
        "Created structured prioritization involving all stakeholders",
        "Hired and developed 3 AMs into independent PMs",
        "Improved delivery predictability from 60% to 85%"
      ]
    },
    {
      id: "team-development",
      category: "Team Development",
      question: "Tell me about developing those 3 Associate PMs - specific examples",
      answer: "Each PM had different growth areas, so I tailored my approach:\n\n**Rahul** (SFS Product Lead): Initially struggled with client confidence. I paired him with me on challenging client calls, then gradually transferred ownership. Now he independently manages Endless Aisle, Self-checkout, and Returns features with direct client interaction.\n\n**Vineet** (OMS/WMS Lead): Needed help with strategic thinking. I involved him in sprint planning redesign, teaching him bandwidth allocation frameworks. He now independently plans sprints and has improved our delivery from 60% to 85% on-time.\n\n**Raghav** (Integration Lead): Had collaboration challenges. I worked with him on stakeholder communication, and now we have zero urgent-critical integration requests for 2+ consecutive sprints (previously 3-4 per sprint).\n\nMy mentoring philosophy: Give them real responsibility with safety net support. Each PM now owns their product line end-to-end, from discovery to delivery to client relationships.",
      keyPoints: [
        "Tailored development approach for each PM's growth areas",
        "Gradual responsibility transfer with safety net support",
        "Measurable outcomes: delivery improvements and client satisfaction",
        "Each PM now independently manages full product lifecycle"
      ]
    },
    {
      id: "business-impact",
      category: "Business Impact",
      question: "Break down that ₹30L revenue generation - what was your role vs team's?",
      answer: "The ₹30L MRR came from three major client implementations where I was directly involved:\n\n**Meesho (₹10L/month)**:\n- My role: Product strategy for packaging center requirements, technical architecture for scale\n- Team role: Implementation and integration development\n- Key contribution: Designed the multi-channel inventory system that handles their 1M+ monthly orders\n\n**Al-Abdul Karim (₹10L/month)**:\n- My role: Direct development work (45+ story points), complex onboarding strategy\n- Team role: Standard module development\n- Key contribution: Personally built the vendor management system and ERP integrations\n\n**ModeInk (₹10L/month)**:\n- My role: Discovery and solution architecture for their B2B fulfillment needs\n- Team role: Feature development and testing\n- Key contribution: Designed the custom pricing and approval workflows\n\nIn each case, I owned the strategic client relationship and critical technical decisions, while the team executed the majority of the development work. My engineering background was crucial for gaining client confidence during technical discussions.",
      keyPoints: [
        "Direct involvement in client strategy and technical architecture",
        "Personal development work when critical for timeline",
        "Team executed majority of implementation",
        "Engineering background crucial for client confidence"
      ]
    },
    {
      id: "innovation",
      category: "Innovation & Vision",
      question: "How are you preparing your team for AI's impact on PM roles?",
      answer: "I believe PMs need to become 'triple-threat' professionals: product strategy + basic engineering + design sensibility, all accelerated by AI.\n\nConcrete steps I've taken:\n\n**AI Tool Integration**:\n- Implemented Cursor for rapid prototyping across my team\n- Created custom AI copilots using our Confluence data\n- Curated 150+ PM prompts from top practitioners\n\n**Skill Development**:\n- 3 out of 4 PMs now use AI for prototyping, saving 50% design time\n- Taught code-based design delivery, reducing engineering implementation time by 70-80%\n- Each PM is working on their own AI initiative\n\n**Process Innovation**:\n- Replaced traditional Figma workflows with AI-generated UI code\n- Used AI for discovery interview analysis and pattern recognition\n- Automated routine documentation and status reporting\n\nThe goal isn't to replace human judgment but to eliminate routine work so PMs can focus on strategic thinking, stakeholder alignment, and customer empathy - the uniquely human aspects of product management.",
      keyPoints: [
        "Triple-threat PM vision: strategy + engineering + design",
        "50-80% productivity improvements through AI tools",
        "Each team member working on individual AI initiatives",
        "Focus on uniquely human PM skills: strategy and empathy"
      ]
    },
    {
      id: "failure",
      category: "Failure & Learning",
      question: "Tell me about a time you failed and what you learned",
      answer: "Early in my PM transition, I made a critical error during our Styli client implementation. I over-promised on timeline without fully understanding the technical complexity of their vendor management requirements.\n\nThe failure:\n- Committed to 4-week delivery for what turned out to be 8-week scope\n- Didn't involve engineering team in initial estimation\n- Client relationship became strained, threatening a ₹15L+ annual contract\n\nHow I recovered:\n- Immediately called a transparent meeting with client, engineering, and leadership\n- Proposed a phased delivery approach, delivering core functionality in 4 weeks, advanced features in next 4\n- Personally took on development work to accelerate timeline\n- Implemented weekly client check-ins for transparency\n\nWhat I learned:\n- Never commit to timelines without engineering team input\n- Under-promise, over-deliver is better than the reverse\n- Transparency and ownership during failures actually strengthens client relationships\n- Technical PM credibility comes from understanding implementation complexity\n\nResult: Styli became one of our strongest client relationships, and this experience shaped my approach to estimation and stakeholder communication.",
      keyPoints: [
        "Over-promised on timeline without technical team input",
        "Recovered through transparency and phased delivery approach",
        "Personal accountability and hands-on problem solving",
        "Failure strengthened long-term client relationship"
      ]
    }
  ];

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const categories = [...new Set(questions.map(q => q.category))];

  return (
    <div className="py-4 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-4">🎤 Interviewer's Perspective</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Key questions I'd ask and what Alaf has to say about them
          </p>
        </div>

        {/* Interview Assessment */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Interview Assessment</h2>
          <p className="text-base mb-4">
            <strong>Overall: Would be a rigorous but positive interview</strong>
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Strengths to Validate:</h3>
              <ul className="space-y-2">
                <li>• Technical depth with business impact</li>
                <li>• Leadership through crisis situations</li>
                <li>• Strategic thinking and execution</li>
                <li>• Team building and mentorship</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Areas to Probe:</h3>
              <ul className="space-y-2">
                <li>• Depth vs breadth across domains</li>
                <li>• Handling failure and setbacks</li>
                <li>• Adaptability to new environments</li>
                <li>• Vision for future PM evolution</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Questions by Category */}
        {categories.map(category => (
          <div key={category} className="mb-8">
            <h2 className="text-lg font-bold mb-4">{category}</h2>
            
            <div className="space-y-4">
              {questions.filter(q => q.category === category).map(question => (
                <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                  <button
                    onClick={() => toggleQuestion(question.id)}
                    className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold">{question.question}</h3>
                      <svg
                        className={`w-5 h-5 transform transition-transform ${
                          expandedQuestion === question.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  {expandedQuestion === question.id && (
                    <div className="px-4 pb-4">
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                        <div className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300 mb-4">
                          {question.answer}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Key Points:</h4>
                          <ul className="space-y-1">
                            {question.keyPoints.map((point, index) => (
                              <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                                • {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewerPerspective; 