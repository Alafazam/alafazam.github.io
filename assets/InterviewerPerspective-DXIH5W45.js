import{r as d,j as e,S as m,s as h}from"./index-Bj-LZNIM.js";const p=()=>{const[i,o]=d.useState(null),a=[{id:"technical-depth",category:"Technical Depth",question:"Walk me through the WMS2 architecture decision and how you convinced stakeholders",answer:`WMS2 represented a fundamental shift from serialized to non-serialized warehouse operations. The key challenge was that our existing WMS required strict sequential workflows, limiting our ability to serve clients with more dynamic warehouse operations.

I led the strategic pivot by first conducting deep discovery with clients who had rejected our serialized approach. I identified that non-serialized workflows could unlock a $2M+ TAM expansion, particularly for US market entry.

To convince stakeholders, I created a working prototype using Cursor and AI tools, reducing the typical design-to-demo cycle from months to weeks. This prototype demonstrated the technical feasibility and business impact.

The architecture uses event-driven microservices that can handle parallel warehouse operations while maintaining data consistency through eventual consistency patterns. I worked closely with the engineering team to design the state management system that could track inventory across multiple concurrent workflows.`,keyPoints:["Market research identified $2M+ TAM expansion opportunity","Used AI tools to rapidly prototype and validate concept","Event-driven architecture for parallel workflow handling","Stakeholder buy-in through working demo, not just presentations"]},{id:"technical-implementation",category:"Technical Leadership",question:"Explain the Kubernetes scaling solution - what were the technical trade-offs?",answer:`The Kubernetes modernization was critical as we were hitting scaling bottlenecks at 8M+ monthly orders. Our legacy monolithic deployment couldn't handle traffic spikes during peak seasons.

I led the architectural design for a microservices-based deployment using Kubernetes auto-scaling. Key technical decisions:

1. **Service Decomposition**: We broke the monolith into 12 core microservices (inventory, orders, integrations, etc.) based on business domain boundaries

2. **Auto-scaling Strategy**: Implemented HPA (Horizontal Pod Autoscaler) based on CPU and custom metrics like order queue depth

3. **Trade-offs Made**:
   - Increased operational complexity but gained independent scaling
   - Higher initial latency due to service calls but better overall throughput
   - More complex debugging but improved fault isolation

The result: we can now handle 3x order volume with the same infrastructure cost, and zero-downtime deployments became standard.`,keyPoints:["Decomposed monolith into 12 domain-driven microservices","Custom metrics-based auto-scaling (queue depth, not just CPU)","Conscious trade-offs: complexity vs scalability","3x capacity improvement with same infrastructure cost"]},{id:"hands-on",category:"Technical Leadership",question:"How did you personally deliver 45+ story points while managing a team?",answer:`This happened during a critical period when we were implementing Al-Abdul Karim (our most complex client onboarding) while facing significant team attrition. We had committed to a Q4 revenue target, and delays would have cost us ₹10L+ monthly revenue.

I made the strategic decision to personally take on development work in three areas:

1. **Critical WMS modules**: Vendor management workflows that were blocking the onboarding
2. **Integration toolkits**: Custom APIs for their ERP system
3. **Performance optimizations**: Database query improvements for their 50M+ SKU catalog

I maintained team leadership by:
- Conducting daily standups early morning before coding
- Using asynchronous communication for code reviews
- Delegating team coordination to my senior PM

This taught me that technical credibility isn't just about past experience - it's about being willing to solve critical problems directly when the team needs it most.`,keyPoints:["Strategic decision during team attrition crisis","₹10L+ monthly revenue at stake","Balanced hands-on coding with team leadership","Delivered vendor management, integrations, and performance optimizations"]},{id:"leadership-style",category:"Leadership Style",question:"How did you transition from engineer to establishing the entire PM function?",answer:`The transition happened organically as Increff grew from a 15-person engineering team to a 100+ client business. I realized that pure engineering execution wasn't enough - we needed product strategy and stakeholder alignment.

Key steps in establishing the PM function:

1. **Process Creation**: I started by formalizing our ad-hoc prioritization into structured frameworks involving sales, success, and engineering inputs

2. **Cross-functional Integration**: Created regular touchpoints between teams - weekly prioritization meetings, monthly roadmap reviews, quarterly planning cycles

3. **Hiring & Development**: Hired 3 Associate PMs and spent significant time mentoring them through real client scenarios

4. **Metrics & Accountability**: Established PM success metrics tied to delivery predictability (60% to 85% on-time delivery) and stakeholder satisfaction

The biggest learning was that PM isn't just about managing products - it's about being the communication backbone that enables engineering, sales, and success teams to work effectively together.`,keyPoints:["Organic transition driven by business needs","Created structured prioritization involving all stakeholders","Hired and developed 3 AMs into independent PMs","Improved delivery predictability from 60% to 85%"]},{id:"team-development",category:"Team Development",question:"Tell me about developing those 3 Associate PMs - specific examples",answer:`Each PM had different growth areas, so I tailored my approach:

**Rahul** (SFS Product Lead): Initially struggled with client confidence. I paired him with me on challenging client calls, then gradually transferred ownership. Now he independently manages Endless Aisle, Self-checkout, and Returns features with direct client interaction.

**Vineet** (OMS/WMS Lead): Needed help with strategic thinking. I involved him in sprint planning redesign, teaching him bandwidth allocation frameworks. He now independently plans sprints and has improved our delivery from 60% to 85% on-time.

**Raghav** (Integration Lead): Had collaboration challenges. I worked with him on stakeholder communication, and now we have zero urgent-critical integration requests for 2+ consecutive sprints (previously 3-4 per sprint).

My mentoring philosophy: Give them real responsibility with safety net support. Each PM now owns their product line end-to-end, from discovery to delivery to client relationships.`,keyPoints:["Tailored development approach for each PM's growth areas","Gradual responsibility transfer with safety net support","Measurable outcomes: delivery improvements and client satisfaction","Each PM now independently manages full product lifecycle"]},{id:"business-impact",category:"Business Impact",question:"Break down that ₹30L revenue generation - what was your role vs team's?",answer:`The ₹30L MRR came from three major client implementations where I was directly involved:

**Meesho (₹10L/month)**:
- My role: Product strategy for packaging center requirements, technical architecture for scale
- Team role: Implementation and integration development
- Key contribution: Designed the multi-channel inventory system that handles their 1M+ monthly orders

**Al-Abdul Karim (₹10L/month)**:
- My role: Direct development work (45+ story points), complex onboarding strategy
- Team role: Standard module development
- Key contribution: Personally built the vendor management system and ERP integrations

**ModeInk (₹10L/month)**:
- My role: Discovery and solution architecture for their B2B fulfillment needs
- Team role: Feature development and testing
- Key contribution: Designed the custom pricing and approval workflows

In each case, I owned the strategic client relationship and critical technical decisions, while the team executed the majority of the development work. My engineering background was crucial for gaining client confidence during technical discussions.`,keyPoints:["Direct involvement in client strategy and technical architecture","Personal development work when critical for timeline","Team executed majority of implementation","Engineering background crucial for client confidence"]},{id:"innovation",category:"Innovation & Vision",question:"How are you preparing your team for AI's impact on PM roles?",answer:`I believe PMs need to become 'triple-threat' professionals: product strategy + basic engineering + design sensibility, all accelerated by AI.

Concrete steps I've taken:

**AI Tool Integration**:
- Implemented Cursor for rapid prototyping across my team
- Created custom AI copilots using our Confluence data
- Curated 150+ PM prompts from top practitioners

**Skill Development**:
- 3 out of 4 PMs now use AI for prototyping, saving 50% design time
- Taught code-based design delivery, reducing engineering implementation time by 70-80%
- Each PM is working on their own AI initiative

**Process Innovation**:
- Replaced traditional Figma workflows with AI-generated UI code
- Used AI for discovery interview analysis and pattern recognition
- Automated routine documentation and status reporting

The goal isn't to replace human judgment but to eliminate routine work so PMs can focus on strategic thinking, stakeholder alignment, and customer empathy - the uniquely human aspects of product management.`,keyPoints:["Triple-threat PM vision: strategy + engineering + design","50-80% productivity improvements through AI tools","Each team member working on individual AI initiatives","Focus on uniquely human PM skills: strategy and empathy"]},{id:"failure",category:"Failure & Learning",question:"Tell me about a time you failed and what you learned",answer:`Early in my PM transition, I made a critical error during our Styli client implementation. I over-promised on timeline without fully understanding the technical complexity of their vendor management requirements.

The failure:
- Committed to 4-week delivery for what turned out to be 8-week scope
- Didn't involve engineering team in initial estimation
- Client relationship became strained, threatening a ₹15L+ annual contract

How I recovered:
- Immediately called a transparent meeting with client, engineering, and leadership
- Proposed a phased delivery approach, delivering core functionality in 4 weeks, advanced features in next 4
- Personally took on development work to accelerate timeline
- Implemented weekly client check-ins for transparency

What I learned:
- Never commit to timelines without engineering team input
- Under-promise, over-deliver is better than the reverse
- Transparency and ownership during failures actually strengthens client relationships
- Technical PM credibility comes from understanding implementation complexity

Result: Styli became one of our strongest client relationships, and this experience shaped my approach to estimation and stakeholder communication.`,keyPoints:["Over-promised on timeline without technical team input","Recovered through transparency and phased delivery approach","Personal accountability and hands-on problem solving","Failure strengthened long-term client relationship"]}],r=t=>{o(i===t?null:t)},s=[...new Set(a.map(t=>t.category))];return e.jsxs("div",{className:"py-4 px-4",children:[e.jsx(m,{...h("/interviewer")}),e.jsxs("div",{className:"mx-auto max-w-4xl",children:[e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("h1",{className:"text-2xl font-bold mb-4",children:"🎤 Interviewer's Perspective"}),e.jsx("p",{className:"text-lg text-muted-foreground",children:"Key questions I'd ask and what Alaf has to say about them"})]}),e.jsxs("div",{className:"mb-8",children:[e.jsx("h2",{className:"text-xl font-bold mb-4",children:"Interview Assessment"}),e.jsx("p",{className:"text-base mb-4",children:e.jsx("strong",{children:"Overall: Would be a rigorous but positive interview"})}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-3",children:"Strengths to Validate:"}),e.jsxs("ul",{className:"space-y-2",children:[e.jsx("li",{children:"• Technical depth with business impact"}),e.jsx("li",{children:"• Leadership through crisis situations"}),e.jsx("li",{children:"• Strategic thinking and execution"}),e.jsx("li",{children:"• Team building and mentorship"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-3",children:"Areas to Probe:"}),e.jsxs("ul",{className:"space-y-2",children:[e.jsx("li",{children:"• Depth vs breadth across domains"}),e.jsx("li",{children:"• Handling failure and setbacks"}),e.jsx("li",{children:"• Adaptability to new environments"}),e.jsx("li",{children:"• Vision for future PM evolution"})]})]})]})]}),s.map(t=>e.jsxs("div",{className:"mb-8",children:[e.jsx("h2",{className:"text-lg font-bold mb-4",children:t}),e.jsx("div",{className:"space-y-4",children:a.filter(n=>n.category===t).map(n=>e.jsxs("div",{className:"border border-border rounded-lg",children:[e.jsx("button",{onClick:()=>r(n.id),className:"w-full text-left p-4 hover:bg-accent transition-colors rounded-lg",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h3",{className:"text-base font-semibold",children:n.question}),e.jsx("svg",{className:`w-5 h-5 transform transition-transform ${i===n.id?"rotate-180":""}`,fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 9l-7 7-7-7"})})]})}),i===n.id&&e.jsx("div",{className:"px-4 pb-4",children:e.jsxs("div",{className:"border-t border-border pt-4",children:[e.jsx("div",{className:"whitespace-pre-line text-sm text-muted-foreground mb-4",children:n.answer}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-semibold text-sm mb-2",children:"Key Points:"}),e.jsx("ul",{className:"space-y-1",children:n.keyPoints.map((l,c)=>e.jsxs("li",{className:"text-sm text-muted-foreground",children:["• ",l]},c))})]})]})})]},n.id))})]},t))]})]})};export{p as default};
