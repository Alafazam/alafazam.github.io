const HiringManagerPerspective = () => {
  return (
    <div className="py-4 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-4">👨‍💼 Hiring Manager's Perspective</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Why Alaf thinks he is a good fit for the role
          </p>
        </div>

        {/* Decision */}
        <div className="mb-8">
          <h2 className="text-xl mb-4">My Decision</h2>
          <p className="text-lg font-semibold mb-4">
            "We should hire Alaf immediately - he is senior level ready"
          </p>
          <p className="text-base text-gray-600 dark:text-gray-300">
            Alaf represents the ideal blend of technical depth, business acumen, and leadership capability 
            that we need for our Senior PM role with clear Director trajectory.
          </p>
        </div>

        {/* Why I'd Hire */}
        <div className="mb-8">
          <h2 className="text-xl mb-6">Why Alaf thinks he is a good fit for the role</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">🤝 Strategic Business Partner</h3>
              <ul className="space-y-2">
                <li>Understands P&L impact (revenue generation, cost optimization)</li>
                <li>Built functions from scratch - entrepreneurial mindset</li>
                <li>Can work at CEO level but also get hands dirty</li>
                <li>Direct track record: $12M ARR growth</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">⚙️ Technical Credibility</h3>
              <ul className="space-y-2">
                <li>Engineering background means dev teams will respect him</li>
                <li>Kubernetes, cloud architecture, database design expertise</li>
                <li>He has delivered above 45+ story points during crisis = so not just a "PowerPoint PM"</li>
                <li>Can make informed technical trade-offs</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">👥 Team Builder & Mentor</h3>
              <ul className="space-y-2">
                <li>Developed 3 APMs (Associate Product Managers) into independent Product Managers - team scaling</li>
                <li>Cross-functional team building (pre-sales, onboarding)</li>
                <li>Interview standardization, Team SOP, assigning responsibilities shows process thinking</li>
                <li>Proven track record managing 25+ people and multiple stakeholders</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">🚀 Future-Ready Leadership</h3>
              <ul className="space-y-2">
                <li>AI adoption puts him ahead of 90% of PMs</li>
                <li>Supply chain + tech expertise increasingly valuable</li>
                <li>WMS2 pivot shows strategic vision</li>
                <li>Innovation mindset with measurable results</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Role Placement */}
        <div className="mb-8">
          <h2 className="text-xl mb-6">Where Alaf thinks he would fit in</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">🎯 Senior PM Role with Director Path</h3>
              <div>
                <p className="mb-3"><strong>Immediate Role:</strong> Senior Product Manager</p>
                <p className="mb-3"><strong>Timeline to Director:</strong> 12-18 months (based on performance)</p>
                <p><strong>Rationale:</strong> Alaf has already done Director-level work at Increff. This gives him time to learn our domain while demonstrating leadership.</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">📦 Multi-Product Ownership</h3>
              <div>
                <p className="mb-3"><strong>Scope:</strong> 2-3 product lines initially, scaling to full portfolio</p>
                <p className="mb-3"><strong>Team Size:</strong> 15-20 engineers initially</p>
                <p><strong>Why:</strong> Alaf is ready for complex multi-product management based on his 6+ product experience at Increff.</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">👥 Team Lead Responsibilities</h3>
              <div>
                <p className="mb-3"><strong>Direct Reports:</strong> 2-3 PM2/PM1 level PMs</p>
                <p className="mb-3"><strong>Mentorship Role:</strong> Develop junior PMs like Alaf did at Increff</p>
                <p><strong>Process Ownership:</strong> Help standardize our PM practices based on Alaf's experience building PM function</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compensation & Onboarding */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6">Compensation & Integration Plan</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">💎 Salary Positioning</h3>
              <ul className="space-y-2">
                <li><strong>Band:</strong> Top 10% for market</li>
                <li><strong>Rationale:</strong> Proven revenue generation track record</li>
                <li><strong>Equity:</strong> Senior level allocation with upside</li>
                <li><strong>Review:</strong> Fast-track to Director evaluation</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">🚀 90-Day Plan</h3>
              <ul className="space-y-2">
                <li><strong>Month 1:</strong> Domain deep-dive, team integration</li>
                <li><strong>Month 2:</strong> Product roadmap assessment</li>
                <li><strong>Month 3:</strong> First strategic initiative delivery</li>
                <li><strong>Ongoing:</strong> PM process optimization</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Concerns to Address */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6">Integration Considerations</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold mb-2">
                Domain Onboarding (if not supply chain)
              </h3>
              <p>
                <strong>Plan:</strong> Pair with domain expert for first month, structured learning program, customer calls immersion.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold mb-2">
                Integration with Existing PM Processes
              </h3>
              <p>
                <strong>Opportunity:</strong> Learn our ways while sharing your PM function building expertise. Two-way knowledge transfer.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold mb-2">
                Managing Upward in Larger Organization
              </h3>
              <p>
                <strong>Support:</strong> Executive mentor assignment, stakeholder mapping session, communication framework training.
              </p>
            </div>
          </div>
        </div>

        {/* Final Assessment */}
        <div>
          <h2 className="text-xl font-bold mb-4">Final Assessment</h2>
          <div className="space-y-3">
            <p className="text-lg font-semibold">Overall Grade: A+ (Exceptional Hire)</p>
            <ul className="space-y-2">
              <li>• <strong>Immediate Impact Potential:</strong> High - can contribute from day 1</li>
              <li>• <strong>Long-term Growth:</strong> Director/VP trajectory within 2-3 years</li>
              <li>• <strong>Cultural Fit:</strong> Innovation mindset aligns with company vision</li>
              <li>• <strong>Risk Level:</strong> Low - proven track record at scale</li>
              <li>• <strong>Team Impact:</strong> Will elevate overall PM competency</li>
            </ul>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-lg font-semibold">
              "This is the type of hire that transforms a product organization. 
              The combination of technical depth, business impact, and team building makes this a must-have candidate."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiringManagerPerspective; 