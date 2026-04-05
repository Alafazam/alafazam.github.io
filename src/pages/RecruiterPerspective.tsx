const RecruiterPerspective = () => {
  return (
    <div className="py-4 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-4">🎯 Recruiter Notes: Alaf Azam Khan</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Internal assessment - why this profile caught my attention
          </p>
        </div>

        {/* Visual Summary Card */}
        <div className="mb-8">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">
              5-Second Snapshot
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-2xl mb-2">🚀</div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Role</div>
                <div className="font-semibold">Senior PM, Engineering leader, CTO track</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🧠</div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Scope</div>
                <div className="font-semibold">6+ products, 25+ engineers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💰</div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Revenue</div>
                <div className="font-semibold">Helps in closing large deals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🚀</div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">ARR</div>
                <div className="font-semibold">Driving products with $12M ARR</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🤖</div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">AI Impact</div>
                <div className="font-semibold">Uses Cursor and AI copilots for prototyping</div>
              </div>
            </div>
          </div>
        </div>

        {/* First Impression */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">First thoughts when I saw this profile:</h2>
          <p className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">
            "Wait, this actually looks really good. Let me dig deeper..."
          </p>
          <p className="text-base text-gray-600 dark:text-gray-300">
            Honestly? This isn't your typical PM resume. Most candidates either have the business side OR the technical chops. Alaf has both, plus he's actually built stuff and can point to real revenue numbers. That's rare.
          </p>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

        {/* Main Content - 2 Column Layout */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6">What actually caught my attention</h2>
          
          <div className="grid grid-cols-5 gap-8">
            {/* Left Column - 60% */}
            <div className="col-span-3 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">The revenue stuff is legit 💰</h3>
                <p className="mb-2 text-gray-600 dark:text-gray-300">Look, most PMs talk about "impact" but can't quantify it. This guy has:</p>
                <ul className="space-y-1 ml-4">
                  <li>→ ₹30L+ monthly recurring revenue (that's actual money coming in)</li>
                  <li>→ Saved $500K+ annually (CFOs love this)</li>
                  <li>→ Part of scaling to $12M ARR across multiple products</li>
                  <li>→ Actually owns P&L, not just "contributed to success"</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">He can actually talk to engineers 🧠</h3>
                <p className="mb-2 text-gray-600 dark:text-gray-300">This is huge. Most PMs are either business-only or tech-only. He grew up as an engineer:</p>
                <ul className="space-y-1 ml-4">
                  <li>→ Started as SDE1, worked his way up to SDE3, then moved to PM</li>
                  <li>→ Still codes when needed (delivered 45+ story points during crunch time)</li>
                  <li>→ Knows database design, CI/CD, the real technical stuff</li>
                  <li>→ Engineers will actually respect him (this matters more than people think)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">The scale is impressive 📊</h3>
                <p className="mb-2 text-gray-600 dark:text-gray-300">These aren't startup numbers, this is enterprise-level stuff:</p>
                <ul className="space-y-1 ml-4">
                  <li>→ 200M+ SKUs (that's a lot of data to manage)</li>
                  <li>→ 8M+ orders monthly (high-volume systems)</li>
                  <li>→ 100+ enterprise clients globally</li>
                  <li>→ Led teams of 25+ engineers (that's proper leadership)</li>
                </ul>
              </div>
            </div>

            {/* Right Column - 40% */}
            <div className="col-span-2 space-y-6">
              {/* AI Trends Highlight */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-purple-800 dark:text-purple-300">He's ahead on AI trends 🤖</h3>
                <p className="mb-2 text-purple-700 dark:text-purple-300 text-sm">While everyone's still figuring out ChatGPT, he's already implementing:</p>
                <ul className="space-y-1 text-sm text-purple-700 dark:text-purple-300">
                  <li>→ AI-first product development culture</li>
                  <li>→ 50-80% faster prototyping and documentation</li>
                  <li>→ Team using Cursor and other AI tools effectively</li>
                  <li>→ This shows he's thinking ahead, not just following trends</li>
                </ul>
              </div>

              {/* Quick Concerns */}
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-orange-800 dark:text-orange-300">Potential red flags?</h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-orange-700 dark:text-orange-300">"8+ years at one company?"</p>
                    <p className="text-orange-600 dark:text-orange-400">Actually no - he grew WITH the company from startup to $12M ARR. That's scaling, not staying put.</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-orange-700 dark:text-orange-300">"Too supply chain focused?"</p>
                    <p className="text-orange-600 dark:text-orange-400">Supply chain touches everything. Plus, 200M SKUs = complex systems thinking that applies anywhere.</p>
                  </div>
                </div>
              </div>

              {/* Fast Track Recommendation */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-green-800 dark:text-green-300">🔥 Fast-track this one</h3>
                <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                  <p>→ <strong>Priority:</strong> Top 5% this quarter</p>
                  <p>→ <strong>Timeline:</strong> Interview this week</p>
                  <p>→ <strong>Level:</strong> Senior PM → Director track</p>
                  <p>→ <strong>Comp:</strong> Top of band justified</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-600 my-8"></div>

        {/* Decision Summary Panel */}
        <div>
          <h2 className="text-xl font-bold mb-6">Decision Summary</h2>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="space-y-6">
              {/* Decision */}
              <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-600">
                <div className="text-2xl">✅</div>
                <div className="flex-1">
                  <div className="font-semibold text-lg mb-1">Decision</div>
                  <div className="text-green-600 dark:text-green-400 font-medium">
                    "Hire immediately — senior-level ready"
                  </div>
                </div>
              </div>

              {/* Target Role */}
              <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-600">
                <div className="text-2xl">🎯</div>
                <div className="flex-1">
                  <div className="font-semibold text-lg mb-1">Target Role</div>
                  <div className="text-gray-700 dark:text-gray-300">
                    Senior PM with Director trajectory (12-18 months)
                  </div>
                </div>
              </div>

              {/* Unique Strength */}
              <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-600">
                <div className="text-2xl">💡</div>
                <div className="flex-1">
                  <div className="font-semibold text-lg mb-1">Unique Strength</div>
                  <div className="text-gray-700 dark:text-gray-300">
                    Combines technical depth, business ownership & team scaling
                  </div>
                </div>
              </div>

              {/* Impact */}
              <div className="flex items-start gap-4">
                <div className="text-2xl">💥</div>
                <div className="flex-1">
                  <div className="font-semibold text-lg mb-1">Impact</div>
                  <div className="text-gray-700 dark:text-gray-300">
                    ₹30L MRR, $500K savings, 6+ product lines, 45+ SP personally delivered
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Bottom line:</strong> This is the kind of PM who can own a product line, talk to customers, 
              work with engineering, and actually ship stuff that makes money. Don't overthink it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterPerspective; 