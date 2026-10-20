const i={frontmatter:{title:"Building with Claude",date:"2026-10-13",description:"A four-part training series I ran for my team on building with Claude: guardrails, the Claude Code workflow, deciding what to build, and multiplying what works.",tags:["ai","workflows","engineering-leadership","tooling"],layout:"deck"},html:`
<!--
Slide deck (\`layout: deck\`): this body is raw HTML, not Markdown, rendered by DeckContent.
Each <section class="slide"> is one slide; data-part groups slides into parts, and divider
slides carry data-tab for the part tabs. Slide titles are h2.hero, because the page's only h1
is the deck title (scripts/prerender.mjs counts the h1 tags, comments included). Colours use the --dk-* tokens defined under .deck in src/index.css.
Figures live in public/images/blog/building-with-claude/. Fig. 0 is redrawn from the deck's figure
with a ratio-preserving dot field (3,900 dots, 60 blue = 1 in 65), so it carries no raw team counts.
-->

<section class="slide title-slide active" data-part="0" aria-label="Title">
  <div class="tx">
    <span class="mark">Training series</span>
    <div>
      <h2 class="hero">Building with Claude</h2>
      <p class="lead" style="margin-top:1.6cqw">Practices, guardrails and habits for shipping faster without lowering the bar.</p>
    </div>
    <div class="parts">
      <div><span class="pn">Part 1</span><b>Guardrails and mindset</b></div>
      <div><span class="pn">Part 2</span><b>The Claude Code workflow</b></div>
      <div><span class="pn">Part 3</span><b>Beyond code</b></div>
      <div><span class="pn">Part 4</span><b>Multiply what works</b></div>
    </div>
  </div>
  <figure class="plate"><figcaption><b>Fig. 0</b>Each dot stands for a Claude Code session my team ran; about 1 in 65 became a pull request (blue). This series is about turning more grey into blue.</figcaption><img alt="A field of grey dots in which about 1 in 65 is blue" src="/images/blog/building-with-claude/fig-0.png"></figure>
</section>

<section class="slide" data-part="0" aria-label="How this series works">
  <h2>How this series works</h2>
  <p class="sub">Four short sessions. Each one ends with something you can use the same day.</p>
  <div class="body">
    <div class="row c4">
      <div class="card"><span class="tag info">Part 1</span><p class="big">Guardrails and mindset</p><p class="mt-s">Everyone, 45 min</p><p class="mt-s">What never goes into a prompt, and who owns the output.</p></div>
      <div class="card"><span class="tag info">Part 2</span><p class="big">The Claude Code workflow</p><p class="mt-s">Engineers and QA, 60 min, hands-on</p><p class="mt-s">Plan, build, test and review with Claude on a real repo.</p></div>
      <div class="card"><span class="tag info">Part 3</span><p class="big">Beyond code</p><p class="mt-s">Everyone, 45 min</p><p class="mt-s">Deciding what to build, plus chat and Cowork for specs, docs and analysis.</p></div>
      <div class="card"><span class="tag info">Part 4</span><p class="big">Multiply what works</p><p class="mt-s">Everyone, 30 min, then every two weeks</p><p class="mt-s">Share, turn mistakes into rules, and measure progress.</p></div>
    </div>
  </div>
</section>

<!-- ============ PART 1 ============ -->
<section class="slide divider" data-part="1" data-tab="Guardrails" aria-label="Part 1">
  <div class="dv">
    <div class="pn">Part 1</div>
    <h2 class="hero">Guardrails and mindset</h2>
    <p class="meta">Everyone, 45 minutes</p>
    <ul class="covers">
      <li>Where we are today</li>
      <li>You are the engineer of record</li>
      <li>AI amplifies your process</li>
      <li>Data, secrets and tenant isolation</li>
      <li>Merging is accountability</li>
    </ul>
  </div>
  <figure class="plate"><figcaption><b>Fig. 1</b>Each chamber is one tenant's data, and nothing ever crosses a wall: 25 chambers, zero crossings. The blue chamber is the only one a query should ever touch.</figcaption><img alt="A grid of 25 sealed chambers, one highlighted" src="/images/blog/building-with-claude/fig-1.png"></figure>
</section>

<section class="slide" data-part="1" aria-label="Where we are">
  <h2>Where we are today</h2>
  <p class="sub">My team's Claude usage in one month.</p>
  <div class="body">
    <div class="row c3">
      <div class="stat"><div class="n">~92%</div><div class="l">of the team uses Claude Code</div></div>
      <div class="stat"><div class="n blue">1 in 65</div><div class="l">sessions became a pull request</div></div>
      <div class="stat"><div class="n">~43%</div><div class="l">use Claude beyond code</div></div>
    </div>
    <p class="callout">We use Claude a lot. The gap is turning sessions into reviewed, shipped changes, and using it beyond code.</p>
  </div>
</section>

<section class="slide" data-part="1" aria-label="Engineer of record">
  <h2>Claude drafts. You are the engineer of record.</h2>
  <div class="body">
    <svg class="dia" viewBox="0 0 960 150" role="img" aria-label="Claude drafts, you review and decide, your name is on the PR">
      <defs><marker id="m1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--dk-rule)"/></marker></defs>
      <rect x="0" y="25" width="270" height="100" rx="16" style="fill:var(--dk-soft);stroke:var(--dk-line)"/>
      <text class="t" x="135" y="70" text-anchor="middle">Claude drafts</text>
      <text class="s" x="135" y="98" text-anchor="middle">code, tests, docs, plans</text>
      <line class="ln" x1="280" y1="75" x2="335" y2="75" marker-end="url(#m1)"/>
      <rect x="345" y="25" width="270" height="100" rx="16" style="fill:var(--dk-accent-fill)"/>
      <text class="tw" x="480" y="70" text-anchor="middle">You review and decide</text>
      <text class="sw" x="480" y="98" text-anchor="middle">every line, every test</text>
      <line class="ln" x1="625" y1="75" x2="680" y2="75" marker-end="url(#m1)"/>
      <rect x="690" y="25" width="270" height="100" rx="16" stroke-width="2" style="fill:var(--dk-page);stroke:var(--dk-ink)"/>
      <text class="t" x="825" y="70" text-anchor="middle">Your name on the PR</text>
      <text class="s" x="825" y="98" text-anchor="middle">accountable for what ships</text>
    </svg>
    <div class="row c3 mt">
      <div class="card soft"><h3>It lacks our context</h3><p>It doesn't know our tenants, clients or history unless you tell it.</p></div>
      <div class="card soft"><h3>It can be confidently wrong</h3><p>Especially about methods and APIs that look plausible but don't exist.</p></div>
      <div class="card soft"><h3>No review defence</h3><p>"Claude wrote it" never explains a bug in your PR.</p></div>
    </div>
  </div>
</section>

<section class="slide" data-part="1" aria-label="AI amplifies your process">
  <h2>AI amplifies whatever process you already have</h2>
  <div class="body">
    <div class="row cw center">
      <svg class="dia" viewBox="0 0 760 290" role="img" aria-label="A clear process through AI gives better work faster; a messy process through AI gives tech debt faster">
        <defs><marker id="m2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--dk-rule)"/></marker></defs>
        <rect x="0" y="20" width="230" height="90" rx="14" style="fill:var(--dk-soft);stroke:var(--dk-line)"/>
        <text class="t" x="115" y="60" text-anchor="middle">Clear process</text>
        <text class="s" x="115" y="86" text-anchor="middle">plan, tests, review</text>
        <line class="ln" x1="238" y1="65" x2="282" y2="65"/>
        <polygon points="285,25 285,105 375,65" stroke-width="2" style="fill:var(--dk-accent-soft);stroke:var(--dk-accent)"/>
        <text x="314" y="72" font-size="19" font-weight="700" style="fill:var(--dk-accent)">AI</text>
        <line class="ln" x1="380" y1="65" x2="460" y2="65" marker-end="url(#m2)"/>
        <rect x="470" y="20" width="290" height="90" rx="14" style="fill:var(--dk-do-soft);stroke:var(--dk-do-line)"/>
        <text x="615" y="60" text-anchor="middle" font-size="21" font-weight="650" style="fill:var(--dk-do)">Better work, faster</text>
        <text class="s" x="615" y="86" text-anchor="middle">quality compounds</text>

        <rect x="0" y="180" width="230" height="90" rx="14" style="fill:var(--dk-soft);stroke:var(--dk-line)"/>
        <text class="t" x="115" y="220" text-anchor="middle">Messy process</text>
        <text class="s" x="115" y="246" text-anchor="middle">no plan, no tests</text>
        <line class="ln" x1="238" y1="225" x2="282" y2="225"/>
        <polygon points="285,185 285,265 375,225" stroke-width="2" style="fill:var(--dk-accent-soft);stroke:var(--dk-accent)"/>
        <text x="314" y="232" font-size="19" font-weight="700" style="fill:var(--dk-accent)">AI</text>
        <line class="ln" x1="380" y1="225" x2="460" y2="225" marker-end="url(#m2)"/>
        <rect x="470" y="180" width="290" height="90" rx="14" style="fill:var(--dk-dont-soft);stroke:var(--dk-dont-line)"/>
        <text x="615" y="220" text-anchor="middle" font-size="21" font-weight="650" style="fill:var(--dk-dont)">Tech debt, faster</text>
        <text class="s" x="615" y="246" text-anchor="middle">problems compound too</text>
      </svg>
      <ul class="notes">
        <li>Speed isn't free. If you ship faster, you also need to catch problems faster.</li>
        <li>The fix is better structure and clearer constraints, not more AI.</li>
        <li>That's why the rest of this series is about process, not prompts.</li>
      </ul>
    </div>
  </div>
</section>

<section class="slide" data-part="1" aria-label="Data in prompts">
  <h2>Describe the shape of the data, never the data</h2>
  <div class="body">
    <div class="row cn">
      <div class="card" style="border-color:var(--dk-dont-line)">
        <span class="tag bad">Never goes into a prompt</span>
        <ul class="notes sm">
          <li>Client or tenant data, including exports and screenshots</li>
          <li>Credentials, API keys, tokens, .env files</li>
          <li>Personal data about customers or colleagues</li>
          <li>Production dumps and query results</li>
          <li>Contracts and commercial terms</li>
        </ul>
      </div>
      <div style="display:grid;gap:1.2cqw">
        <div class="prompt"><div class="ph bad">Unsafe</div><pre>Here's last week's sales export for the client.
Why is sell-through wrong? [pastes 2,000 rows]</pre></div>
        <div class="prompt"><div class="ph good">Safe</div><pre>Here's the schema of the sales table (column names
and types) and 5 synthetic rows. Sell-through comes
out above 100% for some styles. Write a query to
find the rows that cause it and explain likely causes.</pre></div>
      </div>
    </div>
  </div>
</section>

<section class="slide" data-part="1" aria-label="Tenant isolation">
  <h2>Tenant isolation is a hard constraint</h2>
  <div class="body">
    <div class="row cw center">
      <svg class="dia" viewBox="0 0 700 250" role="img" aria-label="A query scoped to tenant A reaches only tenant A; a path to tenant B is a critical defect">
        <defs>
          <marker id="m3g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--dk-do)"/></marker>
          <marker id="m3r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--dk-dont)"/></marker>
        </defs>
        <rect x="0" y="80" width="210" height="90" rx="14" style="fill:var(--dk-accent-fill)"/>
        <text class="tw" x="105" y="120" text-anchor="middle">Query</text>
        <text class="sw" x="105" y="146" text-anchor="middle">tenant_id = A</text>
        <path d="M215,110 C300,110 330,60 440,60" stroke-width="2.5" fill="none" marker-end="url(#m3g)" style="stroke:var(--dk-do)"/>
        <text x="300" y="70" font-size="15" font-weight="600" style="fill:var(--dk-do)">scoped</text>
        <path d="M215,140 C300,140 330,190 440,190" stroke-width="2.5" stroke-dasharray="7 6" fill="none" marker-end="url(#m3r)" style="stroke:var(--dk-dont)"/>
        <text x="300" y="214" font-size="15" font-weight="600" style="fill:var(--dk-dont)">cross-tenant</text>
        <circle cx="340" cy="168" r="13" stroke-width="2" style="fill:var(--dk-page);stroke:var(--dk-dont)"/>
        <path d="M334,162 L346,174 M346,162 L334,174" stroke-width="2.5" style="stroke:var(--dk-dont)"/>
        <rect x="450" y="20" width="250" height="80" rx="14" style="fill:var(--dk-do-soft);stroke:var(--dk-do-line)"/>
        <text class="t" x="575" y="66" text-anchor="middle">Tenant A data</text>
        <rect x="450" y="150" width="250" height="80" rx="14" style="fill:var(--dk-dont-soft);stroke:var(--dk-dont-line)"/>
        <text class="t" x="575" y="188" text-anchor="middle">Tenant B data</text>
        <text class="s" x="575" y="212" text-anchor="middle">critical defect</text>
      </svg>
<pre class="code"><span class="k">def</span> get_stock(tenant_id: str, style_id: str):
    <span class="k">if not</span> tenant_id:
        <span class="k">raise</span> TenantContextMissing(
            <span class="s">"tenant_id is required"</span>
        )
    <span class="k">return</span> stock_repo.find(
        tenant_id=tenant_id,
        style_id=style_id,
    )</pre>
    </div>
    <p class="callout">Ask Claude: "List every data path this change touches and show where each one is scoped to a tenant."</p>
  </div>
</section>

<section class="slide statement" data-part="1" aria-label="Merging is accountability">
  <p class="q">Merging is accountability, not automation.</p>
  <div class="row c3" style="margin-top:3.4cqw">
    <div class="card soft"><h3>Explain every line</h3><p>Never merge code you can't explain to a reviewer.</p></div>
    <div class="card soft"><h3>Watch for rubber stamps</h3><p>As speed goes up, review depth tends to go down. Don't let it.</p></div>
    <div class="card soft"><h3>A human approves</h3><p>Every merge and every deploy is a human decision.</p></div>
  </div>
</section>

<!-- ============ PART 2 ============ -->
<section class="slide divider" data-part="2" data-tab="Workflow" aria-label="Part 2">
  <div class="dv">
    <div class="pn">Part 2</div>
    <h2 class="hero">The Claude Code workflow</h2>
    <p class="meta">Engineers and QA, 60 minutes, hands-on</p>
    <ul class="covers">
      <li>The work moves to design and review</li>
      <li>The loop: plan, slice, test, review</li>
      <li>CLAUDE.md and our 20 rules</li>
      <li>Code patterns we accept and reject</li>
      <li>Verification and context hygiene</li>
    </ul>
  </div>
  <figure class="plate"><figcaption><b>Fig. 2</b>The six stations on the outer ring are our workflow steps, from plan to PR. Each inner ring is another pass through the loop, tightening toward a clean result.</figcaption><img alt="Concentric loops converging, with six stations on the outer ring" src="/images/blog/building-with-claude/fig-2.png"></figure>
</section>

<section class="slide" data-part="2" aria-label="Time shift">
  <h2>The work moves to design and review</h2>
  <p class="sub">Claude writes code quickly, but it can't fix a bad design. Spend the time you save on the plan and the review.</p>
  <div class="body">
    <div class="split-bars">
      <div>
        <div class="lbl">Before AI</div>
        <div class="bar"><span class="d" style="width:20%">Design</span><span class="b" style="width:55%">Writing code</span><span class="r" style="width:25%">Review</span></div>
      </div>
      <div>
        <div class="lbl">With AI</div>
        <div class="bar"><span class="d" style="width:45%">Design and planning</span><span class="b" style="width:15%">Code</span><span class="r" style="width:40%">Review and testing</span></div>
      </div>
    </div>
    <p class="xs mt">Illustrative split. Your numbers will vary; the direction won't.</p>
  </div>
</section>

<section class="slide" data-part="2" aria-label="The loop">
  <h2>The loop, every time</h2>
  <div class="body">
    <svg class="dia" viewBox="0 -60 1000 290" role="img" aria-label="Plan, small slice, test, run locally, review, PR, with review looping back to plan">
      <defs><marker id="m4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--dk-accent)"/></marker></defs>
      <path d="M752,48 C700,-45 132,-45 80,48" stroke-width="2" stroke-dasharray="6 6" fill="none" marker-end="url(#m4)" style="stroke:var(--dk-accent)"/>
      <rect x="350" y="-40" width="300" height="32" rx="16" style="fill:var(--dk-accent-soft)"/>
      <text x="500" y="-18" text-anchor="middle" font-size="15" font-weight="600" style="fill:var(--dk-accent-2)">iterate: each loop is cheap now</text>
      <line class="ln" x1="114" y1="90" x2="214" y2="90"/><line class="ln" x1="282" y1="90" x2="382" y2="90"/>
      <line class="ln" x1="450" y1="90" x2="550" y2="90"/><line class="ln" x1="618" y1="90" x2="718" y2="90"/>
      <line class="ln" x1="786" y1="90" x2="886" y2="90"/>
      <g text-anchor="middle">
        <circle cx="80" cy="90" r="34" style="fill:var(--dk-accent-fill)"/><text x="80" y="97" font-size="20" font-weight="700" style="fill:#fff">1</text>
        <circle cx="248" cy="90" r="34" style="fill:var(--dk-accent-fill)"/><text x="248" y="97" font-size="20" font-weight="700" style="fill:#fff">2</text>
        <circle cx="416" cy="90" r="34" style="fill:var(--dk-accent-fill)"/><text x="416" y="97" font-size="20" font-weight="700" style="fill:#fff">3</text>
        <circle cx="584" cy="90" r="34" style="fill:var(--dk-accent-fill)"/><text x="584" y="97" font-size="20" font-weight="700" style="fill:#fff">4</text>
        <circle cx="752" cy="90" r="34" style="fill:var(--dk-accent-fill)"/><text x="752" y="97" font-size="20" font-weight="700" style="fill:#fff">5</text>
        <circle cx="920" cy="90" r="34" stroke-width="2" style="fill:var(--dk-page);stroke:var(--dk-ink)"/><text x="920" y="97" font-size="20" font-weight="700" style="fill:var(--dk-ink)">6</text>
        <text class="t" x="80" y="165">Plan</text><text class="s" x="80" y="190">agree the approach</text>
        <text class="t" x="248" y="165">Small slice</text><text class="s" x="248" y="190">one concern</text>
        <text class="t" x="416" y="165">Test</text><text class="s" x="416" y="190">with the code</text>
        <text class="t" x="584" y="165">Run locally</text><text class="s" x="584" y="190">see it pass</text>
        <text class="t" x="752" y="165">Review</text><text class="s" x="752" y="190">your own diff first</text>
        <text class="t" x="920" y="165">PR</text><text class="s" x="920" y="190">why, tests, risks</text>
      </g>
    </svg>
    <p class="callout">AI doesn't reduce iterations. It makes each one cheaper, so do more of them. The first output is a draft, never the deliverable.</p>
  </div>
</section>

<section class="slide" data-part="2" aria-label="Plan first">
  <h2>Step 1: plan before any code</h2>
  <div class="body">
    <div class="row cw center">
      <div class="prompt"><div class="ph">Prompt</div><pre>Read src/allocation/ and its tests.
Do not write or edit any code yet.

Propose a plan to add a minimum display
quantity check to allocation:
- files you will change, and why
- functions you will call (open each file
  and confirm it exists)
- tests you will add
- open questions and assumptions

Wait for my approval before implementing.</pre></div>
      <ul class="notes">
        <li>Use plan mode, so nothing is edited while you agree on the approach.</li>
        <li>Rule: never propose changes to code you haven't read.</li>
        <li>Challenge the plan. Do we need this table? What happens when this fails? It's cheaper to fix a plan than a diff.</li>
        <li>If the plan touches many files, split the task.</li>
      </ul>
    </div>
  </div>
</section>

<section class="slide" data-part="2" aria-label="Let Claude interview you">
  <h2>For bigger work, let Claude interview you first</h2>
  <div class="body">
    <div class="row cn center">
      <ul class="notes">
        <li>Instead of writing a spec from scratch, let Claude question you until the gaps are gone.</li>
        <li>Save the spec in the repo. It becomes the brief for implementation and an example for the next feature.</li>
        <li>Break the plan into thin vertical slices, each one testable and shippable on its own.</li>
      </ul>
      <div class="prompt"><div class="ph">Prompt</div><pre>I want to add [feature]. Before writing anything,
interview me. Ask one question at a time about:
users, edge cases, failure modes, tenant
boundaries and what's out of scope.

When you have enough, write a spec with:
goal, non-goals, API shape, data changes,
tests, and open questions.

Then split it into small slices, each one
shippable and testable on its own.</pre></div>
    </div>
  </div>
</section>

<section class="slide" data-part="2" aria-label="CLAUDE.md">
  <h2>CLAUDE.md: our standards in every repo</h2>
  <div class="body">
    <div class="row cn center">
      <ul class="notes">
        <li>Claude reads it at the start of every session, so everyone's Claude follows the same rules.</li>
        <li>Keep it short and specific to the project: commands, rules, definition of done.</li>
        <li>Every time you repeat an instruction, add it here instead.</li>
        <li>Commit it, and review changes to it like code.</li>
      </ul>
<pre class="code"><span class="c"># CLAUDE.md</span>
<span class="k">## Commands</span>
Tests: pytest -q        UI: pnpm test

<span class="k">## Non-negotiable</span>
- Every query is tenant-scoped. No cross-tenant paths.
- Read a file before referencing anything in it.
- Smallest change that solves the task.
  Don't touch unrelated code. Flag it instead.
- Tests in the same change. Never edit a test to pass.
- Ask before adding a dependency.
- No magic numbers. Named constants or config.
- Never swallow exceptions. Fail loudly and early.
- Safe to run twice. Log state changes and calls.

<span class="k">## Definition of done</span>
- Tests run locally. Paste the output.
- Docs updated if behaviour changed.
- List every file changed and why.</pre>
    </div>
  </div>
</section>

<section class="slide" data-part="2" aria-label="Our 20 rules">
  <h2>Our 20 rules, grouped</h2>
  <div class="body">
    <div class="rules">
      <div class="card"><h3>Write it clearly</h3><ol>
        <li><span>1</span>Explicitness over cleverness</li>
        <li><span>2</span>Boring over clever</li>
        <li><span>3</span>DRY: one home for each piece of business logic</li>
        <li><span>15</span>No hardcoded values or magic numbers</li>
        <li><span>18</span>No dead code, unused imports or unreachable branches</li>
      </ol></div>
      <div class="card"><h3>Structure it well</h3><ol>
        <li><span>4</span>Changes don't ripple across layers</li>
        <li><span>5</span>Side effects at the edges, pure business logic</li>
        <li><span>10</span>Can't test it in isolation? Fix the structure</li>
        <li><span>16</span>Smallest change that solves the problem</li>
        <li><span>17</span>Public interfaces stay backward compatible</li>
      </ol></div>
      <div class="card"><h3>Keep it safe</h3><ol>
        <li><span>6</span>Fail loudly, fail early</li>
        <li><span>8</span>Tenant isolation is a hard constraint</li>
        <li><span>14</span>Never assume a method, field or service exists</li>
        <li><span>19</span>Idempotent by default</li>
        <li><span>20</span>Log state changes and external calls</li>
      </ol></div>
      <div class="card"><h3>Ship it properly</h3><ol>
        <li><span>7</span>Don't assume, prove it</li>
        <li><span>9</span>Tests aren't optional under deadlines</li>
        <li><span>11</span>Local testing before every PR</li>
        <li><span>12</span>Docs are part of the work</li>
        <li><span>13</span>Don't change what you weren't asked to</li>
      </ol></div>
    </div>
  </div>
</section>

<section class="slide" data-part="2" aria-label="Invented APIs">
  <h2>The most common failure: things that don't exist</h2>
  <div class="body">
    <div class="row c2">
      <div>
        <span class="tag bad">Looks right, isn't</span>
<pre class="code">reserved = inventory_service.get_reserved_qty(
    tenant_id, style_id
)
<span class="c"># get_reserved_qty() was never defined.
# The name was a plausible guess.</span></pre>
        <p class="sm mt-s" style="color:var(--dk-muted)">Invented methods, fields, config keys and CLI flags read fine in review and fail at runtime.</p>
      </div>
      <div>
        <span class="tag good">Put this in the prompt</span>
        <div class="prompt"><div class="ph good">Prompt</div><pre>Before you use any function, class, field
or config key:
1. Open the file where it is defined.
2. Quote its signature in your reply.
3. If it doesn't exist, stop and tell me.
   Don't create it silently.</pre></div>
        <p class="sm mt-s" style="color:var(--dk-muted)">In review, search the codebase for every new symbol in the diff.</p>
      </div>
    </div>
  </div>
</section>

<section class="slide" data-part="2" aria-label="Only what was asked">
  <h2>Small slices, and only what was asked</h2>
  <div class="body">
    <div class="row c2">
      <div>
<pre class="code">Task: fix rounding in allocate_units()

allocation/core.py   +4  -2    <span class="s">the fix</span>
allocation/core.py   +38 -41   <span class="c">renamed variables</span>
utils/dates.py       +12 -3    <span class="c">unrelated cleanup</span>
pyproject.toml       +1  -1    <span class="c">bumped a dependency</span></pre>
        <p class="sm mt-s" style="color:var(--dk-muted)">One line of value, three sources of risk, and a diff nobody can review properly.</p>
      </div>
      <div>
        <div class="prompt"><div class="ph good">Prompt</div><pre>Change only what's needed to fix this.
If you notice other problems, list them
under "Flagged, not fixed" at the end.
Don't reformat, rename or upgrade
anything else.</pre></div>
        <p class="sm mt-s" style="color:var(--dk-muted)">Flagged issues become their own tickets. Public interface changes need explicit approval.</p>
      </div>
    </div>
  </div>
</section>

<section class="slide" data-part="2" aria-label="Tests">
  <h2>Tests that actually prove something</h2>
  <div class="body">
    <div class="row cn center">
      <ul class="notes">
        <li>For a bug, ask for a failing test first, then the fix.</li>
        <li>Every bug fix leaves a regression test behind.</li>
        <li>Never change a test to make it pass. Claude asks before modifying existing tests.</li>
        <li>Check the tests test behaviour, not that a mock returns what the mock was told to.</li>
        <li>Claude shows the test output. "Tests pass" without output doesn't count.</li>
      </ul>
<pre class="code"><span class="k">def</span> test_reorder_qty_is_never_negative():
    <span class="k">assert</span> reorder_qty(on_hand=50, target=30) == 0


<span class="k">def</span> test_on_hand_is_tenant_scoped(repo):
    repo.seed(tenant_id=<span class="s">"t1"</span>, style_id=<span class="s">"S1"</span>, on_hand=5)
    repo.seed(tenant_id=<span class="s">"t2"</span>, style_id=<span class="s">"S1"</span>, on_hand=500)

    <span class="k">assert</span> get_on_hand(
        repo, tenant_id=<span class="s">"t1"</span>, style_id=<span class="s">"S1"</span>
    ) == 5</pre>
    </div>
  </div>
</section>

<section class="slide" data-part="2" aria-label="Fail loudly">
  <h2>Fail loudly. Don't let Claude hide errors.</h2>
  <div class="body">
    <div class="row c2">
      <div>
        <span class="tag bad">Defensive code that hides bugs</span>
<pre class="code"><span class="k">try</span>:
    plan = load_plan(tenant_id, plan_id)
<span class="k">except</span> Exception:
    plan = {}  <span class="c"># carry on with empty plan</span></pre>
        <p class="sm mt-s" style="color:var(--dk-muted)">AI often adds broad try/except blocks to look robust. The result is wrong output and no error.</p>
      </div>
      <div>
        <span class="tag good">Explicit and early</span>
<pre class="code">plan = load_plan(tenant_id, plan_id)
<span class="k">if</span> plan <span class="k">is</span> None:
    <span class="k">raise</span> PlanNotFound(
        f<span class="s">"plan {plan_id} not found "</span>
        f<span class="s">"for tenant {tenant_id}"</span>
    )</pre>
        <p class="sm mt-s" style="color:var(--dk-muted)">Catch only what you can handle. Never return a default just to keep going.</p>
      </div>
    </div>
  </div>
</section>

<section class="slide" data-part="2" aria-label="Pure core">
  <h2>Pure core, I/O at the edges</h2>
  <div class="body">
    <div class="row cn center">
      <ul class="notes">
        <li>Business logic takes values and returns values. Easy to test, no mocks.</li>
        <li>Thresholds come from config, not literals.</li>
        <li>Writes use upserts or keys, so a retry doesn't double-apply.</li>
        <li>State changes and external calls are logged with tenant context.</li>
      </ul>
<pre class="code"><span class="c"># Pure: no I/O, no hidden state</span>
<span class="k">def</span> compute_replenishment(stock, policy) -&gt; int:
    target = policy.target_cover_days * stock.daily_rate
    <span class="k">return</span> max(target - stock.on_hand, 0)


<span class="c"># Edge: reads, logs, writes</span>
<span class="k">def</span> run_replenishment(tenant_id, style_id) -&gt; None:
    stock = stock_repo.get(tenant_id, style_id)
    policy = policy_repo.get(tenant_id)
    qty = compute_replenishment(stock, policy)
    logger.info(<span class="s">"replenishment computed"</span>, extra={
        <span class="s">"tenant_id"</span>: tenant_id, <span class="s">"qty"</span>: qty,
    })
    order_repo.upsert(tenant_id, style_id, qty)</pre>
    </div>
  </div>
</section>

<section class="slide" data-part="2" aria-label="Separate writing from checking">
  <h2>Separate writing from checking</h2>
  <p class="sub">The session that wrote the code is the worst one to review it. Review in a fresh context, one lens at a time.</p>
  <div class="body">
    <div class="lanes">
      <div class="card soft"><h3>Writer session</h3><p>Plans and implements one slice. Runs the tests.</p></div>
      <div class="arrow">&rarr;</div>
      <div class="card blue"><h3>Reviewer session, fresh context</h3><p>Reads the diff cold and reports issues with severity and location.</p>
        <div class="chips"><span>Correctness</span><span>Tenant isolation</span><span>Security</span><span>Performance</span><span>Simplicity</span></div>
      </div>
    </div>
    <div class="prompt mt"><div class="ph">Review prompt</div><pre>Review this diff as a senior engineer on this team. Check, in order: correctness, tenant isolation,
security, performance, simplicity. For each issue give severity, file and line, and a suggested fix.</pre></div>
  </div>
</section>

<section class="slide" data-part="2" aria-label="Context hygiene">
  <h2>Keep the context clean</h2>
  <div class="body">
    <div class="row c2 center">
      <div class="gauge">
        <div class="g"><b>Fresh</b><div class="track"><div style="width:25%;background:#10B981"></div></div></div>
        <div class="desc">one task, only the relevant files</div>
        <div class="g"><b>Working</b><div class="track"><div style="width:55%;background:var(--dk-accent-fill)"></div></div></div>
        <div class="desc">plan agreed, implementing a slice</div>
        <div class="g"><b>Cluttered</b><div class="track"><div style="width:95%;background:#F97316"></div></div></div>
        <div class="desc">old tasks, long logs, stale assumptions</div>
      </div>
      <ul class="notes">
        <li>One task per session. Clear the context when you switch.</li>
        <li>Clear between planning and building. The plan file carries over, the noise doesn't.</li>
        <li>Two failed attempts? Stop, re-plan or narrow the task.</li>
        <li>Read every command before approving it, especially migrations, force-push, deletes and CI changes.</li>
      </ul>
    </div>
  </div>
</section>

<section class="slide statement" data-part="2" aria-label="The formula">
  <h2 style="max-width:none">The difference is discipline, not tooling</h2>
  <div style="display:grid;gap:2.4cqw;margin-top:3cqw">
    <div class="formula">
      <span class="term">Rigorous design</span><span class="op">+</span>
      <span class="term">AI implementation</span><span class="op">+</span>
      <span class="term">Aggressive review</span><span class="op">+</span>
      <span class="term">Many iterations</span><span class="op">=</span>
      <span class="res">Quality at speed</span>
    </div>
    <div class="formula">
      <span class="term bad">No review</span><span class="op">+</span>
      <span class="term bad">First output accepted</span><span class="op">=</span>
      <span class="res bad">Tech debt at speed</span>
    </div>
  </div>
</section>

<section class="slide" data-part="2" aria-label="Pre-PR checklist">
  <h2>Before you raise the PR</h2>
  <div class="body">
    <ul class="checklist">
      <li>I can explain every line in this diff.</li>
      <li>Every new method, field and config key exists. I checked.</li>
      <li>Every data path is tenant-scoped.</li>
      <li>Tests were added and I saw them pass locally.</li>
      <li>Only the requested change is in the diff.</li>
      <li>No swallowed exceptions, magic numbers or dead code.</li>
      <li>Public interfaces are backward compatible, or the break is approved.</li>
      <li>Re-running the operation is safe.</li>
      <li>State changes and external calls are logged.</li>
      <li>Docs and the PR description are updated: why, how tested, risks, revert plan.</li>
    </ul>
  </div>
</section>

<!-- ============ PART 3 ============ -->
<section class="slide divider" data-part="3" data-tab="Beyond code" aria-label="Part 3">
  <div class="dv">
    <div class="pn">Part 3</div>
    <h2 class="hero">Beyond code</h2>
    <p class="meta">Everyone, 45 minutes</p>
    <ul class="covers">
      <li>Build the right thing first</li>
      <li>Simple, boring, proven</li>
      <li>Chat and Cowork in daily work</li>
      <li>QA with Claude Code</li>
    </ul>
  </div>
  <figure class="plate"><figcaption><b>Fig. 3</b>Every grey line is something we could build, and AI makes all of them cheap to start. The blue line is the one we chose on purpose: deciding what to build is now the scarce skill.</figcaption><img alt="Many faint paths from one origin, with a single blue path chosen" src="/images/blog/building-with-claude/fig-3.png"></figure>
</section>

<section class="slide" data-part="3" aria-label="Deciding what to build">
  <h2>Building got cheap. Deciding what to build didn't.</h2>
  <div class="body">
    <div class="row cn center">
      <svg class="dia" viewBox="0 0 600 320" role="img" aria-label="Conceptual chart: code written rises steeply over time while value delivered stays flat">
        <line x1="50" y1="20" x2="50" y2="280" stroke-width="2" style="stroke:var(--dk-ink)"/>
        <line x1="50" y1="280" x2="580" y2="280" stroke-width="2" style="stroke:var(--dk-ink)"/>
        <path d="M50,255 C220,250 330,200 470,90 S560,40 570,35" stroke-width="4" fill="none" stroke-linecap="round" style="stroke:var(--dk-accent)"/>
        <path d="M50,235 C200,228 380,232 570,224" stroke-width="4" fill="none" stroke-dasharray="2 10" stroke-linecap="round" style="stroke:var(--dk-rule)"/>
        <text x="455" y="28" text-anchor="end" font-size="17" font-weight="650" style="fill:var(--dk-accent)">Code written</text>
        <text x="420" y="210" font-size="17" font-weight="650" style="fill:var(--dk-muted)">Value delivered</text>
        <text class="s" x="575" y="305" text-anchor="end">time</text>
        <text class="s" x="58" y="305">conceptual</text>
      </svg>
      <div>
        <ul class="notes">
          <li>When anyone can generate code, features alone don't stand out. Knowing what to build and why does.</li>
          <li>Ask "Why are we building this?" before the first prompt.</li>
          <li>First build the right thing. Then build it right.</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="slide" data-part="3" aria-label="Pragmatic choices">
  <h2>Pragmatic beats theoretically perfect</h2>
  <div class="body">
    <div class="row c3">
      <div class="card"><span class="tag info">Simplest first</span><p class="big">What's the simplest thing we could ship?</p><p class="mt-s">Ship that. Optimise after it's delivered and used, not before.</p></div>
      <div class="card"><span class="tag info">Boring tech</span><p class="big">Proven over shiny</p><p class="mt-s">Claude makes adding a new library easy. That doesn't make it a good idea.</p></div>
      <div class="card"><span class="tag info">Prototype to decide</span><p class="big">A PoC now takes hours</p><p class="mt-s">Use one to test feasibility before you promise a date or a design.</p></div>
    </div>
    <p class="callout">Every decision is a trade-off. Bring the business the pros and cons in their language, not a flat yes or no.</p>
  </div>
</section>

<section class="slide" data-part="3" aria-label="Chat and Cowork">
  <h2>Chat and Cowork in daily work</h2>
  <p class="sub">Same data rules apply: redact first, and treat every output as a draft.</p>
  <div class="body">
    <div class="row c3" style="gap:1.4cqw">
      <div class="card"><h3>Design docs and ADRs</h3><p>"Turn these notes into an ADR: context, options, decision, consequences. List what's missing."</p></div>
      <div class="card"><h3>Spec review</h3><p>"Find gaps, edge cases and conflicting requirements. Ask me questions instead of assuming."</p></div>
      <div class="card"><h3>Ticket breakdown</h3><p>"Split this spec into tickets with acceptance criteria, boundaries and test cases."</p></div>
      <div class="card"><h3>Log and incident analysis</h3><p>"From these redacted logs, build a timeline and the most likely causes, ranked."</p></div>
      <div class="card"><h3>Test plans</h3><p>"From this spec, write a test plan: happy path, boundaries, failures, tenant isolation."</p></div>
      <div class="card"><h3>PR descriptions</h3><p>"From this diff, write a PR description: why, how it was tested, risks, revert plan."</p></div>
    </div>
  </div>
</section>

<section class="slide" data-part="3" aria-label="QA with Claude Code">
  <h2>QA with Claude Code</h2>
  <div class="body">
    <div class="row cn center">
      <ul class="notes">
        <li>Automation lives in the same repos, under the same review rules as production code.</li>
        <li>Synthetic data only. Fixtures come from factories, never from client exports.</li>
        <li>Every feature gets a tenant isolation test as standard.</li>
        <li>Every bug report comes with a failing test that reproduces it.</li>
        <li>An AI first-look review on each PR catches the basics: committed secrets, missing tests, unlinked tickets.</li>
      </ul>
      <div class="prompt"><div class="ph">Prompt</div><pre>From this spec, write test cases for
allocation caps:
- happy path
- boundaries: 0, max, max + 1
- invalid and missing input
- one test proving tenant A cannot
  read or change tenant B's data

Use only synthetic data from
tests/factories.py.
Run the suite and show me the output.</pre></div>
    </div>
  </div>
</section>

<!-- ============ PART 4 ============ -->
<section class="slide divider" data-part="4" data-tab="Multiply" aria-label="Part 4">
  <div class="dv">
    <div class="pn">Part 4</div>
    <h2 class="hero">Multiply what works</h2>
    <p class="meta">Everyone, 30 minutes, then every two weeks</p>
    <ul class="covers">
      <li>Why multiplying beats heroics</li>
      <li>Turn mistakes into rules</li>
      <li>Share in the open</li>
      <li>Measure what matters</li>
      <li>Do and don't</li>
    </ul>
  </div>
  <figure class="plate"><figcaption><b>Fig. 4</b>One person's good habit spreads to five people, then twenty-five, then a hundred and twenty-five. Sharing what works beats being the hero who does it alone.</figcaption><img alt="One point branching to five, twenty-five and one hundred twenty-five" src="/images/blog/building-with-claude/fig-4.png"></figure>
</section>

<section class="slide" data-part="4" aria-label="Multiplier">
  <h2>Make five people 20% better</h2>
  <p class="sub">Your best workflow is worth more shared than kept. That goes for prompts, CLAUDE.md lines and review habits.</p>
  <div class="body">
    <div class="mult">
      <div>
        <div class="tiles"><div class="tile"><div class="base"></div><div class="up"></div></div></div>
        <div class="total">You improve: +20%</div>
      </div>
      <div>
        <div class="tiles">
          <div class="tile"><div class="base"></div><div class="up"></div></div>
          <div class="tile"><div class="base"></div><div class="up"></div></div>
          <div class="tile"><div class="base"></div><div class="up"></div></div>
          <div class="tile"><div class="base"></div><div class="up"></div></div>
          <div class="tile"><div class="base"></div><div class="up"></div></div>
        </div>
        <div class="total blue">Five people improve: +100% team capacity</div>
      </div>
    </div>
  </div>
</section>

<section class="slide" data-part="4" aria-label="Turn mistakes into rules">
  <h2>Turn every mistake into a rule</h2>
  <div class="body">
    <div class="row cn center">
      <svg class="dia" viewBox="0 0 600 460" role="img" aria-label="Loop: something goes wrong, fix the process not the person, ask if Claude could catch it next time, encode it">
        <defs><marker id="m5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--dk-accent)"/></marker></defs>
        <path d="M412,62 Q470,70 470,186" class="lb" marker-end="url(#m5)"/>
        <path d="M470,272 Q470,395 414,400" class="lb" marker-end="url(#m5)"/>
        <path d="M188,400 Q130,395 130,274" class="lb" marker-end="url(#m5)"/>
        <path d="M130,188 Q130,70 186,62" class="lb" marker-end="url(#m5)"/>
        <g text-anchor="middle">
          <rect x="190" y="24" width="220" height="76" rx="14" style="fill:var(--dk-dont-soft);stroke:var(--dk-dont-line)"/>
          <text class="t" x="300" y="56">Something</text><text class="t" x="300" y="82">goes wrong</text>
          <rect x="360" y="192" width="220" height="76" rx="14" style="fill:var(--dk-page);stroke:var(--dk-line)"/>
          <text class="t" x="470" y="224">Fix the process,</text><text class="t" x="470" y="250">not the person</text>
          <rect x="190" y="362" width="220" height="76" rx="14" style="fill:var(--dk-accent-soft);stroke:var(--dk-accent-line)"/>
          <text class="t" x="300" y="394">Could Claude catch</text><text class="t" x="300" y="420">this next time?</text>
          <rect x="20" y="192" width="220" height="76" rx="14" style="fill:var(--dk-accent-fill)"/>
          <text class="tw" x="130" y="224">Encode it</text><text class="sw" x="130" y="250">CLAUDE.md, test, lint rule</text>
        </g>
      </svg>
      <ul class="notes">
        <li>No blame. An AI-introduced bug passed through a prompt, a review and our tests. Fix the step that let it through.</li>
        <li>Give feedback on mistakes privately. Share the lesson publicly.</li>
        <li>Each encoded rule means one less thing a human has to catch.</li>
      </ul>
    </div>
  </div>
</section>

<section class="slide" data-part="4" aria-label="Share in the open">
  <h2>Create a space and seed it</h2>
  <p class="sub">Don't wait for someone to assign it. Start sharing useful things and let it compound.</p>
  <div class="body">
    <div class="row c3">
      <div class="card"><span class="tag info">Daily</span><p class="big">Team AI channel</p><p class="mt-s">Post one prompt, skill or workflow that saved you time this week.</p></div>
      <div class="card"><span class="tag info">Every two weeks</span><p class="big">Show-and-tell</p><p class="mt-s">15 minutes. One person, one real workflow, one lesson.</p></div>
      <div class="card"><span class="tag info">Ongoing</span><p class="big">Shared library</p><p class="mt-s">Reusable prompts, review workflows and CLAUDE.md snippets in one repo.</p></div>
    </div>
    <p class="callout">Don't just flag a problem. Bring the data, the cost, and an offer to help fix it.</p>
  </div>
</section>

<section class="slide" data-part="4" aria-label="Measure what matters">
  <h2>Measure what matters, then work from red</h2>
  <p class="sub">Each metric gets thresholds we agree as a team. Every month we review the trend and start with whatever is red.</p>
  <div class="body">
    <table class="score">
      <thead><tr><th>Metric</th><th>What it tells us</th><th>Thresholds</th></tr></thead>
      <tbody>
        <tr><td>Sessions that end in a merged PR</td><td>Are we shipping, or just exploring?</td><td><span class="dots"><span class="dot g"></span><span class="dot y"></span><span class="dot r"></span></span></td></tr>
        <tr><td>People using more than one surface</td><td>Is Claude helping beyond code?</td><td><span class="dots"><span class="dot g"></span><span class="dot y"></span><span class="dot r"></span></span></td></tr>
        <tr><td>Regression tests per bug fix</td><td>Are we learning from mistakes?</td><td><span class="dots"><span class="dot g"></span><span class="dot y"></span><span class="dot r"></span></span></td></tr>
        <tr><td>Review comments on AI-introduced issues</td><td>Is our process catching problems early?</td><td><span class="dots"><span class="dot g"></span><span class="dot y"></span><span class="dot r"></span></span></td></tr>
        <tr><td>Rules added to CLAUDE.md</td><td>Are lessons being encoded?</td><td><span class="dots"><span class="dot g"></span><span class="dot y"></span><span class="dot r"></span></span></td></tr>
      </tbody>
    </table>
  </div>
</section>

<section class="slide" data-part="4" aria-label="Do and don't">
  <h2>Do and don't</h2>
  <div class="dd">
    <div class="do">
      <h3>Do</h3>
      <ul>
        <li>Plan first and keep slices small</li>
        <li>Write tests with the code and run them locally</li>
        <li>Review in a fresh context before the PR</li>
        <li>Scope every query to a tenant</li>
        <li>Encode every repeated instruction</li>
        <li>Share what works</li>
      </ul>
    </div>
    <div class="dont">
      <h3>Don't</h3>
      <ul>
        <li>Paste client data, secrets or personal data</li>
        <li>Ship the first output or code you can't explain</li>
        <li>Let it change things you didn't ask for</li>
        <li>Accept methods or fields you haven't verified</li>
        <li>Change a test to make it pass</li>
        <li>Blame a person for a process gap</li>
      </ul>
    </div>
  </div>
</section>

<section class="slide" data-part="4" aria-label="This week">
  <h2>This week</h2>
  <div class="body">
    <div class="row c3">
      <div class="card blue"><span class="tag info">1</span><p class="big">Add CLAUDE.md</p><p class="mt-s">To every repo you own, starting from the template in Part 2.</p></div>
      <div class="card blue"><span class="tag info">2</span><p class="big">Plan first</p><p class="mt-s">Use the plan-first prompt on your next task, then review in a fresh session.</p></div>
      <div class="card blue"><span class="tag info">3</span><p class="big">Share one thing</p><p class="mt-s">Post one prompt or workflow that worked in the team channel.</p></div>
    </div>
    <p class="xs" style="margin-top:3cqw">Credit to the Engineering Leadership newsletter, whose writing on AI-assisted engineering, pragmatic engineering and multiplier leadership informed much of this series.</p>
  </div>
</section>
`,excerpt:"A four-part training series I ran for my team on building with Claude: guardrails, the Claude Code workflow, deciding what to build, and multiplying what works."},o={frontmatter:{title:"The Era of Personal Software Is Here",date:"2026-10-20",description:"I used Claude to take my TV's home screen apart and rebuild it for my family: no ads, our apps in one row, our photos and the day's prayer times. What changed, how to do it yourself, and the supply-chain risk that comes with it.",tags:["ai","personal-software","android-tv","open-source","security"]},html:`<!--
Layout pieces (.ps-*) are styled in src/index.css. The before/after slider ([data-compare]) and the copy
button ([data-copy]) are wired up by MarkdownContent. Screenshots live in
public/images/blog/personal-software-tv/ and are taken from the TV itself. The page's only h1 is the post title.
-->
<p class="ps-dek">I used Claude to take my TV's home screen apart and rebuild it for my family: no ads, our apps in one row, photos we chose, and the day's prayer times. This is what changed, how you can do the same, and the risk that comes with it.</p>
<figure class="ps-stage not-prose">
<div class="ps-compare" data-compare>
<img src="/images/blog/personal-software-tv/prayer-home.jpg" alt="After: a mosque photo as wallpaper, the next prayer time in a gold pill under the clock, and eight apps in one row" width="1280" height="720" />
<div class="ps-compare-before"><img src="/images/blog/personal-software-tv/before-stock-home.jpg" alt="Before: the stock Google TV home with a sponsored Hero ad, a Sponsored by JioHotstar row and a PatchWall tile" width="1280" height="720" /></div>
<div class="ps-compare-divider" aria-hidden="true"></div>
<input type="range" min="0" max="100" value="50" aria-label="Drag to compare the TV home screen before and after" />
<div class="ps-compare-knob" aria-hidden="true">⟷</div>
<span class="ps-compare-tag ps-left">Before</span>
<span class="ps-compare-tag ps-right">After</span>
</div>
<figcaption>My Xiaomi MiTV-AXSO2 (Android TV 9). Drag across the screen to compare. Both are screenshots taken from the TV.</figcaption>
</figure>
<p>My TV opened with an advert. Before I could get to Netflix, there was a sponsored banner for a motorbike, a row “Sponsored by JioHotstar”, and a Xiaomi home screen I never asked for. The TV is a small Android computer, and like most computers it does what its maker wants first.</p>
<p>So I opened Claude Code on my laptop and asked it to help me take back the home screen. It found the TV on my Wi-Fi, made a backup, and switched off the parts I didn’t want. Then we built the parts I did want. It took one evening and one morning, and I wrote almost none of the code myself.</p>
<p class="ps-eyebrow">What we changed, in order</p>
<h2>From a billboard to our TV</h2>
<ol class="ps-steps not-prose">
<li><h3>Found the TV and backed it up</h3><p>With USB debugging on, the TV accepts commands over Wi-Fi. Claude found it, saved the list of apps and every setting, and wrote a restore script before touching anything.</p></li>
<li><h3>Switched off 33 apps</h3><p>Tracking, sponsored rows, Xiaomi's PatchWall, partner auto-installs and apps nobody used. They are disabled, not deleted: one command brings them all back.</p></li>
<li><h3>Replaced the home screen</h3><p>I copied the open-source <a href="https://github.com/Gathin23/cleanyourtv">cleanyourtv</a> launcher and set it up with our eight apps in one row. You can do the same, copy <a href="https://github.com/Alafazam/cleanyourtv">mine</a>, or just ask Claude to build a launcher the way you want it.</p></li>
<li><h3>Added wallpapers that change</h3><p>A folder of photos changes behind Home every 30 minutes. A Wallpaper tile opens a picker, so anyone can choose one with the remote.</p></li>
<li><h3>Added prayer times</h3><p>Calculated on the TV, with no internet: Bengaluru, Karachi method, Hanafi Asr, plus the Hijri date. The current and next prayer sit under the clock, a tile opens the full day, and the screensaver shows it over the photos.</p></li>
</ol>
<figure class="ps-wallstrip not-prose">
<div class="ps-wallstrip-grid">
<img src="/images/blog/personal-software-tv/wallpaper-01.jpg" alt="Home with a white mosque, gold domes and a crescent moon as the wallpaper" width="1280" height="720" loading="lazy" />
<img src="/images/blog/personal-software-tv/wallpaper-04.jpg" alt="Home with minarets against a red sunset as the wallpaper" width="1280" height="720" loading="lazy" />
<img src="/images/blog/personal-software-tv/wallpaper-09.jpg" alt="Home with the Sheikh Zayed Grand Mosque reflected in water at dusk as the wallpaper" width="1280" height="720" loading="lazy" />
<img src="/images/blog/personal-software-tv/wallpaper-12.jpg" alt="Home with the Kaaba and pilgrims as the wallpaper" width="1280" height="720" loading="lazy" />
</div>
<figcaption>The same home screen with four of our wallpapers. A new one appears every 30 minutes, or you pick one from the Wallpaper tile.</figcaption>
</figure>
<div class="ps-stats not-prose">
<div class="ps-stat"><b>33</b><span>apps switched off, all reversible</span></div>
<div class="ps-stat"><b>550 → 850</b><span>MB of free memory</span></div>
<div class="ps-stat"><b>0</b><span>sponsored rows or adverts</span></div>
</div>
<div class="ps-gallery not-prose">
<figure><img src="/images/blog/personal-software-tv/picker.jpg" alt="Wallpaper picker with twelve mosque photos, the current one marked Now" width="1280" height="720" loading="lazy" /><figcaption>The Wallpaper picker. The photos are free ones from Unsplash.</figcaption></figure>
<figure><img src="/images/blog/personal-software-tv/prayer-page.jpg" alt="Prayer Times page with six cards from Fajr to Isha, Dhuhr highlighted in green" width="1280" height="720" loading="lazy" /><figcaption>The Prayer Times page, opened from its own tile.</figcaption></figure>
<figure><img src="/images/blog/personal-software-tv/prayer-screensaver.jpg" alt="Screensaver with the clock and six prayer cards over a photo of minarets at sunset" width="1280" height="720" loading="lazy" /><figcaption>The screensaver: clock, prayer times and our photos.</figcaption></figure>
<figure><img src="/images/blog/personal-software-tv/tile.jpg" alt="The app grid under the dock with the Wallpaper tile at the end" width="1280" height="720" loading="lazy" /><figcaption>The rest of the apps, with the Wallpaper tile at the end.</figcaption></figure>
</div>
<p class="ps-eyebrow">Why this matters</p>
<h2>Software for an audience of one</h2>
<p>For most of my life, software was something you bought. If a product did something you didn’t like, you lived with it, complained, or switched brands. Changing it meant being a developer with a free weekend.</p>
<p>That has changed. I didn’t need to know how Android launchers work, or which of 124 packages on my TV were safe to switch off. Claude read the TV’s logs, ran the commands, built the app, installed it, and checked every step with a screenshot from the TV. My job was to decide: keep the voice remote, keep casting, show these eight apps, use these photos, calculate prayer times the way my family prays.</p>
<p>I think this is what personal software means. You can open almost anything you own, keep the parts you like, and replace the rest with something made only for you. Nobody would sell a launcher with Hanafi Asr times for Bengaluru on the screensaver. Now nobody has to.</p>
<p class="ps-eyebrow">Do it yourself</p>
<h2>All you need is this</h2>
<p>You need an Android TV or Google TV, a computer on the same Wi-Fi, and <a href="https://claude.com/claude-code">Claude Code</a>.</p>
<ol class="ps-steps not-prose">
<li><h3>Turn on USB debugging on the TV</h3><p>Settings → Device Preferences → About → press OK on <b>Build</b> seven times. Go back to Developer options and turn on <b>USB debugging</b>.</p></li>
<li><h3>Open Claude Code in an empty folder</h3><p>On your computer, on the same Wi-Fi as the TV.</p></li>
<li><h3>Paste the prompt below, with your TV model</h3><p>Claude asks before it changes anything you might use.</p></li>
<li><h3>Accept "Allow USB debugging?" on the TV</h3><p>Tick "Always allow from this computer", then answer Claude's questions about your apps.</p></li>
<li><h3>Turn USB debugging off when you're done</h3><p>The new home screen keeps working without it.</p></li>
</ol>
<div class="ps-prompt not-prose">
<button type="button" class="ps-copy" data-copy="ps-prompt-text">Copy</button>
<pre id="ps-prompt-text">My TV model is: &lt;YOUR TV MODEL&gt;. It is on my Wi-Fi with USB debugging on.
Find it over ADB, back up its app list and settings, and write a restore script first.
List the installed apps, and ask me before you switch off anything I might use.
Disable the maker's tracking, sponsored rows and preinstalled apps I don't want:
only disable, never uninstall system apps.
Then build me a small, simple home screen with my favourite apps in one row,
and check every change with a screenshot from the TV.</pre>
</div>
<p>You don’t have to copy anyone’s launcher: Claude can build one from scratch with exactly the settings you want. Starting from <a href="https://github.com/Gathin23/cleanyourtv">cleanyourtv</a> and its <a href="https://github.com/Gathin23/cleanyourtv/blob/main/PROMPT.md">full prompt</a> gets you more for free: bug fixes, translations, and app lists that other people have tested on 66 TV models.</p>
<p class="ps-eyebrow">Everyone is doing this</p>
<h2>763 forks in three days</h2>
<p>The cleanyourtv repo went up on 17 October 2026. Three days later it had about 6,400 stars and 763 forks. When I looked through the forks, 92 of them had changed the launcher in their own way:</p>
<ul class="ps-forks not-prose">
<li><a href="https://github.com/manojm321/jain-tv-launcher">manojm321/jain-tv-launcher</a><span>A Jain calendar on the home screen, calculated offline</span></li>
<li><a href="https://github.com/majnioui/CleanXiaomiTV">majnioui/CleanXiaomiTV</a><span>A Prayer Times screen with the Hijri date, the idea behind mine</span></li>
<li><a href="https://github.com/gpokhark/cleanyourtv">gpokhark/cleanyourtv</a><span>A "Last on YouTube" row of recently watched videos</span></li>
<li><a href="https://github.com/wevbert/cleanyourtv">wevbert/cleanyourtv</a><span>A Netflix data limiter and a PlayStation tile</span></li>
<li><a href="https://github.com/briansilah/tv-vibehack">briansilah/tv-vibehack</a><span>A frosted "liquid glass" dock with cover art</span></li>
<li><a href="https://github.com/amineio/google-tv-apps">amineio/google-tv-apps</a><span>A bedtime clock with viewing limits for kids</span></li>
</ul>
<p>Each one is somebody’s TV, made for their house. That is the part I find exciting.</p>
<p class="ps-eyebrow">The catch</p>
<h2>The same superpower works for attackers</h2>
<p>AI made it cheap to fork a project, change it and send the change back. That is why one small repo has hundreds of forks and a steady stream of contributions. It also makes the supply chain wider than anyone can read.</p>
<p>The home screen is the first app your TV runs, every time. Mine can read the photos folder and knows which Wi-Fi it’s on. If someone slips harmful code into a popular repo, everyone who pulls the latest version and installs it puts that code on their TV. I merged 83 commits from the original repo without reading every line before I stopped to think about this.</p>
<div class="ps-risk not-prose">
<h3>What I do now</h3>
<ul>
<li><b>Build from my own fork.</b> Nothing updates on its own; the TV only changes when I build and install.</li>
<li><b>Don't sync blindly.</b> If I want something new from the original, I read that change, or ask Claude to review it, and copy only that part.</li>
<li><b>Check permissions.</b> My launcher has no internet permission, so it can't send data out by itself.</li>
<li><b>Keep changes small.</b> A focused change is easy to read; a big merge is not.</li>
<li><b>Close the door afterwards.</b> USB debugging goes off when I'm done.</li>
</ul>
</div>
<p class="ps-eyebrow">Credits</p>
<h2>Built on other people’s work</h2>
<p>The launcher, the prompt and the tools come from <a href="https://github.com/Gathin23/cleanyourtv">cleanyourtv</a> by Gathin (MIT licence). The prayer-times screen was inspired by <a href="https://github.com/majnioui/CleanXiaomiTV">CleanXiaomiTV</a> by majnioui. The wallpapers are free photos from <a href="https://unsplash.com">Unsplash</a>; the photographers are listed in my fork’s notes.</p>
<p>My changes are open source at <a href="https://github.com/Alafazam/cleanyourtv">github.com/Alafazam/cleanyourtv</a>. I sent back what fit the original: my TV’s app list, a <a href="https://github.com/Gathin23/cleanyourtv/pull/204">showcase entry</a> (merged) and a <a href="https://github.com/Gathin23/cleanyourtv/issues/207">bug report</a>.</p>
`,excerpt:"I used Claude to take my TV's home screen apart and rebuild it for my family: no ads, our apps in one row, our photos and the day's prayer times. What changed, how to do it yourself, and the supply-chain risk that comes with it."},r=null,l={frontmatter:{title:"15 Must-Have GNOME Extensions for Anyone Switching to Linux",date:"2026-10-06",description:"Moving to Ubuntu, Fedora or any GNOME-based distro? These 15 extensions fill the gaps on day one — with a bias toward making Linux feel like a Mac.",tags:["linux","gnome","productivity","macos"]},html:`<p>Switching to a GNOME-based distro — Ubuntu, Fedora, Pop!_OS, Debian — from Windows or macOS? Stock GNOME is clean and fast, but within an hour you’ll reach for something that isn’t there: a clipboard history, snap layouts, a hot corner that shows your windows, dark mode that follows the sun.</p>
<p>These 15 extensions fill those gaps. The list leans toward a <strong>Mac-like feel</strong>, because I use a Mac at work and wanted my Linux machine to work the same way. I could have installed Zorin OS, which ships a Mac-style layout out of the box, but I went with Ubuntu for its faster updates and much bigger community. A handful of extensions closes the gap anyway.</p>
<div class="story-lede">
<p class="story-lede-label">Before the list: try Handy</p>
<p>If you install one app (not an extension) on Linux, make it <a href="https://github.com/cjpais/handy">Handy</a> — free, open-source voice-to-text that runs entirely offline. Press a shortcut, talk, and the text lands in whatever app you're typing in.</p>
<p class="story-lede-turn">This whole post was dictated with Handy.</p>
</div>
<h2>TL;DR</h2>
<table>
<thead>
<tr>
<th>#</th>
<th>Extension</th>
<th>What it does</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td><a href="https://extensions.gnome.org/extension/19/user-themes/">User Themes</a></td>
<td>Load a custom shell theme (e.g. a macOS look)</td>
</tr>
<tr>
<td>2</td>
<td><a href="https://extensions.gnome.org/extension/4451/logo-menu/">Logo Menu</a></td>
<td>Apple-style menu in the top-left corner</td>
</tr>
<tr>
<td>3</td>
<td><a href="https://extensions.gnome.org/extension/1708/transparent-top-bar/">Transparent Top Bar</a></td>
<td>See-through top bar until a window touches it</td>
</tr>
<tr>
<td>4</td>
<td><a href="https://extensions.gnome.org/extension/4105/notification-banner-position/">Notification Banner Position</a></td>
<td>Notifications in the top-right, like macOS</td>
</tr>
<tr>
<td>5</td>
<td><a href="https://extensions.gnome.org/extension/2236/night-theme-switcher/">Night Theme Switcher</a></td>
<td>Light by day, dark by night, automatically</td>
</tr>
<tr>
<td>6</td>
<td><a href="https://extensions.gnome.org/extension/7065/tiling-shell/">Tiling Shell</a></td>
<td>Snap layouts, like Rectangle or Magnet</td>
</tr>
<tr>
<td>7</td>
<td><a href="https://extensions.gnome.org/extension/4412/advanced-alttab-window-switcher/">AATWS</a></td>
<td>A far better Alt+Tab, with search</td>
</tr>
<tr>
<td>8</td>
<td><a href="https://extensions.gnome.org/extension/4167/custom-hot-corners-extended/">Custom Hot Corners – Extended</a></td>
<td>Any action on any screen corner</td>
</tr>
<tr>
<td>9</td>
<td><a href="https://extensions.gnome.org/extension/5090/space-bar/">Space Bar</a></td>
<td>Named workspaces in the top bar</td>
</tr>
<tr>
<td>10</td>
<td><a href="https://extensions.gnome.org/extension/779/clipboard-indicator/">Clipboard Indicator</a></td>
<td>Clipboard history, like Maccy</td>
</tr>
<tr>
<td>11</td>
<td><a href="https://extensions.gnome.org/extension/517/caffeine/">Caffeine</a></td>
<td>Keep the screen awake on demand</td>
</tr>
<tr>
<td>12</td>
<td><a href="https://extensions.gnome.org/extension/1460/vitals/">Vitals</a></td>
<td>CPU, temperature and RAM in the top bar</td>
</tr>
<tr>
<td>13</td>
<td><a href="https://extensions.gnome.org/extension/1714/ssh-search-provider-reborn/">SSH Search Provider Reborn</a></td>
<td>Type a host name, land in an SSH session</td>
</tr>
<tr>
<td>14</td>
<td><a href="https://extensions.gnome.org/extension/1319/gsconnect/">GSConnect</a></td>
<td>Phone ↔ PC: clipboard, files, notifications</td>
</tr>
<tr>
<td>15</td>
<td><a href="https://extensions.gnome.org/extension/3843/just-perfection/">Just Perfection</a></td>
<td>Tweak the shell and speed up animations</td>
</tr>
</tbody>
</table>
<h2>How to install them</h2>
<p>Install <strong>Extension Manager</strong>, search for the name, click Install. On Ubuntu it’s <code>sudo apt install gnome-shell-extension-manager</code>; on Fedora and everywhere else, get it from Flathub (<code>flatpak install flathub com.mattjakeman.ExtensionManager</code>). Each name above also links to its page on <a href="https://extensions.gnome.org">extensions.gnome.org</a>.</p>
<h2>Make it look and behave like macOS</h2>
<p><strong>1. <a href="https://extensions.gnome.org/extension/19/user-themes/">User Themes</a></strong> — lets GNOME Shell load a custom theme. Pair it with the <a href="https://github.com/vinceliuice/WhiteSur-gtk-theme">WhiteSur</a> macOS theme for the top bar, menus and app windows. On older hardware, pick the solid (non-transparent) variant.</p>
<p><strong>2. <a href="https://extensions.gnome.org/extension/4451/logo-menu/">Logo Menu</a></strong> — an Apple-style menu in the top-left corner: About My System, Terminal, Force Quit App, Sleep, Restart, Log Out. Muscle memory, restored.</p>
<figure class="shot">
<img src="/images/blog/gnome-extensions/logo-menu.webp" alt="Logo Menu open from the top-left corner, showing About My System, Terminal, Force Quit App and Log Out" loading="lazy" />
<figcaption>Logo Menu. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>
<p><strong>3. <a href="https://extensions.gnome.org/extension/1708/transparent-top-bar/">Transparent Top Bar</a></strong> — the top bar is see-through on an empty desktop and turns solid the moment a window touches it, just like the macOS menu bar. It’s a plain tint, not blur, so it costs almost nothing.</p>
<p><strong>4. <a href="https://extensions.gnome.org/extension/4105/notification-banner-position/">Notification Banner Position</a></strong> — GNOME shows notifications at the top-center; this moves them to the top-right, where Mac eyes look for them. Hide its extra top-bar icon in the settings.</p>
<figure class="shot">
<img src="/images/blog/gnome-extensions/notification-banner-position.webp" alt="A notification banner in the top-right corner with the position menu open" loading="lazy" />
<figcaption>Notification Banner Position. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>
<p><strong>5. <a href="https://extensions.gnome.org/extension/2236/night-theme-switcher/">Night Theme Switcher</a></strong> — the equivalent of macOS “Auto” appearance: light theme at sunrise, dark at sunset. It can also run your own commands at each switch, so third-party themes like WhiteSur flip too.</p>
<figure class="shot">
<img src="/images/blog/gnome-extensions/night-theme-switcher.webp" alt="Night Theme Switcher settings with Day and Night tabs, accent color and background" loading="lazy" />
<figcaption>Night Theme Switcher. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>
<h2>Windows and workspaces</h2>
<p><strong>6. <a href="https://extensions.gnome.org/extension/7065/tiling-shell/">Tiling Shell</a></strong> — Rectangle/Magnet-style snap layouts: drag a window and drop it into a zone, or build your own layouts. Two gotchas on Ubuntu: turn off the built-in Tiling Assistant (the two fight over edge snapping), and turn off Tiling Shell’s own Alt+Tab override, or it clashes with the next extension.</p>
<figure class="shot">
<img src="/images/blog/gnome-extensions/tiling-shell.webp" alt="Tiling Shell features: tiling system, snap assistant, layout editor and multiple layouts" loading="lazy" />
<figcaption>Tiling Shell. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>
<p><strong>7. <a href="https://extensions.gnome.org/extension/4412/advanced-alttab-window-switcher/">AATWS — Advanced Alt-Tab Window Switcher</a></strong> — a much better Alt+Tab: type to filter, group by app, preview windows. It can also be triggered from a hot corner (see the next one).</p>
<figure class="shot">
<img src="/images/blog/gnome-extensions/aatws.webp" alt="AATWS switcher showing window thumbnails with a search field" loading="lazy" />
<figcaption>AATWS. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>
<p><strong>8. <a href="https://extensions.gnome.org/extension/4167/custom-hot-corners-extended/">Custom Hot Corners — Extended</a></strong> — put any action on any corner. Mine: top-left opens the overview, top-right opens the AATWS switcher grouped by app. That top-right corner is the closest thing to Mission Control I’ve found.</p>
<figure class="shot">
<img src="/images/blog/gnome-extensions/custom-hot-corners.webp" alt="Custom Hot Corners Extended settings listing actions per corner" loading="lazy" />
<figcaption>Custom Hot Corners – Extended. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>
<p><strong>9. <a href="https://extensions.gnome.org/extension/5090/space-bar/">Space Bar</a></strong> — replaces the “Activities” button with your workspaces, by name. Right-click to rename. “Mail · Code · Docs” beats remembering which number is which.</p>
<figure class="shot">
<img src="/images/blog/gnome-extensions/space-bar.webp" alt="Space Bar showing named workspaces Main and Dev in the top bar, with its settings" loading="lazy" />
<figcaption>Space Bar. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>
<h2>Small utilities you’ll miss within an hour</h2>
<p><strong>10. <a href="https://extensions.gnome.org/extension/779/clipboard-indicator/">Clipboard Indicator</a></strong> — the Maccy replacement. Set a shortcut (I use Ctrl+Shift+H), turn on “open at cursor” and “paste on select”, and the history pops up at the mouse and pastes straight into the app.</p>
<figure class="shot">
<img src="/images/blog/gnome-extensions/clipboard-indicator.webp" alt="Clipboard Indicator menu with search, clipboard history and private mode" loading="lazy" />
<figcaption>Clipboard Indicator. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>
<p><strong>11. <a href="https://extensions.gnome.org/extension/517/caffeine/">Caffeine</a></strong> — Amphetamine for Linux. A Quick Settings toggle that stops the screen from sleeping during long reads, downloads or presentations.</p>
<p><strong>12. <a href="https://extensions.gnome.org/extension/1460/vitals/">Vitals</a></strong> — CPU, temperature, RAM and network speed in the top bar. Pick only the two or three numbers you care about.</p>
<figure class="shot">
<img src="/images/blog/gnome-extensions/vitals.webp" alt="Vitals readings for CPU and memory in the top bar" loading="lazy" />
<figcaption>Vitals. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>
<p><strong>13. <a href="https://extensions.gnome.org/extension/1714/ssh-search-provider-reborn/">SSH Search Provider Reborn</a></strong> — press Super, type a host from <code>~/.ssh/config</code>, hit Enter, and a terminal opens already connected. Spotlight for servers.</p>
<figure class="shot">
<img src="/images/blog/gnome-extensions/ssh-search-provider.webp" alt="GNOME search results listing SSH hosts" loading="lazy" />
<figcaption>SSH Search Provider Reborn. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>
<p><strong>14. <a href="https://extensions.gnome.org/extension/1319/gsconnect/">GSConnect</a></strong> — the closest thing to Apple’s Continuity for an Android phone: shared clipboard, phone notifications on the desktop, files both ways, even replying to SMS. Pair it with the KDE Connect app on the phone.</p>
<figure class="shot">
<img src="/images/blog/gnome-extensions/gsconnect.webp" alt="GSConnect windows showing a paired phone, notifications and file sharing" loading="lazy" />
<figcaption>GSConnect. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>
<h2>Speed</h2>
<p><strong>15. <a href="https://extensions.gnome.org/extension/3843/just-perfection/">Just Perfection</a></strong> — dozens of shell tweaks (hide or show any top-bar element, and more), but the one I’d install it for is animation speed. Set it to “faster” and the whole desktop feels snappier, without anything looking rushed.</p>
<h2>What I left out, on purpose</h2>
<ul>
<li><strong>Blur effects.</strong> Beautiful, and expensive — on older or integrated GPUs they cost frames. A solid theme plus a tinted top bar looks nearly as good.</li>
<li><strong>A dock extension.</strong> Ubuntu already ships Ubuntu Dock; move it to the bottom and set it to auto-hide in Settings. On Fedora and other distros without a dock, add <a href="https://extensions.gnome.org/extension/307/dash-to-dock/">Dash to Dock</a>.</li>
<li><strong>Anything you wouldn’t notice was gone.</strong> Every extension is one more thing that can break on the next GNOME release. If you can’t name the habit an extension serves, skip it.</li>
</ul>
<p>Start with the TL;DR table, install the five that match your oldest habits, and add the rest when you miss them.</p>
`,excerpt:"Moving to Ubuntu, Fedora or any GNOME-based distro? These 15 extensions fill the gaps on day one — with a bias toward making Linux feel like a Mac."},d={frontmatter:{title:"My Old Laptop Felt Sluggish. Its GPU Was Stuck in Slow Mode.",date:"2026-10-10",description:"An evening of tinkering with a 2013 NVIDIA GPU on Linux, together with Claude Opus 5.5: finding out it ran at its slowest speed, testing faster speeds one careful step at a time, and a side quest that ended in an open bug.",tags:["linux","nvidia","ai","hardware"]},html:`<figure class="shot">
<img src="/images/blog/old-nvidia-gpu/cover.webp" alt="A person with bright orange hair, seen from behind, frustrated in front of a colourful video game on a TV" width="1600" height="686" />
<figcaption>That feeling when the graphics just won't keep up. Still from <a href="https://coverr.co/">Coverr</a>.</figcaption>
</figure>
<p>I’ve been using my old Lenovo Y500 again. It’s a 2013 laptop with an NVIDIA GeForce GT 750M, now running Ubuntu, and it does its job. But it felt a bit sluggish, so one evening I went looking for the reason. First question: is the GPU even working properly?</p>
<p>It was working. It just wasn’t working very hard. The graphics card was running at its <strong>slowest possible speed</strong>, all the time, with its memory at <strong>one-sixth</strong> of what it’s rated for.</p>
<p>NVIDIA stopped supporting this generation of cards years ago, so Linux uses the open-source driver, called nouveau. It’s good, but it starts the card at its lowest clock level and never raises it.</p>
<p>Then the developer in me spoke up. I had Claude Opus 5.5 running right there on that laptop, able to read logs and run commands. So why not tinker with it properly, and test as we go?</p>
<h2>Three levels, one step at a time</h2>
<p>The driver lists three clock levels for this card:</p>
<table>
<thead>
<tr>
<th>Level</th>
<th>Core</th>
<th>Memory</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>07</code> (what it boots with)</td>
<td>405 MHz</td>
<td>810 MHz</td>
</tr>
<tr>
<td><code>0a</code></td>
<td>up to 1058 MHz</td>
<td>1600 MHz</td>
</tr>
<tr>
<td><code>0f</code></td>
<td>up to 1058 MHz</td>
<td>5000 MHz</td>
</tr>
</tbody>
</table>
<p>The obvious move is to jump straight to the top. The smart one is to go up one level at a time, because on some laptops of this era a higher level can freeze the whole screen.</p>
<p>So before changing anything, we put the guards in place:</p>
<ul>
<li><strong>An automatic revert.</strong> Every test armed a timer that put the card back on its slowest level after 5 minutes. It ran as a system service, outside the terminal, so it would still fire even if the desktop locked up.</li>
<li><strong>A temperature cut-off.</strong> If the GPU reached 85°C during a test, it dropped back straight away instead of waiting out the timer.</li>
<li><strong>A reboot as the last resort.</strong> The card always starts on the slow level, so the worst case was a frozen screen and a restart, never a broken laptop.</li>
</ul>
<p>With that in place, the first test was the middle level, <code>0a</code>. It ran for five minutes while I kept using the laptop: stable, never above 55°C, and about 60% faster in a quick 3D benchmark. Then the timer switched it back, exactly as planned.</p>
<h2>Two tracks</h2>
<p>While the clock tests ran, we started a second track. Kepler cards like this one have a dedicated chip for decoding video. If it worked, the CPU wouldn’t have to do that job.</p>
<p>That track ended in a dead end. The video chip needs a small piece of firmware, which loaded fine, but every attempt to decode a video crashed the player. Reading the kernel logs led us to an <a href="https://gitlab.freedesktop.org/mesa/mesa/-/issues/13611">open Mesa bug</a>, reported on this exact GPU, plus a <a href="https://gitlab.freedesktop.org/drm/nouveau/-/issues/437">second one in the kernel driver</a>. Neither has a fix yet. So we removed the firmware, and video stays on the CPU, which handles 1080p without dropping a frame anyway.</p>
<p>Knowing <em>why</em> something doesn’t work, with a bug link to watch, is a perfectly good outcome for an evening.</p>
<h2>Back to the clock speed, with something to watch</h2>
<p>For the top level, I wanted to <em>see</em> what was happening rather than read numbers in a terminal. So we built a small page, the <strong><a href="/tools/gpu-test-bench/index.html">GPU Test Bench</a></strong>. It plays a 1080p test video and counts dropped frames, runs a 3D load test with an FPS counter, and, when run on the laptop itself, shows live graphs of GPU and CPU temperature.</p>
<p><strong>Try it right here, on whatever you’re reading this on.</strong> It runs entirely in your browser, nothing to install, and nothing starts until you press the button:</p>
<iframe data-autoheight src="/tools/gpu-test-bench/index.html?embed=1" title="GPU Test Bench: video playback and GPU benchmark" loading="lazy" allow="compute-pressure"></iframe>
<p>Then the real test: level <code>0f</code>, with memory at 5000 MHz, for five minutes with the 3D load running the whole time. It held steady and peaked at <strong>69°C</strong>, well under the cut-off.</p>
<figure class="shot">
<img src="/images/blog/old-nvidia-gpu/test-bench-live-stats.webp" alt="Live system stats: GPU 69°C, CPU 76°C, CPU usage 15%, memory 45%, with small graphs, above a table showing GeForce GT 750M, nouveau, Mesa 26.0.8 and kernel 7.0" loading="lazy" />
<figcaption>Live stats at level 0f under load: the GPU settles in the high 60s.</figcaption>
</figure>
<table>
<thead>
<tr>
<th>Level</th>
<th>5-minute test</th>
<th>Peak temperature</th>
<th>GPU Test Bench score</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>07</code> (boot)</td>
<td>—</td>
<td>57°C idle</td>
<td>~50</td>
</tr>
<tr>
<td><code>0a</code></td>
<td>✅ stable</td>
<td>55°C</td>
<td>—</td>
</tr>
<tr>
<td><code>0f</code></td>
<td>✅ stable, under constant 3D load</td>
<td>69°C</td>
<td><strong>~110</strong></td>
</tr>
</tbody>
</table>
<p>Same laptop, same test, more than twice the score. Run the test above and see where your device lands.</p>
<h2>Making it stick, safely</h2>
<p>One last surprise: the driver <em>knows</em> the GPU’s temperature limits, but it never slows the card down when it gets hot. Between roughly 85°C and an emergency shutdown at 135°C, nothing happens.</p>
<p>So the guard from the tests became permanent. A small service now starts at boot and puts the card on <code>0f</code>. It checks the temperature every five seconds, steps down at 85°C, drops to the slowest level at 92°C, and climbs back up once things cool below 70°C. Every change is written to the system log, so I can always see what it did and why.</p>
<p>On a normal day it does nothing at all. That’s the point.</p>
<h2>What I liked about this</h2>
<p>None of it was clever. The whole evening was small steps, each with a way back: test one level, watch it, let it revert, then decide on the next one. It’s the same way you’d roll out a risky change at work, applied to a 13-year-old laptop.</p>
<p>Having an AI pair that could read kernel logs, dig through bug trackers and write the safety nets <em>before</em> we touched anything made that easy to stick to.</p>
<h2>Try it yourself</h2>
<ul>
<li><strong><a href="/tools/gpu-test-bench/index.html">Open the full GPU Test Bench</a></strong> for the live 3D view and everything your browser knows about your GPU. Works on phones too.</li>
<li><strong><a href="/tools/gpu-test-bench/gpu-test-bench.zip">Download it</a></strong> (2.6 MB) to get the live temperature graphs on your own machine: unzip, run <code>python3 serve.py</code>, and open <code>http://127.0.0.1:8767</code>. It needs only Python 3 and never leaves your computer.</li>
<li>Got a Kepler-era NVIDIA card (GeForce 600 or 700 series) on nouveau? The <a href="/tools/gpu-test-bench/gpu-clock-guard">temperature guard script</a> and its <a href="/tools/gpu-test-bench/gpu-clock-guard.service">service file</a> are there too. Read them first, and test your own levels with a revert in place before making anything permanent.</li>
</ul>
`,excerpt:"An evening of tinkering with a 2013 NVIDIA GPU on Linux, together with Claude Opus 5.5: finding out it ran at its slowest speed, testing faster speeds one careful step at a time, and a side quest that ended in an open bug."},h=null,c={frontmatter:{title:"The Day I Stopped Prioritizing Features",date:"2025-12-14",description:"Why every prioritization framework kept failing me across six products — and how treating attention, not engineering hours, as the scarce resource became Return on Attention.",tags:["prioritization","roadmap","leadership"]},html:`<p>A few years ago, I was leading a team of four PMs across six products at Increff — a B2B retail-tech SaaS company serving over a hundred enterprise customers. My backlog looked like every PM’s nightmare.</p>
<p>Sales wanted features to close deals. Customer Success wanted features to retain accounts. Onboarding wanted features to cut implementation time. Engineering wanted architectural cleanup. Founders had strategic bets they wanted placed. Customers had urgent, contract-threatening asks. And every single request came with data attached, proving why it deserved to go first.</p>
<p>I did what most PMs do. I went looking for a better prioritization framework.</p>
<p>RICE. MoSCoW. Value vs. Effort. Opportunity scoring. I tried variations of all of them.</p>
<p>They worked — for about a sprint. Then they quietly stopped working, and I couldn’t immediately tell why.</p>
<p>It took me a while to see it clearly: I wasn’t struggling to prioritize. I was struggling to <em>compare</em>. I was putting apples, oranges, and satellites on the same scoring sheet and asking a formula to tell me which one mattered more. No framework fixes a comparison problem — it just hides it behind a number.</p>
<h2>The Real Shape of the Problem</h2>
<p>I stopped trying to score features and started trying to understand the <em>shape</em> of the chaos instead. I looked at it through three lenses — Company, People, and Tech — and in each one, there was an external face and an internal face.</p>
<p><strong>Company.</strong> Externally: every one of our hundred-plus customers was a company at a different stage of life. Some scaling fast. Some cutting costs. Some just funded and eager to experiment. Some mature and optimizing for stability. The same feature could be mission-critical for one and irrelevant for another. Internally: we ran six products, each at a different point in its own life — some 0-to-1, some 1-to-10, some 10-to-100 — each with a different pace, a different relationship with its founders, a different definition of success.</p>
<p><strong>People.</strong> Externally: the old B2B line is “the buyer isn’t the user.” I’d go further — there isn’t even <em>one</em> user. A single enterprise account has operations teams, finance, warehouse managers, analytics teams, and leadership, all touching the same product for completely different reasons. Internally: requests came from Sales, Success, Onboarding, Product, Legal, DevOps — every function pursuing a goal that was completely legitimate on its own terms.</p>
<p><strong>Tech.</strong> Externally: a customer asking for “a feature” might really be migrating to a new ERP, or need a different payload shape, or care about retry logic, or latency, or compliance — five different problems wearing the same request. Internally: our own six products ran on different architectures, some OLTP-heavy, some OLAP, each with its own tech leads and its own idea of “the right way to build.”</p>
<p>Once I laid that grid out, the real insight arrived: <strong>the scarce resource in this system was never engineering hours or money. It was attention</strong> — leadership attention, department-head attention, my own attention as the person supposedly holding the whole map in my head. Every framework I’d tried was trying to optimize <em>feature selection</em>. None of them touched the actual bottleneck, which was <em>where human attention got spent, and how often it had to be spent again</em>.</p>
<h2>Where This Came From</h2>
<p>I want to be precise about the origin of this, because it matters for how much weight to give it.</p>
<p>I’d taken Shreyas Doshi’s course and learned his LNO framework there — Leverage, Neutral, Overhead — a way of deciding how much effort a given task deserves. It shaped how I thought about my own time. But LNO is about an individual’s effort allocation. It doesn’t tell you how a department head’s list should relate to a founder’s vision, or how six products at six different life stages should share one engineering org’s attention.</p>
<p>I hadn’t read Herbert Simon’s work on the attention economy, or the academic literature on attention as an organizational resource, when I built this. I only found out about it later, after I’d already been running this system for months and started researching whether anyone had written about it formally. Turns out economists have been describing pieces of this idea since the 1970s. That was a genuinely interesting discovery, but it’s not where this came from — I found the research after the framework, not before it.</p>
<p>This came from first principles, under pressure, with four PMs and me trying to make sense of a demand curve that had no ceiling and a bandwidth curve that very much did. <strong>Unlimited demand. Limited capacity.</strong> Every conventional framework I threw at that mismatch dissolved into arguments about whose request mattered more. None of them addressed the actual constraint.</p>
<h2>The Question That Changed Everything</h2>
<p>Once the shape of the problem was clear, we stopped asking:</p>
<p><em>“Which feature should we build next?”</em></p>
<p>And started asking:</p>
<p><em>“How do we build a system that consistently makes good prioritization decisions — without me, or any single PM, being the bottleneck?”</em></p>
<p>That single reframe is what became <strong>Return on Attention</strong>: not a scoring model for features, but a model for deciding where the organization’s scarcest resource — attention — gets deployed, so that spending it once pays out for a long time afterward, instead of needing to be spent again every sprint.</p>
<h2>The System, Mechanically</h2>
<p>Here’s what we actually built. It has four moving parts, and each one earned its place the hard way — by breaking first, then getting fixed.</p>
<p><strong>Every department head owns one prioritized list, and it’s never static.</strong> Sales owns the Sales list. Success owns the Success list. Onboarding owns its own. Engineering owns its own. Each list is ranked by what creates the highest impact for that function. Critically, these lists aren’t set once and left alone — department heads re-rank them continuously, and re-ranking happens as a natural side effect of preparing for the next sprint, not on some separate calendar reminder. If a deal falls through, a competitor launches something, or the market shifts mid-quarter, that shows up the next time a department head sits down to plan — because re-ranking isn’t an event, it’s a habit built into how they already operate.</p>
<p><strong>Theme-setting happens across a rolling window, not in one high-stakes meeting.</strong> This is the part I didn’t get right in earlier versions of this system, and it’s the part that made the biggest difference once we fixed it. Instead of negotiating bandwidth fresh every single sprint — which turns into exactly the kind of political scramble you’d expect when everyone shows up wanting their fair share right now — we plan theme and bandwidth across the next three sprints at once. We might commit some capacity to next sprint and a smaller slice to the sprint after that, and the one after that. Each time we sit down again, we’re not starting from zero — we already know what’s been committed, and we’re just filling in what’s left. Spreading the negotiation across the quarter instead of concentrating it at each sprint boundary took most of the heat out of the room. It’s not that the negotiation disappeared. It’s that nobody’s negotiating under time pressure anymore.</p>
<p><strong>Cross-functional resource contention mostly doesn’t happen — by design, not by process.</strong> Early critiques of this system rightly asked: what happens when two department heads’ top priorities both need the same specialized engineer this sprint? Our answer turned out to be structural rather than procedural — most engineers are mapped to a single product, so the kind of contention that looks scary on paper almost never shows up in practice. When it does — usually around shared platform components that serve more than one product — we resolve it explicitly during theme-setting, and if a team’s bandwidth is being spent on something that benefits every product, we say so out loud and push them to build it that way deliberately, not by accident. Disagreements that can’t get resolved there come to me as the product head. If I can’t resolve it, it goes to the founders, anchored in company vision. That’s the actual chain, and it’s short on purpose.</p>
<p><strong>Selection is mechanical, but the tail is a judgment call, not a guarantee.</strong> Engineering does t-shirt sizing or story-pointing against the agreed bandwidth, and the team fills each bucket from the top of the relevant department’s list. Most of the time, that’s the whole story. But I want to be honest about the one place this system doesn’t fully solve the problem it was built for: long-tail and edge-case items. What sits at the bottom of Engineering’s list sometimes sits at the top of Sales’ list, and we do catch that — but we catch it because it happens to surface during theme-setting, when two lists visibly disagree about something. A genuinely niche item that never collides with anything on anyone else’s list can sit near the bottom indefinitely. We handle this today through department-head judgment, not through an automatic safeguard. That’s a real limitation, and I’d rather say so than pretend the system quietly solves the exact problem it was named after.</p>
<h2>Why I Didn’t Just Pick One Off the Shelf</h2>
<p>I want to pause on something before I get to results, because I think it’s the more useful takeaway than the framework itself.</p>
<p>There is no shortage of product frameworks in the world. Search for “prioritization framework” and you’ll get RICE, MoSCoW, Kano, Opportunity Scoring, Weighted Scoring, ICE, and a dozen others, each with a slide deck and a case study from a company that isn’t yours. Every one of them is well-reasoned. Every one of them has genuinely worked — for the team, the domain, and the specific pressures that existed when it was built. None of that means it will work for you.</p>
<p>That’s the trap I want to name plainly: treating a framework’s popularity, or its logo-studded case-study list, as evidence it will transfer into your context. A framework isn’t a law of physics. It’s someone else’s answer to their own specific mix of company stage, team maturity, market structure, and org politics. RICE assumes you can meaningfully estimate reach and confidence — that’s a real assumption, not a neutral default. MoSCoW assumes your stakeholders can agree on what “must” means — also not neutral. These frameworks aren’t wrong. They’re <em>someone else’s fit</em>.</p>
<p>I tried several of them here, honestly, before building this. They didn’t fail because they were bad frameworks. They failed because Increff’s specific shape — six products at wildly different maturity stages, a hundred-plus B2B accounts each with their own internal politics, engineering teams split across OLTP and OLAP paradigms — wasn’t the shape any of those frameworks were built to fit. My team, my company’s stage, my engineering setup, my specific blend of art and politics and architecture, were different from whatever context produced those frameworks. So I stopped trying to make my problem fit someone else’s answer, and started building something for the actual shape of what I had.</p>
<p>That’s the real instruction I’d give anyone reading this, more than the mechanics of Return on Attention itself: read the frameworks, learn from them, take what’s genuinely useful — but don’t adopt one wholesale out of fear that you need “a real framework” to be legitimate. You are not in the same company, with the same team, the same stage, the same politics, or the same technical debt as whoever wrote the framework you’re reading about. Build your own operating method for your own context. Run it. Take feedback. Break it on purpose by asking people to attack it. Improve it. Run it again. That loop — not the specific mechanism — is the actual transferable skill.</p>
<h2>What Changed at Increff</h2>
<p>This wasn’t a thought experiment. It ran, and it’s still running, across six products and a hundred-plus customers.</p>
<p>The clearest signal: the volume of ad-hoc, “drop everything” critical requests dropped sharply. Not because customers stopped having urgent needs — they still do — but because most of what used to arrive as a fire actually had a home in someone’s prioritized list already. It just needed a theme and a bandwidth slot, not a crisis meeting.</p>
<p>The second, quieter shift mattered more to me. Teams across different pods and products now know which direction we’re moving in — and <em>why</em> — because the “why” was settled upstream, by the leaders who own those goals, in a negotiation spread calmly across the quarter instead of relitigated under pressure every two weeks.</p>
<h2>The One Lesson</h2>
<p>I’ve come to believe prioritization was never the real skill I needed. Alignment was — and alignment that holds up under pressure needs its negotiation spread out in time, not concentrated at the one moment everyone’s watching the clock.</p>
<p>When company goals, product goals, departmental goals, and engineering capacity all point in the same direction <em>before</em> a feature ever gets discussed, the backlog effectively prioritizes itself. The scoring model you use to pick between two aligned features barely matters. The system that gets you to alignment in the first place is the whole game — and the timing of when that alignment gets negotiated matters almost as much as the alignment itself.</p>
<p>So if you’re leading product at any real scale and you feel like you’re drowning in incompatible, well-justified, urgent requests — my honest suggestion is: stop looking for a better prioritization framework. Ask where your organization’s attention is actually being spent, whether it’s being spent once, upstream, in a way that keeps paying out, and whether that negotiation is happening calmly ahead of time or frantically under a deadline.</p>
<p>That’s Return on Attention. Not a framework for ranking features. A model for where judgment gets deployed, and when — so that features stop needing to be fought over at all, and the long tail becomes a conscious trade-off instead of an accident.</p>
<p>And to be clear — I’m not asking you to adopt Return on Attention either, at least not as-is. I’m asking you to do what building it forced me to do: look honestly at your own company, your own team, your own stage, your own politics, and your own technical constraints, and build something that fits <em>that</em> — not a framework that fit someone else’s. Mine will keep changing as Increff changes. Yours should too.</p>
<hr>
<p><em>The operating mechanics of the framework — lists, theme-setting, the escalation chain — are also summarized in <a href="/projects/roa-prioritization">my work section</a>.</em></p>
<p><em>If you’re running into a version of this in your own org, I’d genuinely like to hear how you’re solving it — reach out on <a href="https://www.linkedin.com/in/alafazam">LinkedIn</a>.</em></p>
`,excerpt:"Why every prioritization framework kept failing me across six products — and how treating attention, not engineering hours, as the scarce resource became Return on Attention."},p={frontmatter:{title:"The Demo Is the Spec",date:"2026-08-29",description:"A PRD can be internally consistent and still describe an incoherent product. A working prototype can feel the contradictions that prose hides.",tags:["product","prototyping","ai","design"]},html:`<!-- The opening scene uses the story-lede treatment; the argument resumes below it. -->
<div class="story-lede">
<p class="story-lede-label">From the work</p>
<p>We had a clean story for each user.</p>
<p>The planner saw an overdue cluster approval. The team lead saw the same delay blocking downstream work. The VP saw the financial consequence at portfolio level. Each view made sense on its own.</p>
<p>The contradiction appeared only when we clicked through all three views in the same running product.</p>
<p>The blocker was technically the same, but the framing, urgency, and next action did not connect. Three individually reasonable specifications had produced one incoherent experience. We had reviewed the documents. We had approved the screens. None of that surfaced the problem.</p>
<p class="story-lede-turn">Using the product did.</p>
</div>
<p>That changed how I think about product specifications:</p>
<blockquote>
<p>A PRD can describe what a product should do. A demo can reveal whether the product makes sense.</p>
</blockquote>
<p>When building a working prototype becomes nearly as cheap as writing a thorough document, the prototype should stop being an illustration of the spec. For interaction-heavy products, the demo should become the primary spec.</p>
<h2>Prose cannot feel wrong</h2>
<p>A document is read linearly. A product is not.</p>
<p>Users move between pages, roles, decisions, and states. They arrive with history. They leave work half-finished. They see the same business event at different levels of detail. The hardest product problems often live in the gaps between individually correct requirements:</p>
<ul>
<li>Does the action on one page create a believable state on the next?</li>
<li>Do two personas understand the same event consistently?</li>
<li>Does the system explain why a number changed, not merely show that it changed?</li>
<li>Can a user recover when they enter a workflow from somewhere other than the happy path?</li>
</ul>
<p>A PRD can mention all four and still hide the contradictions. Prose is unusually tolerant of seams. A running interface is not.</p>
<p>In our merchandising-platform work, the prototype grew to 41 pages across planner, team-lead, executive, and administrator roles. It used a live simulation engine so approvals, scenarios, blockers, and downstream tasks changed together. That detail mattered. Static screens would have shown visual consistency. Shared state showed product consistency—or its absence.</p>
<p>The same overdue approval had to remain the same business fact everywhere, while changing altitude appropriately:</p>
<ul>
<li>The planner needed the next action.</li>
<li>The team lead needed the dependency and owner.</li>
<li>The VP needed the consequence and escalation threshold.</li>
</ul>
<p>That is difficult to validate in three sections of a document. It is obvious after thirty seconds of clicking.</p>
<h2>AI changed the economics, not the standard</h2>
<p>“Prototype before building” is not new advice. What changed is the cost.</p>
<p>Historically, a realistic prototype could require enough design and engineering effort that teams reserved it for high-risk flows. The PRD remained the source of truth because it was cheap to edit, easy to circulate, and broad enough to cover the whole product.</p>
<p>AI has compressed the cost of the working version. A runnable, data-driven prototype can now cost roughly what a thorough PRD used to cost. That changes the sensible default.</p>
<p>It does not lower the quality bar. In fact, it raises it.</p>
<p>AI can generate an impressive amount of plausible UI very quickly. Plausible is dangerous. A polished screen can make an unresolved workflow look finished. If the prototype is going to carry specification authority, it needs the same discipline we expect from a serious document:</p>
<ul>
<li>Named user and business states, not disconnected screens</li>
<li>Deterministic fixtures for important paths</li>
<li>A simulation model that propagates meaningful changes</li>
<li>A route and journey inventory</li>
<li>A QA checklist tied to the actual demo flow</li>
<li>Explicit maturity gates for unfinished areas</li>
</ul>
<p>We made the working UI a formal design deliverable, not a disposable mock. The demo script doubled as a QA path. The same structured flow later drove guided playback and video capture. One source described the intended journey; several tools consumed it.</p>
<p>Without that rigor, “the demo is the spec” becomes “the prettiest artifact wins.” That is worse than a PRD.</p>
<h2>Let artifacts settle taste debates</h2>
<p>One homepage discussion had stalled around two competing directions. Both had reasonable arguments. Neither side lacked vocabulary; more discussion was not going to create evidence.</p>
<p>So we built both.</p>
<p>We then expanded the comparison to six variants, scored them against a ten-dimension rubric, and combined the strongest parts into a new direction. The synthesis scored 46 out of 50—higher than either original.</p>
<p>The useful move was not “run a design competition.” It was converting an opinion loop into an artifact loop:</p>
<ol>
<li>Make the alternatives concrete.</li>
<li>Define the evaluation criteria before choosing.</li>
<li>Score what exists, not what each advocate imagines.</li>
<li>Allow synthesis instead of forcing a false binary.</li>
</ol>
<p>Documents are excellent at preserving arguments. Prototypes are better at ending them.</p>
<h2>A prototype should also kill features</h2>
<p>The highest-value outcome of a prototype is sometimes a smaller product.</p>
<p>We had started designing a flexible visual pipeline builder for data onboarding. It looked like the platform-grade answer: drag-and-drop nodes, open-ended composition, room for future transformations.</p>
<p>Then the workflow became real enough to interrogate.</p>
<p>The recurring problem was not authoring arbitrary pipelines. It was mapping messy customer headers into a known target schema, reviewing the proposed mapping, and activating it safely. The canvas solved a generality problem we did not actually have.</p>
<p>We killed it.</p>
<p>The replacement was a declarative mapping specification: an agent could propose it, a human could review the diff, and the system could enforce that the agent never activated it. The estimated build dropped from large to medium. The result was easier to audit and closer to the real job.</p>
<p>A prose spec often rewards completeness. Once a feature has a heading, requirements, and acceptance criteria, removing it feels like lost work. A prototype rewards usefulness. If nobody needs the flexibility when the workflow is in front of them, the abstraction has nowhere to hide.</p>
<h2>Where this model breaks</h2>
<p>The demo is not the whole specification.</p>
<p>It is weak at things that do not become visible through interaction: scale limits, security boundaries, tenant isolation, recovery guarantees, data retention, observability, accessibility details, and unusual edge cases. A happy-path prototype can actively conceal these concerns.</p>
<p>I use a simple boundary:</p>
<blockquote>
<p>The demo owns experiential truth. Written contracts own invisible constraints.</p>
</blockquote>
<p>The prototype should be authoritative for journeys, states, hierarchy, language, and cross-role coherence. Architecture decisions, API contracts, threat models, non-functional requirements, and failure semantics still belong in explicit written artifacts and tests.</p>
<p>There is another cost: keeping the prototype trustworthy. Once people use it as the spec, stale behavior becomes misinformation. Shared fixtures, automated journey checks, and clear “implemented versus simulated” labels are not polish. They are maintenance of the specification itself.</p>
<h2>What to change on Monday</h2>
<p>Do not begin by replacing every PRD with code. Pick one workflow where the risk lives between screens or roles.</p>
<p>Build the thinnest version that can answer three questions:</p>
<ol>
<li>Can the user complete the job from entry to outcome?</li>
<li>Does every state transition remain believable across pages?</li>
<li>Do different roles see the same underlying business truth at the right altitude?</li>
</ol>
<p>Give the prototype deterministic data. Write the critical journey as a replayable checklist. Record unresolved non-functional constraints beside it rather than pretending the UI answers them.</p>
<p>Then review by using it.</p>
<p>Stop asking whether each screen matches its section of the document. Ask whether the product feels coherent when the user refuses to follow the document’s order.</p>
<p>That is the standard prose cannot meet.</p>
<p>Ship the demo, and let the thing that can feel wrong become the spec.</p>
`,excerpt:"A PRD can be internally consistent and still describe an incoherent product. A working prototype can feel the contradictions that prose hides."},u=null,g={frontmatter:{name:"AI-First Interface Strategy",tagline:"The platform as an intelligent backend",category:"Builds",status:"Active",impact:"Merchandising decisions in natural language",icon:"bot",order:"2",tags:["AI","Platform","MCP"]},html:`<p>Exposing the merchandising platform as an intelligent backend — an MCP + skills layer — so enterprise AI assistants can drive merchandising decisions in natural language instead of clicking through screens.</p>
<h2>Problem</h2>
<p>Powerful platforms still bottleneck on the UI. Every workflow means training users on screens, and the value is gated behind knowing where to click.</p>
<h2>Approach</h2>
<p>Treat the platform as a set of well-described tools (MCP servers + a skills layer) that an AI assistant can call. The interface becomes conversational; the platform’s algorithms stay the source of truth.</p>
<h2>Outcome</h2>
<p>Clients can ask for merchandising decisions in plain language, and the AI orchestrates the underlying platform — turning a deep feature set into something you can just talk to.</p>
<h2>Design principles</h2>
<ul>
<li><strong>The tools carry the semantics.</strong> An MCP tool description is now product surface. Writing what a tool is for, when to use it and what it returns is the new UX design.</li>
<li><strong>Skills encode the workflows.</strong> Tools are verbs; skills are the sentences: the encoded judgment of how an experienced merchandiser sequences a decision.</li>
<li><strong>The platform stays authoritative.</strong> The assistant never invents a number. It routes intent to algorithms that were trusted before AI arrived.</li>
</ul>
<p>A merchandiser can ask, “rebalance next month’s OTB for the stores that under-sold this range”, and the assistant calls the right tools in the right order, with the platform’s own optimization doing the heavy lifting.</p>
<h2>Why it matters</h2>
<p>It decouples the platform’s value from its screens. Clients can bring their own assistant, and years of merchandising algorithms become something you can just talk to.</p>
`,excerpt:"Exposing the merchandising platform as an intelligent backend — an MCP + skills layer — so enterprise AI assistants can drive merchandising decisions in natural"},m={frontmatter:{name:"GAN Thinking Mode",tagline:"Adversarial reasoning framework",category:"Frameworks & Processes",status:"Active",impact:"Kills weak ideas before they ship",icon:"brain",order:"5",tags:["Methodology","Product thinking","Notion"]},html:`<p>GAN Thinking Mode is a reasoning framework I built in Notion that stress-tests every idea before it ships. A “generator” proposes, a “discriminator” attacks, and only ideas that survive the adversarial loop move forward — surfacing weak assumptions early.</p>
<h2>The idea</h2>
<p>Most product decisions die from unexamined assumptions, not bad execution. Borrowing from generative adversarial networks, I made the critique an explicit, structured step rather than an afterthought.</p>
<h2>How it works</h2>
<ol>
<li><strong>Generator</strong> — draft the idea, the bet, the plan</li>
<li><strong>Discriminator</strong> — attack it: where does it break, what would have to be true</li>
<li><strong>Iterate</strong> — only refined ideas that survive the loop graduate to a spec</li>
</ol>
<h2>Why step two is the whole method</h2>
<p>The discriminator isn’t devil’s-advocate theater in a meeting. It’s a written artifact with the same effort budget as the proposal itself. When critique is structured and mandatory, weak ideas fail cheaply on paper instead of expensively in production.</p>
<h2>What I’ve learned running it</h2>
<ul>
<li>The generator and discriminator should ideally be <strong>different people</strong>. Even solo, switching roles in writing catches most of the load-bearing assumptions.</li>
<li>The best discriminator prompts are boring: <em>what breaks at 10× scale? what does Sales promise that this doesn’t do? what’s the migration story?</em></li>
<li>Surviving the loop is a signal a team can rally behind. “This got attacked and lived” builds more conviction than any pitch deck.</li>
</ul>
`,excerpt:'GAN Thinking Mode is a reasoning framework I built in Notion that stress-tests every idea before it ships. A "generator" proposes, a "discriminator" attacks, an'},f={frontmatter:{name:"KidQueue",tagline:"Parent-controlled video curation",category:"Builds",status:"In progress",impact:"Safety by curation, not moderation",icon:"play",order:"1",tags:["Consumer","Product design","Safety-first"]},html:`<p>KidQueue is a parent-first app that replaces algorithmic autoplay with an intentional, hand-picked library. Parents choose exactly what their kids can watch and queue it up — safety by design rather than by moderation.</p>
<h2>Why I’m building it</h2>
<p>The default video experience for kids optimizes for watch time, not for the values a parent actually has. KidQueue flips that: the parent is the curator, and the algorithm is out of the loop.</p>
<h2>What it does</h2>
<ul>
<li>Parents build and order a personal watchlist</li>
<li>Kids get a simple, distraction-free player</li>
<li>No recommendations, no autoplay rabbit holes</li>
</ul>
<h2>Curation beats moderation</h2>
<p>“Kids mode” usually means moderation: filtering the worst content out of an infinite feed. Moderation asks <em>is this bad enough to block?</em>, an unwinnable game against an endless catalog. Curation asks <em>is this good enough to include?</em>, a game a parent can win in ten minutes a week. When the queue ends, it ends, and that’s a feature rather than a bug.</p>
<h2>Why it matters beyond kids’ video</h2>
<p>It’s the same argument I make in enterprise software: defaults are the real product, and whoever controls the default controls the outcome. KidQueue moves the default from “the platform decides what plays next” to “the parent already decided.”</p>
`,excerpt:"KidQueue is a parent-first app that replaces algorithmic autoplay with an intentional, hand-picked library. Parents choose exactly what their kids can watch and"},y={frontmatter:{name:"Return-on-Attention (ROA) Prioritization",tagline:"One lens to align focus across teams",category:"Frameworks & Processes",impact:"Urgent-critical asks → 0 per sprint",icon:"target",order:"4",tags:["Prioritization","Roadmap","Alignment"]},html:`<p><strong>Return on Attention (ROA)</strong> is an operating system for prioritization that I built and still run at Increff — across six products, four PMs, and a hundred-plus enterprise customers. Its core claim is simple: the scarce resource in a product organization is not engineering hours or money. It’s <strong>attention</strong> — leadership attention, department-head attention, PM attention. ROA is a system for deciding where that attention gets deployed, so that spending it <em>once, upstream</em> keeps paying out for months, instead of being re-spent in a crisis meeting every two weeks.</p>
<blockquote>
<p>The origin story — why RICE, MoSCoW, and friends kept failing me, and how this emerged from first principles — is in the essay <a href="/blog/return-on-attention">The Day I Stopped Prioritizing Features</a>. This page is the reference manual: what the framework is and how it works.</p>
</blockquote>
<h2>The problem it solves</h2>
<p>Every function sends requests, every request arrives with data proving it should go first, and demand has no ceiling while capacity very much does. A typical Monday looked like this:</p>
<table>
<thead>
<tr>
<th>Who</th>
<th>The ask</th>
<th>Their justification</th>
<th>Urgency claimed</th>
</tr>
</thead>
<tbody>
<tr>
<td>Sales</td>
<td>“Excel export, but it must open in the client’s Excel 2007”</td>
<td>₹2 Cr deal “depends on it”</td>
<td>🔥🔥🔥</td>
</tr>
<tr>
<td>Success</td>
<td>Custom dashboard for one account</td>
<td>“They mentioned churn on a call”</td>
<td>🔥🔥🔥</td>
</tr>
<tr>
<td>Onboarding</td>
<td>Bulk-upload validation</td>
<td>Cuts implementation by 2 weeks</td>
<td>🔥🔥</td>
</tr>
<tr>
<td>Engineering</td>
<td>“Let us delete the old service”</td>
<td>It wakes someone up at 3 a.m. weekly</td>
<td>🔥 (they’re too polite)</td>
</tr>
<tr>
<td>Founder</td>
<td>Strategic AI bet</td>
<td>The future of the company</td>
<td>🔥🔥🔥🔥</td>
</tr>
<tr>
<td>A customer, directly</td>
<td>A button. Just one button.</td>
<td>Contract renewal in 6 weeks</td>
<td>🔥🔥🔥</td>
</tr>
</tbody>
</table>
<p>Every one of these is <em>legitimate</em>. None of them are comparable. Scoring them on one sheet is how you end up asking a formula whether an apple beats a satellite.</p>
<p>And the standard fix — adopting yet another prioritization framework — has a well-documented failure mode:</p>
<p><img src="https://imgs.xkcd.com/comics/standards.png" alt="xkcd 927: Standards"></p>
<p><em>Replace “standards” with “prioritization frameworks” and this is a documentary. (<a href="https://xkcd.com/927/">xkcd #927</a>, CC BY-NC 2.5)</em></p>
<h2>What ROA actually is</h2>
<p>Not a scoring formula. It’s four operating rules that move the expensive negotiation <em>upstream</em> and spread it <em>over time</em>:</p>
<h3>1. Every department head owns one living, ranked list</h3>
<p>Sales owns the Sales list. Success owns Success. Onboarding, Engineering — same. Each list is ranked by impact <em>for that function</em>, and re-ranking is a habit built into sprint prep, not a calendar event. A lost deal or a competitor launch shows up in the ranking the next time that leader sits down to plan.</p>
<p>The important trick: <strong>I never argue with the inside of someone else’s list.</strong> Sales knows sales. The negotiation happens one level up — how much bandwidth each list gets.</p>
<h3>2. Theme and bandwidth are set on a rolling three-sprint window</h3>
<p>Instead of negotiating capacity fresh every sprint (a political knife-fight with a two-week timer), we allocate across the next three sprints at once — heavier commitment to the nearest sprint, lighter to the two after. Each planning session starts from what’s already committed and just fills the gaps.</p>
<table>
<thead>
<tr>
<th></th>
<th>Sprint N</th>
<th>Sprint N+1</th>
<th>Sprint N+2</th>
</tr>
</thead>
<tbody>
<tr>
<td>Committed when we sit down</td>
<td>~80%</td>
<td>~50%</td>
<td>~20%</td>
</tr>
<tr>
<td>Negotiated in this session</td>
<td>~20%</td>
<td>~30%</td>
<td>~30%</td>
</tr>
<tr>
<td>Temperature of the room</td>
<td>☕ calm</td>
<td>☕ calm</td>
<td>🤷 “future us” problem</td>
</tr>
</tbody>
</table>
<p>Nobody negotiates under time pressure anymore. The negotiation didn’t disappear — it just stopped being an ambush.</p>
<h3>3. Contention is designed out, not process-ed out</h3>
<p>Most engineers map to a single product, so “two departments need the same specialist this sprint” — the scenario that looks terrifying on paper — almost never occurs. When it does (usually shared platform components), it’s resolved explicitly at theme-setting. Escalation chain: theme-setting → me → founders, anchored to company vision. Two hops, on purpose.</p>
<h3>4. Selection is mechanical; the long tail is a named judgment call</h3>
<p>Engineering sizes work against the agreed bandwidth, and each bucket fills from the top of the owning department’s list. No re-litigation. The honest limitation: a genuinely niche item that never collides with anyone else’s list can sit at the bottom indefinitely. We handle that with department-head judgment, not an automatic safeguard — a real trade-off I’d rather name than hide.</p>
<h2>Is it worth the attention?</h2>
<p>The reason “spend attention once, upstream” works is the same math as automating a repeated task — you’re amortizing a fixed cost across every sprint that no longer needs a crisis meeting:</p>
<p><img src="https://imgs.xkcd.com/comics/is_it_worth_the_time.png" alt="xkcd 1205: Is It Worth the Time?"></p>
<p><em>Swap “time saved” for “attention saved” and the table still works. A weekly 90-minute fire-drill, eliminated, buys you ~10 working days a year — per fire-drill. (<a href="https://xkcd.com/1205/">xkcd #1205</a>, CC BY-NC 2.5)</em></p>
<p>A worked example of the lens itself. The question is never “is this valuable?” — it’s “what does this pay back on the attention it consumes, and how often will we have to pay attention to it <em>again</em>?”</p>
<table>
<thead>
<tr>
<th>Ask</th>
<th>Attention cost</th>
<th>Return profile</th>
<th>ROA verdict</th>
</tr>
</thead>
<tbody>
<tr>
<td>One-off custom dashboard for one account</td>
<td>High (design reviews, edge cases, forever-maintenance)</td>
<td>Pays out once, for one client</td>
<td>Defer; solve via config/services</td>
</tr>
<tr>
<td>Bulk-upload validation for onboarding</td>
<td>Medium, once</td>
<td>Pays out on <em>every</em> future implementation</td>
<td>Top of the theme</td>
</tr>
<tr>
<td>“Rewrite it in Rust”</td>
<td>Enormous</td>
<td>Emotional; recurring</td>
<td>Lovingly declined</td>
</tr>
<tr>
<td>Deleting the 3 a.m.-pager service</td>
<td>Medium, once</td>
<td>Returns engineer sleep, forever</td>
<td>Funded — sleep compounds</td>
</tr>
<tr>
<td>Excel-2007-compatible export</td>
<td>Low</td>
<td>Pays out exactly once, in six weeks</td>
<td>Scheduled, calmly, in Sprint N+1 — no fire required</td>
</tr>
</tbody>
</table>
<h2>The results (same org, before vs. after)</h2>
<table>
<thead>
<tr>
<th>Metric</th>
<th>Before ROA</th>
<th>After ROA</th>
</tr>
</thead>
<tbody>
<tr>
<td>“Urgent-critical” roadmap resets</td>
<td>3–4 per sprint</td>
<td><strong>0</strong> per sprint</td>
</tr>
<tr>
<td>Where prioritization conflict happened</td>
<td>Every sprint boundary, under deadline</td>
<td>Rolling theme-setting, spread across the quarter</td>
</tr>
<tr>
<td>Who could answer “why are we building this?”</td>
<td>Me, on a good day</td>
<td>Any pod, because the “why” was settled upstream</td>
</tr>
<tr>
<td>Escalations needed</td>
<td>Constant, ad-hoc</td>
<td>Rare; two-hop chain when needed</td>
</tr>
<tr>
<td>Scope it runs at</td>
<td>—</td>
<td>6 products, 4 PMs, 100+ enterprise accounts</td>
</tr>
</tbody>
</table>
<p>The urgent asks didn’t stop arriving — customers still have emergencies. What changed is that most of what used to arrive as a <em>fire</em> already had a home in someone’s ranked list. It needed a bandwidth slot, not a crisis meeting.</p>
<h2>What ROA is not</h2>
<ul>
<li><strong>Not a scoring formula.</strong> There’s no ROA number to compute. If you’re multiplying columns in a spreadsheet, you’re doing the other thing.</li>
<li><strong>Not a promise that the long tail gets served.</strong> It makes the tail a <em>conscious trade-off</em> instead of an accident (see rule 4).</li>
<li><strong>Not portable as-is.</strong> It fits Increff’s shape: multi-product, B2B, engineers mapped to products. Steal the reasoning — attention is the constraint; negotiate upstream, on a rolling window — and rebuild the mechanics for your own org. That loop is the transferable part.</li>
</ul>
<p><em>Full narrative version, including everything that broke before this worked: <a href="/blog/return-on-attention">The Day I Stopped Prioritizing Features</a>.</em></p>
`,excerpt:"Return on Attention (ROA) is an operating system for prioritization that I built and still run at Increff — across six products, four PMs, and a hundred-plus en"},w={frontmatter:{name:"Two-Clock Release & Delivery",tagline:"Continuous merge, controlled client releases",category:"Frameworks & Processes",impact:"Eliminated pod blocking & unsafe rollbacks",icon:"clock",order:"3",tags:["Delivery","Feature flags","Release management"]},html:`<p>Feature-flag-gated continuous merge paired with controlled monthly client releases — two clocks running at different speeds so engineering never blocks on release cadence and clients never get surprised.</p>
<h2>Problem</h2>
<p>When merge and release are the same clock, pods block each other waiting for a release train, and rollbacks are risky because half-finished work is already merged.</p>
<h2>Approach</h2>
<p>Decouple the two. Engineers merge continuously behind feature flags (the fast clock); clients receive controlled, predictable monthly releases (the slow clock). Flags decide what’s on for whom.</p>
<h2>Outcome</h2>
<p>Pods stop blocking each other, rollbacks become flag flips instead of reverts, and clients get a stable, predictable release rhythm.</p>
<h2>The part that’s cultural, not technical</h2>
<p>Feature flags have to be owned as a <em>product</em> tool. Which flag turns on for which client, in which release, is a product decision. The flag system is really a client-communication system wearing an engineering costume.</p>
<p>Enterprise clients don’t want surprises; they want a predictable cadence they can plan training and change management around. The slow clock gives them that, while the fast clock keeps engineering from ever waiting on a release train.</p>
`,excerpt:"Feature-flag-gated continuous merge paired with controlled monthly client releases — two clocks running at different speeds so engineering never blocks on relea"};function a(t){return Object.entries(t).flatMap(([e,n])=>n?[{slug:e.split("/").pop().replace(/\.md$/,""),...n}]:[])}const v=Object.assign({"../content/blog/building-kidqueue.md":null,"../content/blog/building-with-claude.md":i,"../content/blog/era-of-personal-software.md":o,"../content/blog/gan-thinking-mode.md":r,"../content/blog/must-have-gnome-extensions.md":l,"../content/blog/old-nvidia-gpu-linux.md":d,"../content/blog/platform-as-intelligent-backend.md":h,"../content/blog/return-on-attention.md":c,"../content/blog/the-demo-is-the-spec.md":p,"../content/blog/two-clock-delivery.md":u}),b=Object.assign({"../content/projects/ai-first-interface.md":g,"../content/projects/gan-thinking-mode.md":m,"../content/projects/kidqueue.md":f,"../content/projects/roa-prioritization.md":y,"../content/projects/two-clock-delivery.md":w}),k=a(v).sort((t,e)=>(e.frontmatter.date||"").localeCompare(t.frontmatter.date||"")),s=a(b).sort((t,e)=>Number(t.frontmatter.order||0)-Number(e.frontmatter.order||0)),I=t=>k.find(e=>e.slug===t),A=t=>s.find(e=>e.slug===t),x=["Builds","Frameworks & Processes"],T={Builds:"Products and systems I've designed and shipped.","Frameworks & Processes":"Operating frameworks and processes I've designed and run at scale."},S=()=>x.map(e=>({category:e,description:T[e]||"",items:s.filter(n=>(n.frontmatter.category||"Builds")===e)})).filter(e=>e.items.length>0),C=[{href:"/projects/emi-calculator",name:"EMI Scenario Planner",tagline:"Loan what-ifs, side by side",description:"Build home-loan repayment scenarios and compare them: a higher EMI, a longer or shorter tenure, an annual step-up, a 13th EMI, a one-off prepayment — and what each one saves in interest and years.",tags:["Personal finance","Home loan","India"],icon:"calculator"}],P=t=>t?new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}):"";export{C as T,I as a,k as b,P as f,A as g,S as p};
