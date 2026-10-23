---
title: "Building with Claude"
date: 2026-10-13
description: "A four-part training series I ran for my team on building with Claude: engineering practices, using Claude well, deciding what to build, and guardrails."
tags: [ai, workflows, engineering-leadership, tooling]
layout: deck
---

<!--
Slide deck (`layout: deck`): this body is raw HTML, not Markdown, rendered by DeckContent.
Each

<section class="slide"> is one slide; data-part groups slides into parts, and divider
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
      <div><span class="pn">Part 1</span><b>Engineering workflow</b></div>
      <div><span class="pn">Part 2</span><b>Using Claude well</b></div>
      <div><span class="pn">Part 3</span><b>Beyond code</b></div>
      <div><span class="pn">Part 4</span><b>Guardrails and mindset</b></div>
    </div>
  </div>
  <figure class="plate"><figcaption><b>Fig. 0</b>Each dot stands for a Claude Code session my team ran; about 1 in 65 became a pull request (blue). This series is about turning more grey into blue.</figcaption><img alt="A field of grey dots in which about 1 in 65 is blue" src="/images/blog/building-with-claude/fig-0.png"></figure>
</section>

<section class="slide" data-part="0" aria-label="How this series works">
  <h2>How this series works</h2>
  <p class="sub">Engineering practices and Claude usage habits have their own sections.</p>
  <div class="body">
    <div class="row c4">
      <div class="card"><span class="tag info">Part 1</span><p class="big">Engineering workflow</p><p class="mt-s">Plan, build, verify and ship. These standards apply with or without AI.</p></div>
      <div class="card"><span class="tag info">Part 2</span><p class="big">Using Claude well</p><p class="mt-s">Voice typing, context, instruction files and review habits.</p></div>
      <div class="card"><span class="tag info">Part 3</span><p class="big">Beyond code</p><p class="mt-s">Decide what to build; use Claude for specs, docs, analysis and QA.</p></div>
      <div class="card"><span class="tag info">Part 4</span><p class="big">Guardrails</p><p class="mt-s">Protect data and tenants. Own the output and the decision to ship.</p></div>
    </div>
  </div>
</section>

<!-- ============ PART 1 ============ -->
<section class="slide divider" data-part="1" data-tab="Engineering" aria-label="Part 1">
  <div class="dv">
    <div class="pn">Part 1</div>
    <h2 class="hero">Engineering workflow</h2>
    <p class="meta">Engineering and QA</p>
    <ul class="covers">
      <li>Process before prompts</li>
      <li>Plan, slice, test and verify</li>
      <li>Clear rules and pure business logic</li>
      <li>Retries, rollout and recovery</li>
      <li>Branch, update, and squash and merge</li>
      <li>Turn mistakes into rules</li>
    </ul>
  </div>
  <figure class="plate"><figcaption><b>Fig. 1</b>The six stations on the outer ring are our workflow steps, from plan to PR. Each inner ring is another pass through the loop, tightening toward a clean result.</figcaption><img alt="Concentric loops converging, with six stations on the outer ring" src="/images/blog/building-with-claude/fig-2.png"></figure>
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
        <li>These practices work together: clear scope, evidence, review and accountability.</li>
      </ul>
    </div>
  </div>
</section>

<section class="slide" data-part="1" aria-label="The loop">
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

<section class="slide" data-part="1" aria-label="Our 20 rules">
  <h2>Our 20 rules, grouped</h2>
  <div class="body">
    <div class="rules">
      <div class="card"><h3>Write it clearly</h3><ul>
        <li>Explicitness over cleverness</li>
        <li>Boring over clever</li>
        <li>DRY: one home for each piece of business logic</li>
        <li>No hardcoded values or magic numbers</li>
        <li>No dead code, unused imports or unreachable branches</li>
      </ul></div>
      <div class="card"><h3>Structure it well</h3><ul>
        <li>Changes don't ripple across layers</li>
        <li>Side effects at the edges, pure business logic</li>
        <li>Can't test it in isolation? Fix the structure</li>
        <li>Smallest change that solves the problem</li>
        <li>Public interfaces stay backward compatible</li>
      </ul></div>
      <div class="card"><h3>Keep it safe</h3><ul>
        <li>Fail loudly, fail early</li>
        <li>Tenant isolation is a hard constraint</li>
        <li>Never assume a method, field or service exists</li>
        <li>Idempotent by default</li>
        <li>Log state changes and external calls</li>
      </ul></div>
      <div class="card"><h3>Ship it properly</h3><ul>
        <li>Don't assume, prove it</li>
        <li>Tests aren't optional under deadlines</li>
        <li>Local testing before every PR</li>
        <li>Docs are part of the work</li>
        <li>Don't change what you weren't asked to</li>
      </ul></div>
    </div>
  </div>
</section>

<section class="slide" data-part="1" aria-label="Only what was asked">
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

<section class="slide" data-part="1" aria-label="Tests">
  <h2>Tests that actually prove something</h2>
  <div class="body">
    <div class="row cn center">
      <ul class="notes">
        <li>For a bug, ask for a failing test first, then the fix.</li>
        <li>Every bug fix leaves a regression test behind.</li>
        <li>Never weaken assertions to hide a defect. When requirements change, explain and review the test changes.</li>
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

<section class="slide" data-part="1" aria-label="Runtime verification">
  <h2>Prove behaviour in the real system</h2>
  <div class="body">
    <div class="row c3">
      <div class="card"><h3>Unit</h3><p>Define observable acceptance criteria. Test the rule, its boundaries and failures; mocked responses cannot prove a real integration.</p></div>
      <div class="card"><h3>Integration</h3><p>Exercise real database or service boundaries in a test environment. Verify permissions and tenant isolation on reads and writes.</p></div>
      <div class="card"><h3>Runtime</h3><p>Run the changed user flow in its actual browser, host or device. Check failure states, errors and logs.</p></div>
    </div>
    <p class="callout">Handoff: what ran, where, the result, and what remains unverified. If the host or service is unavailable, say so.</p>
  </div>
</section>

<section class="slide" data-part="1" aria-label="Fail loudly">
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

<section class="slide" data-part="1" aria-label="Pure core">
  <h2>Pure core, I/O at the edges</h2>
  <div class="body">
    <div class="row cn center">
      <ul class="notes">
        <li>Business logic takes values and returns values. Easy to test, no mocks.</li>
        <li>Thresholds come from config, not literals.</li>
        <li>Prove retries cannot double-apply a write; enforce operation identity and atomicity at the boundary.</li>
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

<section class="slide" data-part="1" aria-label="Retries and partial failure">
  <h2>Design for retries and partial failure</h2>
  <div class="body">
    <div class="row c3">
      <div class="card"><h3>Operation identity</h3><p>A timeout may follow a successful write. Enforce deduplication atomically with a tenant-scoped operation key; an upsert alone is insufficient.</p></div>
      <div class="card"><h3>Recovery</h3><p>Use transactions for related database writes. Track external effects and recovery. Configure bounded retries, backoff and timeouts.</p></div>
      <div class="card"><h3>Proof</h3><p>Test duplicate requests, concurrent retries and interruption between steps. Prove one tenant cannot reuse another tenant's result.</p></div>
    </div>
    <p class="callout">Prompt: "The write succeeded but its response was lost. Prove a retry cannot apply it twice, and show how partial work recovers."</p>
  </div>
</section>

<section class="slide" data-part="1" aria-label="Rollout and recovery">
  <h2>Plan the rollout and recovery</h2>
  <div class="body">
    <div class="row c3">
      <div class="card"><h3>Compatibility</h3><p>Check existing callers and mixed versions. Rehearse migrations on synthetic data, including locks, backfills and recovery.</p></div>
      <div class="card"><h3>Exposure</h3><p>Use a feature flag or staged rollout where appropriate. Name the owner, success signals and conditions that stop the rollout.</p></div>
      <div class="card"><h3>Recovery</h3><p>Monitor errors and user outcomes. Test rollback or forward-fix steps. Reverting code may not undo changed data.</p></div>
    </div>
    <p class="callout">Before release: put ownership, monitoring and recovery steps in the PR. Production changes need explicit approval.</p>
  </div>
</section>

<section class="slide" data-part="1" aria-label="Pre-PR checklist">
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

<section class="slide" data-part="1" aria-label="Pull and push">
  <h2>Pull and push</h2>
  <p class="sub">Git keeps a copy of the history on GitHub and a copy on your laptop. Pull and push move commits between them.</p>
  <div class="body">
    <svg class="dia" viewBox="0 0 960 290" role="img" aria-label="A teammate's commit D moves from GitHub to your laptop with git pull. Your commit E moves from your laptop to GitHub with git push.">
      <defs><marker id="gm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--dk-accent)"/></marker></defs>
      <text class="g-row" x="20" y="85">GitHub</text>
      <text class="g-row" x="20" y="225">Your laptop</text>
      <line class="g-line" x1="220" y1="80" x2="460" y2="80"/>
      <line class="g-line" x1="220" y1="220" x2="460" y2="220"/>
      <g><circle class="g-c" cx="220" cy="80" r="17"/><text class="g-lbl" x="220" y="80">A</text></g>
      <g><circle class="g-c" cx="340" cy="80" r="17"/><text class="g-lbl" x="340" y="80">B</text></g>
      <g><circle class="g-c" cx="460" cy="80" r="17"/><text class="g-lbl" x="460" y="80">C</text></g>
      <g><circle class="g-c" cx="220" cy="220" r="17"/><text class="g-lbl" x="220" y="220">A</text></g>
      <g><circle class="g-c" cx="340" cy="220" r="17"/><text class="g-lbl" x="340" y="220">B</text></g>
      <g><circle class="g-c" cx="460" cy="220" r="17"/><text class="g-lbl" x="460" y="220">C</text></g>

      <line class="g-line gd" pathLength="1" x1="477" y1="80" x2="563" y2="80" style="--d:0.3s"/>
      <g class="ga" style="--d:0.3s;--fs:0.4"><circle class="g-c" cx="580" cy="80" r="17"/><text class="g-lbl" x="580" y="80">D</text></g>
      <text class="g-note mid ga" x="580" y="38" style="--d:0.6s">a teammate merged this</text>

      <line class="g-arrow ga" x1="580" y1="102" x2="580" y2="196" marker-end="url(#gm-arrow)" style="--d:1.2s"/>
      <text class="g-cmd ga" x="598" y="155" style="--d:1.2s">git pull</text>
      <line class="g-line gd" pathLength="1" x1="477" y1="220" x2="563" y2="220" style="--d:1.6s"/>
      <g class="ga" style="--d:1.6s;--fy:-140px"><circle class="g-c" cx="580" cy="220" r="17"/><text class="g-lbl" x="580" y="220">D</text></g>

      <line class="g-line gd" pathLength="1" x1="597" y1="220" x2="683" y2="220" style="--d:2.4s"/>
      <g class="ga" style="--d:2.4s;--fs:0.4"><circle class="g-f" cx="700" cy="220" r="17"/><text class="g-lbl" x="700" y="220">E</text></g>
      <text class="g-note mid ga" x="700" y="268" style="--d:2.6s">your commit</text>

      <line class="g-arrow ga" x1="700" y1="198" x2="700" y2="104" marker-end="url(#gm-arrow)" style="--d:3.1s"/>
      <text class="g-cmd ga" x="718" y="155" style="--d:3.1s">git push</text>
      <line class="g-line gd" pathLength="1" x1="597" y1="80" x2="683" y2="80" style="--d:3.5s"/>
      <g class="ga" style="--d:3.5s;--fy:140px"><circle class="g-f" cx="700" cy="80" r="17"/><text class="g-lbl" x="700" y="80">E</text></g>
    </svg>
    <div class="row c2 mt">
      <div class="card soft"><h3>git pull</h3><p>Gets new commits from GitHub and adds them to your branch. On a feature branch, <code>git pull origin main</code> brings in main's new commits with a merge commit.</p></div>
      <div class="card soft"><h3>git push</h3><p>Sends your commits to GitHub. Push your feature branch. Never push directly to main.</p></div>
    </div>
  </div>
</section>

<section class="slide" data-part="1" aria-label="Stage 1: branch and commit">
  <ol class="stages" aria-label="Stages"><li class="on">1 Branch and commit</li><li>2 Update your branch</li><li>3 Merge the PR</li></ol>
  <h2>Stage 1: branch and commit</h2>
  <p class="sub">Start from the latest main, create your branch, and commit as often as you like. Main keeps moving while you work. There is only one way to do this stage.</p>
  <div class="body">
    <svg class="dia" viewBox="0 0 960 270" role="img" aria-label="A feature branch starts at commit C. Commits F1, F2 and F3 go on the branch. At the same time, commits D and E go on main.">
      <text class="g-row" x="20" y="205">main</text>
      <text class="g-row ga" x="20" y="95" style="--d:0.5s">feature</text>
      <line class="g-line" x1="100" y1="200" x2="280" y2="200"/>
      <!-- Drawn before the commits, so the line passes under C. -->
      <path class="g-feat-line gd" pathLength="1" d="M280,200 C325,200 325,90 370,90" style="--d:0.4s"/>
      <g><circle class="g-c" cx="100" cy="200" r="17"/><text class="g-lbl" x="100" y="200">A</text></g>
      <g><circle class="g-c" cx="190" cy="200" r="17"/><text class="g-lbl" x="190" y="200">B</text></g>
      <g><circle class="g-c" cx="280" cy="200" r="17"/><text class="g-lbl" x="280" y="200">C</text></g>

      <text class="g-cmd ga" x="400" y="40" style="--d:0.5s">git switch -c feature/min-display-qty</text>
      <g class="ga" style="--d:0.8s;--fs:0.4"><circle class="g-f" cx="370" cy="90" r="17"/><text class="g-lbl" x="370" y="90">F1</text></g>
      <line class="g-feat-line gd" pathLength="1" x1="387" y1="90" x2="443" y2="90" style="--d:1.2s"/>
      <g class="ga" style="--d:1.2s;--fs:0.4"><circle class="g-f" cx="460" cy="90" r="17"/><text class="g-lbl" x="460" y="90">F2</text></g>
      <line class="g-feat-line gd" pathLength="1" x1="477" y1="90" x2="533" y2="90" style="--d:1.6s"/>
      <g class="ga" style="--d:1.6s;--fs:0.4"><circle class="g-f" cx="550" cy="90" r="17"/><text class="g-lbl" x="550" y="90">F3</text></g>

      <line class="g-line gd" pathLength="1" x1="297" y1="200" x2="443" y2="200" style="--d:2.2s"/>
      <g class="ga" style="--d:2.2s;--fs:0.4"><circle class="g-c" cx="460" cy="200" r="17"/><text class="g-lbl" x="460" y="200">D</text></g>
      <line class="g-line gd" pathLength="1" x1="477" y1="200" x2="533" y2="200" style="--d:2.6s"/>
      <g class="ga" style="--d:2.6s;--fs:0.4"><circle class="g-c" cx="550" cy="200" r="17"/><text class="g-lbl" x="550" y="200">E</text></g>
      <text class="g-note ga" x="580" y="205" style="--d:2.9s">teammates merged D and E</text>
    </svg>
    <p class="callout">Your work and main have now moved apart. Before you merge, you must bring main's new commits (D and E) into your branch. That is stage 2.</p>
  </div>
</section>

<section class="slide" data-part="1" aria-label="Stage 2, option A: merge main in">
  <ol class="stages" aria-label="Stages"><li>1 Branch and commit</li><li class="on">2 Update your branch</li><li>3 Merge the PR</li></ol>
  <h2>Stage 2, option A: merge main in</h2>
  <p class="sub">Pull main into your branch. Git makes a merge commit M1 on your branch. If main and your work changed the same lines, git stops once and you fix the conflict, on your branch, not on main.</p>
  <div class="body">
    <svg class="dia" viewBox="0 0 960 262" role="img" aria-label="git pull origin main joins E to a new merge commit M1 after F3 on the feature branch. M1 has a conflict. You fix the files, run git add and git commit, and the conflict clears.">
      <path class="g-feat-line" d="M280,200 C325,200 325,90 370,90"/>
      <!-- Lines are drawn before the commits, so they pass under them. -->
      <line class="g-feat-line gd" pathLength="1" x1="567" y1="90" x2="623" y2="90" style="--d:0.6s"/>
      <path class="g-line gd" pathLength="1" d="M567,200 C610,200 600,90 623,90" style="--d:0.6s"/>
      <text class="g-row" x="20" y="205">main</text>
      <text class="g-row" x="20" y="95">feature</text>
      <line class="g-line" x1="100" y1="200" x2="533" y2="200"/>
      <g><circle class="g-c" cx="100" cy="200" r="17"/><text class="g-lbl" x="100" y="200">A</text></g>
      <g><circle class="g-c" cx="190" cy="200" r="17"/><text class="g-lbl" x="190" y="200">B</text></g>
      <g><circle class="g-c" cx="280" cy="200" r="17"/><text class="g-lbl" x="280" y="200">C</text></g>
      <g><circle class="g-c" cx="460" cy="200" r="17"/><text class="g-lbl" x="460" y="200">D</text></g>
      <g><circle class="g-c" cx="550" cy="200" r="17"/><text class="g-lbl" x="550" y="200">E</text></g>
          <line class="g-feat-line" x1="387" y1="90" x2="443" y2="90"/>
          <line class="g-feat-line" x1="477" y1="90" x2="533" y2="90"/>
          <g><circle class="g-f" cx="370" cy="90" r="17"/><text class="g-lbl" x="370" y="90">F1</text></g>
          <g><circle class="g-f" cx="460" cy="90" r="17"/><text class="g-lbl" x="460" y="90">F2</text></g>
          <g><circle class="g-f" cx="550" cy="90" r="17"/><text class="g-lbl" x="550" y="90">F3</text></g>
      <text class="g-cmd ga" x="100" y="40" style="--d:0.3s">git pull origin main</text>
      <g class="ga" style="--d:1s;--fs:0.3"><circle class="g-f" cx="640" cy="90" r="17"/><text class="g-lbl" x="640" y="90">M1</text></g>
      <g class="go" style="--d:3s"><circle class="g-conflict ga" cx="640" cy="90" r="24" style="--d:1.3s;--fs:1.4"/></g>
      <g class="go" style="--d:3s"><g class="ga" style="--d:1.5s;--fy:8px">
        <rect class="g-pop" x="560" y="16" width="380" height="34" rx="8"/>
        <text class="g-pop-msg" x="576" y="38">Conflict: fix files, git add, git commit</text>
      </g></g>
      <text class="g-note ga" x="670" y="95" style="--d:3.2s">resolved: your branch now has D and E</text>
    </svg>
    <div class="row c3 mt">
      <div class="card soft"><h3>Your commits</h3><p>F1, F2 and F3 stay as they are. M1 records the update.</p></div>
      <div class="card soft"><h3>If there is a conflict</h3><p>Git stops and marks the lines in the files. Fix them, then <code>git add</code> the files.</p></div>
      <div class="card soft"><h3>To finish</h3><p><code>git commit</code> completes M1. Run the tests. You fix conflicts once, for all your commits.</p></div>
    </div>
  </div>
</section>

<section class="slide" data-part="1" aria-label="Stage 2, option B: rebase on main">
  <ol class="stages" aria-label="Stages"><li>1 Branch and commit</li><li class="on">2 Update your branch</li><li>3 Merge the PR</li></ol>
  <h2>Stage 2, option B: rebase on main</h2>
  <p class="sub">Git puts D and E under your work and replays F1, F2 and F3 after E. Only your branch changes. A merge stops once for conflicts; a rebase can stop at each commit that conflicts.</p>
  <div class="body">
    <svg class="dia" viewBox="0 0 960 262" role="img" aria-label="git rebase origin/main replays the feature commits after E, one at a time. F1 moves cleanly. F2 stops with a conflict: you fix the files, run git add and git rebase --continue. Then F3 moves. Main does not change.">
      <!-- Lines are drawn before the commits, so they pass under C and E. -->
      <!-- The old branch stays as a ghost until its last commit has moved. -->
      <g class="go" style="--d:3.6s">
        <path class="g-feat-line" d="M280,200 C325,200 325,90 370,90 L533,90"/>
      </g>
      <line class="g-feat-line gd" pathLength="1" x1="657" y1="90" x2="713" y2="90" style="--d:2s"/>
      <line class="g-feat-line gd" pathLength="1" x1="747" y1="90" x2="803" y2="90" style="--d:4.2s"/>
      <path class="g-feat-line gd" pathLength="1" d="M550,200 C595,200 595,90 640,90" style="--d:1.1s"/>
      <text class="g-row" x="20" y="205">main</text>
      <text class="g-row" x="20" y="95">feature</text>
      <line class="g-line" x1="100" y1="200" x2="533" y2="200"/>
      <g><circle class="g-c" cx="100" cy="200" r="17"/><text class="g-lbl" x="100" y="200">A</text></g>
      <g><circle class="g-c" cx="190" cy="200" r="17"/><text class="g-lbl" x="190" y="200">B</text></g>
      <g><circle class="g-c" cx="280" cy="200" r="17"/><text class="g-lbl" x="280" y="200">C</text></g>
      <g><circle class="g-c" cx="460" cy="200" r="17"/><text class="g-lbl" x="460" y="200">D</text></g>
      <g><circle class="g-c" cx="550" cy="200" r="17"/><text class="g-lbl" x="550" y="200">E</text></g>
      <text class="g-cmd ga" x="100" y="40" style="--d:0.3s">git rebase origin/main</text>

      <!-- Git replays one commit at a time; the new lines are drawn as each commit arrives. -->
      <g class="gm" style="--d:0.6s;--mx:270px;--my:0px">
        <g><circle class="g-f" cx="370" cy="90" r="17"/><text class="g-lbl" x="370" y="90">F1</text></g>
      </g>
      <g class="gm" style="--d:1.4s;--mx:270px;--my:0px">
        <g><circle class="g-f" cx="460" cy="90" r="17"/><text class="g-lbl" x="460" y="90">F2</text></g>
        <g class="go" style="--d:3.4s"><circle class="g-conflict ga" cx="460" cy="90" r="24" style="--d:2.1s;--fs:1.4"/></g>
      </g>
      <g class="gm" style="--d:3.6s;--mx:270px;--my:0px">
        <g><circle class="g-f" cx="550" cy="90" r="17"/><text class="g-lbl" x="550" y="90">F3</text></g>
      </g>

      <g class="go" style="--d:3.4s"><g class="ga" style="--d:2.2s;--fy:8px">
        <rect class="g-pop" x="560" y="16" width="380" height="34" rx="8"/>
        <text class="g-pop-msg" x="576" y="38">F2 conflicts: fix files, git add, continue</text>
      </g></g>
      <text class="g-cmd ga" x="100" y="250" style="--d:2.6s">git rebase --continue</text>
      <text class="g-note mid ga" x="730" y="130" style="--d:4.4s">your branch: A B C D E F1 F2 F3</text>
      <text class="g-note ga" x="580" y="205" style="--d:4.4s">main does not change</text>
    </svg>
    <div class="row c3 mt">
      <div class="card soft"><h3>Your commits</h3><p>D and E come into your branch. F1, F2 and F3 are replayed after E, one at a time, with new IDs.</p></div>
      <div class="card soft"><h3>If there is a conflict</h3><p>The rebase stops at that commit (here F2) and marks the lines. Fix them, then <code>git add</code> the files.</p></div>
      <div class="card soft"><h3>To finish</h3><p><code>git rebase --continue</code> replays the next commit. Repeat for each commit that stops, then run the tests.</p></div>
  </div>
</section>

<section class="slide" data-part="1" aria-label="Stage 3: merge the PR">
  <ol class="stages" aria-label="Stages"><li>1 Branch and commit</li><li>2 Update your branch</li><li class="on">3 Merge the PR</li></ol>
  <h2>Stage 3: merge the PR, three ways</h2>
  <p class="sub">Your branch is up to date and the PR is approved. GitHub can put it on main in three ways.</p>
  <div class="body">
    <div class="row c3 panels">
      <div class="panel">
        <h3>Merge commit </h3>
        <svg class="dia" viewBox="0 0 340 210" role="img" aria-label="Merge commit">
          <path class="g-feat-line" d="M120,160 C150,160 150,60 175,60"/>
          <line class="g-line gd" pathLength="1" x1="134" y1="160" x2="300" y2="160" style="--d:0.6s"/>
          <path class="g-feat-line gd" pathLength="1" d="M289,60 C315,60 305,160 300,160" style="--d:0.6s"/>
          <line class="g-line" x1="20" y1="160" x2="106" y2="160"/>
          <g><circle class="g-c" cx="20" cy="160" r="14"/><text class="g-lbl" x="20" y="160">C</text></g>
          <g><circle class="g-c" cx="70" cy="160" r="14"/><text class="g-lbl" x="70" y="160">D</text></g>
          <g><circle class="g-c" cx="120" cy="160" r="14"/><text class="g-lbl" x="120" y="160">E</text></g>
          <line class="g-feat-line" x1="189" y1="60" x2="211" y2="60"/><line class="g-feat-line" x1="239" y1="60" x2="261" y2="60"/>
            <g><circle class="g-f" cx="175" cy="60" r="14"/><text class="g-lbl" x="175" y="60">F1</text></g>
            <g><circle class="g-f" cx="225" cy="60" r="14"/><text class="g-lbl" x="225" y="60">F2</text></g>
            <g><circle class="g-f" cx="275" cy="60" r="14"/><text class="g-lbl" x="275" y="60">F3</text></g>
          <g class="ga" style="--d:1.1s;--fs:0.3"><circle class="g-new" cx="316" cy="160" r="16"/><text class="g-lbl w" x="316" y="160">M</text></g>
        </svg>
        <p>Main gets every commit plus merge commit M. History has side streams. Roll back: <code>git revert -m 1 M</code>.</p>
      </div>
      <div class="panel">
        <h3>Rebase and merge </h3>
        <svg class="dia" viewBox="0 0 340 210" role="img" aria-label="Rebase and merge">
          <path class="g-feat-line go" d="M120,160 C150,160 150,60 175,60" style="--d:0.6s"/>
          <line class="g-line gd" pathLength="1" x1="134" y1="160" x2="161" y2="160" style="--d:1.2s"/>
          <line class="g-line" x1="20" y1="160" x2="106" y2="160"/>
          <g><circle class="g-c" cx="20" cy="160" r="14"/><text class="g-lbl" x="20" y="160">C</text></g>
          <g><circle class="g-c" cx="70" cy="160" r="14"/><text class="g-lbl" x="70" y="160">D</text></g>
          <g><circle class="g-c" cx="120" cy="160" r="14"/><text class="g-lbl" x="120" y="160">E</text></g>
          <g class="gm" style="--d:0.6s;--mx:0px;--my:100px">
            <line class="g-feat-line" x1="189" y1="60" x2="211" y2="60"/><line class="g-feat-line" x1="239" y1="60" x2="261" y2="60"/>
            <g><circle class="g-f" cx="175" cy="60" r="14"/><text class="g-lbl" x="175" y="60">F1</text></g>
            <g><circle class="g-f" cx="225" cy="60" r="14"/><text class="g-lbl" x="225" y="60">F2</text></g>
            <g><circle class="g-f" cx="275" cy="60" r="14"/><text class="g-lbl" x="275" y="60">F3</text></g>
          </g>
        </svg>
        <p>Main gets every commit, in a straight line. Roll back: revert each commit.</p>
      </div>
      <div class="panel chosen">
        <h3>Squash and merge <span class="tag good">Our choice</span></h3>
        <svg class="dia" viewBox="0 0 340 210" role="img" aria-label="Squash and merge">
          <path class="g-feat-line go" d="M120,160 C150,160 150,60 175,60" style="--d:0.5s"/>
          <line class="g-line gd" pathLength="1" x1="134" y1="160" x2="159" y2="160" style="--d:1.1s"/>
          <line class="g-line" x1="20" y1="160" x2="106" y2="160"/>
          <g><circle class="g-c" cx="20" cy="160" r="14"/><text class="g-lbl" x="20" y="160">C</text></g>
          <g><circle class="g-c" cx="70" cy="160" r="14"/><text class="g-lbl" x="70" y="160">D</text></g>
          <g><circle class="g-c" cx="120" cy="160" r="14"/><text class="g-lbl" x="120" y="160">E</text></g>
          <g class="go" style="--d:0.6s;--tx:0px;--ty:100px;--ts:0.4"><g><circle class="g-f" cx="175" cy="60" r="14"/><text class="g-lbl" x="175" y="60">F1</text></g></g>
          <g class="go" style="--d:0.6s;--tx:-50px;--ty:100px;--ts:0.4"><line class="g-feat-line" x1="161" y1="60" x2="211" y2="60"/><g><circle class="g-f" cx="225" cy="60" r="14"/><text class="g-lbl" x="225" y="60">F2</text></g></g>
          <g class="go" style="--d:0.6s;--tx:-100px;--ty:100px;--ts:0.4"><line class="g-feat-line" x1="239" y1="60" x2="261" y2="60"/><g><circle class="g-f" cx="275" cy="60" r="14"/><text class="g-lbl" x="275" y="60">F3</text></g></g>
          <g class="ga" style="--d:1.1s;--fs:0.3"><circle class="g-new" cx="175" cy="160" r="17"/><text class="g-lbl w" x="175" y="160">S</text></g>
        </svg>
        <p>Main gets one commit S per PR, in a straight line. Roll back: one <code>git revert S</code>.</p>
      </div>
    </div>
    <p class="callout">We choose squash and merge. Main reads as one commit per feature or fix, and one revert rolls a feature back. Your small commits stay in the PR.</p>
  </div>
</section>

<section class="slide" data-part="1" aria-label="Our suggested workflow">
  <ol class="stages" aria-label="Stages"><li class="on">1 Branch and commit</li><li class="on">2 Update your branch</li><li class="on">3 Merge the PR</li></ol>
  <h2>Our suggested workflow</h2>
  <p class="sub">Branch, update with a merge, then squash and merge. You fix conflicts on your branch, and main gets one commit per PR. Option B (rebase) is also fine in step 2.</p>
  <div class="body">
    <svg class="dia" viewBox="0 0 960 262" role="img" aria-label="Step 1: a branch starts at C and gets F1, F2 and F3 while main gets D and E. Step 2: git pull origin main adds a merge commit M on the branch, joined to E. Step 3: you resolve conflicts and run the tests. Step 4: you raise PR #123. Step 5: squash and merge combines F1, F2, F3 and M into one commit S on main.">
      <text class="g-row" x="20" y="205">main</text>
      <g class="go" style="--d:5.4s"><text class="g-row ga" x="20" y="95" style="--d:0.4s">feature</text></g>
      <line class="g-line" x1="100" y1="200" x2="280" y2="200"/>
      <!-- Lines are drawn before the commits, so they pass under them. -->
      <g class="go" style="--d:5.4s">
        <path class="g-feat-line gd" pathLength="1" d="M280,200 C325,200 325,90 370,90" style="--d:0.3s"/>
        <line class="g-feat-line gd" pathLength="1" x1="387" y1="90" x2="443" y2="90" style="--d:1s"/>
        <line class="g-feat-line gd" pathLength="1" x1="477" y1="90" x2="533" y2="90" style="--d:1.3s"/>
        <line class="g-feat-line gd" pathLength="1" x1="567" y1="90" x2="623" y2="90" style="--d:2.7s"/>
        <path class="g-line gd" pathLength="1" d="M567,200 C610,200 600,90 623,90" style="--d:2.7s"/>
      </g>
      <g><circle class="g-c" cx="100" cy="200" r="17"/><text class="g-lbl" x="100" y="200">A</text></g>
      <g><circle class="g-c" cx="190" cy="200" r="17"/><text class="g-lbl" x="190" y="200">B</text></g>
      <g><circle class="g-c" cx="280" cy="200" r="17"/><text class="g-lbl" x="280" y="200">C</text></g>

      <!-- Step 1: work on the branch while main moves. -->
      <line class="g-line gd" pathLength="1" x1="297" y1="200" x2="443" y2="200" style="--d:1.6s"/>
      <g class="ga" style="--d:1.6s;--fs:0.4"><circle class="g-c" cx="460" cy="200" r="17"/><text class="g-lbl" x="460" y="200">D</text></g>
      <line class="g-line gd" pathLength="1" x1="477" y1="200" x2="533" y2="200" style="--d:1.9s"/>
      <g class="ga" style="--d:1.9s;--fs:0.4"><circle class="g-c" cx="550" cy="200" r="17"/><text class="g-lbl" x="550" y="200">E</text></g>
      <g class="go" style="--d:5.4s;--tx:270px;--ty:110px;--ts:0.4"><g class="ga" style="--d:0.7s;--fs:0.4"><circle class="g-f" cx="370" cy="90" r="17"/><text class="g-lbl" x="370" y="90">F1</text></g></g>
      <g class="go" style="--d:5.4s;--tx:180px;--ty:110px;--ts:0.4"><g class="ga" style="--d:1s;--fs:0.4"><circle class="g-f" cx="460" cy="90" r="17"/><text class="g-lbl" x="460" y="90">F2</text></g></g>
      <g class="go" style="--d:5.4s;--tx:90px;--ty:110px;--ts:0.4"><g class="ga" style="--d:1.3s;--fs:0.4"><circle class="g-f" cx="550" cy="90" r="17"/><text class="g-lbl" x="550" y="90">F3</text></g></g>

      <!-- Step 2: bring main into the branch with a merge commit. -->
      <text class="g-cmd ga" x="100" y="40" style="--d:2.4s">git pull origin main</text>
      <g class="go" style="--d:5.4s;--tx:0px;--ty:110px;--ts:0.4"><g class="ga" style="--d:3s;--fs:0.3"><circle class="g-f" cx="640" cy="90" r="17"/><text class="g-lbl" x="640" y="90">M</text></g></g>

      <!-- Step 3: resolve conflicts. Step 4: raise a PR. -->
      <g class="go" style="--d:4.4s"><g class="ga" style="--d:3.5s;--fy:8px">
        <rect class="g-pop" x="580" y="16" width="360" height="34" rx="8"/>
        <text class="g-pop-msg" x="596" y="38">Resolve conflicts, run tests, commit</text>
      </g></g>
      <g class="go" style="--d:5.4s"><g class="ga" style="--d:4.5s;--fy:8px">
        <rect class="g-pop" x="580" y="16" width="360" height="34" rx="8"/>
        <text class="g-pop-msg" x="596" y="38">Raise PR #123: feature → main</text>
      </g></g>

      <!-- Step 5: squash and merge. -->
      <line class="g-line gd" pathLength="1" x1="567" y1="200" x2="619" y2="200" style="--d:5.8s"/>
      <g class="ga" style="--d:5.9s;--fs:0.3"><circle class="g-new" cx="640" cy="200" r="21"/><text class="g-lbl w" x="640" y="200">S</text></g>
      <text class="g-note ga" x="675" y="205" style="--d:6.3s">S = F1 + F2 + F3 + M (PR #123)</text>
    </svg>
    <ol class="steps mt">
      <li class="gs" style="--d:0.3s"><b>1 Branch</b><code>git switch -c feature/x</code><span>Commit as often as you like.</span></li>
      <li class="gs" style="--d:2.4s"><b>2 Bring main in</b><code>git pull origin main</code><span>A merge commit on your branch.</span></li>
      <li class="gs" style="--d:3.5s"><b>3 Resolve</b><code>git commit</code><span>Fix conflicts, run the tests.</span></li>
      <li class="gs" style="--d:4.5s"><b>4 Raise a PR</b><code>git push, gh pr create</code><span>Push the branch, open the PR.</span></li>
      <li class="gs" style="--d:5.4s"><b>5 Squash and merge</b><code>gh pr merge --squash</code><span>One commit on main.</span></li>
    </ol>
  </div>
</section>

<section class="slide" data-part="1" aria-label="Set it up and ask Claude">
  <h2>Set it up, and let Claude help</h2>
  <div class="body">
    <div class="row c2">
      <ul class="notes">
        <li>In the repo settings, allow only <b>Squash and merge</b>. Delete branches after the merge.</li>
        <li>Keep each PR small: one feature or one fix. A large squash commit is hard to review and hard to roll back.</li>
        <li>Write the PR title and description as the commit message: what changed and why.</li>
        <li>Do not start a branch from another unmerged branch. After a squash, its commits no longer match main.</li>
        <li>If you rebased (option B) a branch that you already pushed, push it with <code>git push --force-with-lease</code>.</li>
      </ul>
      <div style="display:grid;gap:1.2cqw">
        <div class="prompt"><div class="ph">Stage 2: update with Claude</div><pre>Merge origin/main into this branch.
Show me each conflict and explain both sides
before you resolve it. Then run the tests.</pre></div>
        <div class="prompt"><div class="ph">Stage 3: merge with Claude</div><pre>Open a PR for this branch. Write the title and
description as the commit message. After review,
merge it with gh pr merge --squash.</pre></div>
        <div class="prompt"><div class="ph good">Roll back with Claude</div><pre>Find the squash commit for PR #123 on main.
Create a branch, run git revert on that commit,
run the tests and open a PR. Do not push to main.</pre></div>
      </div>
    </div>
  </div>
</section>

<section class="slide" data-part="1" aria-label="Turn mistakes into rules">
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

<section class="slide statement" data-part="1" aria-label="The formula">
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

<!-- ============ PART 2 ============ -->
<section class="slide divider" data-part="2" data-tab="Using Claude" aria-label="Part 2">
  <div class="dv">
    <div class="pn">Part 2</div>
    <h2 class="hero">Using Claude well</h2>
    <p class="meta">Hands-on habits</p>
    <ul class="covers">
      <li>Voice typing and useful context</li>
      <li>Personal, repo and folder instructions</li>
      <li>Referencing Markdown files</li>
      <li>Plan, question and review</li>
      <li>Agent boundaries and context hygiene</li>
    </ul>
  </div>
  <figure class="plate"><figcaption><b>Fig. 2</b>Keep the task, instructions and evidence connected as you iterate with Claude.</figcaption><img alt="Concentric workflow loops" src="/images/blog/building-with-claude/fig-2.png"></figure>
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

<section class="slide" data-part="2" aria-label="Voice typing">
  <h2>Use voice typing to explain the task</h2>
  <div class="body">
    <div class="row c3">
      <div class="card"><h3>Speak the context</h3><p>Explain the goal, who it affects, the current behaviour, constraints and why it matters. Use your usual voice-typing tool.</p></div>
      <div class="card"><h3>Check the transcript</h3><p>Correct names, paths, numbers and negations. A missed “do not” can reverse the instruction; ask Claude to clarify ambiguity.</p></div>
      <div class="card"><h3>Confirm the brief</h3><p>Ask Claude to summarize the goal, scope, acceptance criteria and open questions before it implements the change.</p></div>
    </div>
    <p class="callout">Prompt: “I am dictating rough notes. Ask about anything unclear, then turn them into a brief for me to confirm.”</p>
  </div>
</section>

<section class="slide" data-part="2" aria-label="Relevant context">
  <h2>Give more relevant context as you learn</h2>
  <div class="body">
    <div class="row c3">
      <div class="card"><h3>Start with the goal</h3><p>Describe expected behaviour, non-goals and acceptance criteria. Point to the relevant files and examples; include only synthetic or redacted data.</p></div>
      <div class="card"><h3>Add evidence</h3><p>Provide exact errors, reproduction steps and what you already tried. Label facts, assumptions and decisions so the agent can tell them apart.</p></div>
      <div class="card"><h3>Keep refining</h3><p>Answer questions and correct misunderstandings. Ask for a restatement before changes; save stable lessons in the right instruction file.</p></div>
    </div>
    <p class="callout">Useful detail reduces guessing. Keep unrelated history out; more text alone does not guarantee a better result.</p>
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

<section class="slide" data-part="2" aria-label="Personal repo and folder instructions">
  <h2>Put each instruction at the right level</h2>
  <div class="body">
    <div class="row c3">
      <div class="card"><h3>Personal</h3><p><code>~/.claude/CLAUDE.md</code><br>Your cross-project preferences: communication style, voice-typing corrections and how you like decisions explained.</p></div>
      <div class="card"><h3>Repository</h3><p><code>repo/CLAUDE.md</code><br>Shared architecture, verified commands, test expectations and definition of done. Commit and review it with the team.</p></div>
      <div class="card"><h3>Folder</h3><p><code>repo/api/CLAUDE.md</code><br>Local contracts, fixtures and conventions. Add one where rules differ; avoid copying the root instructions.</p></div>
    </div>
    <p class="callout">Example: personal = ask about ambiguous dictation; repo = run the agreed checks; API folder = preserve response contracts.</p>
  </div>
</section>

<section class="slide" data-part="2" aria-label="Instruction file layout">
  <h2>A small instruction-file architecture</h2>
  <div class="body">
    <div class="row c2 center">
<pre class="code">~/.claude/CLAUDE.md  <span class="c"># personal</span>

repo/
  CLAUDE.md          <span class="c"># repo</span>
  docs/
    architecture.md <span class="c"># design</span>
    testing.md      <span class="c"># tests</span>
  api/
    CLAUDE.md       <span class="c"># API rules</span>
  web/
    CLAUDE.md       <span class="c"># UI rules</span></pre>
      <ul class="notes sm">
        <li>Personal and applicable ancestor instructions load at startup.</li>
        <li>Nested CLAUDE.md files load when Claude works with files in that subtree.</li>
        <li>Keep each file focused. Remove contradictory or stale instructions.</li>
        <li>These files guide behaviour; enforce access limits with tool permissions.</li>
      </ul>
    </div>
    <p class="xs mt">Reference: <a href="https://code.claude.com/docs/en/memory">Claude Code instruction files</a>.</p>
  </div>
</section>

<section class="slide" data-part="2" aria-label="Referencing other Markdown files">
  <h2>Reference other Markdown files</h2>
  <div class="body">
    <div class="row c2 center">
<pre class="code"><span class="c"># Example repo/CLAUDE.md contents</span>

<span class="k">## Always-needed guidance</span>
@docs/testing.md

<span class="k">## Task-specific reference</span>
For architecture changes, read
`docs/architecture.md` first.

<span class="k">## Completion</span>
Report checks run and remaining gaps.</pre>
      <ul class="notes sm">
        <li><code>@docs/testing.md</code> imports that file into context. Put the import outside code fences in the actual CLAUDE.md.</li>
        <li>Relative imports resolve from the importing file.</li>
        <li>A plain path or link is a reference, not an automatic import. Say when to read it.</li>
        <li>Imports consume context too. Keep one authoritative copy of each rule.</li>
      </ul>
    </div>
    <p class="xs mt">Reference: <a href="https://code.claude.com/docs/en/memory#import-additional-files">Claude Code imports</a>.</p>
  </div>
</section>

<section class="slide" data-part="2" aria-label="CLAUDE.md">
  <h2>A repo CLAUDE.md you can maintain</h2>
  <div class="body">
    <div class="row c2 center">
      <ul class="notes sm">
        <li>Record what a new contributor needs: architecture, commands, conventions and completion checks.</li>
        <li>Verify every command against this repository before adding it.</li>
        <li>Keep personal habits in your personal file and module details in the relevant folder.</li>
        <li>Review this file with the code; remove stale guidance.</li>
      </ul>
<pre class="code"><span class="c"># Example repo outline</span>
<span class="k">## Architecture</span>
Module boundaries; home for logic.

<span class="k">## Commands</span>
Verified build, lint, test commands.

<span class="k">## Constraints</span>
Tenant scope; compatibility rules.

<span class="k">## Done</span>
Checks run; docs updated; gaps noted.</pre>
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

<section class="slide" data-part="2" aria-label="Agent boundaries">
  <h2>Give the agent clear boundaries</h2>
  <div class="body">
    <div class="row c3">
      <div class="card"><h3>Scope</h3><p>Name allowed files, tools and environments. Use a sandbox, synthetic data and only the access needed.</p></div>
      <div class="card"><h3>Approval</h3><p>Get explicit approval before deleting data, writing to production or deploying. Stop when the task needs wider scope.</p></div>
      <div class="card"><h3>Untrusted input</h3><p>Web pages, logs and tool output are evidence. Instructions inside them cannot expand the task or grant permissions.</p></div>
    </div>
    <p class="callout">Prompt: "Work locally within this scope. Report changed files, commands run and unverified work. Ask before expanding access."</p>
  </div>
</section>

<section class="slide" data-part="2" aria-label="Separate writing from checking">
  <h2>Separate writing from checking</h2>
  <p class="sub">Use a fresh context to challenge the implementation, one lens at a time. Keep human review and tests as required checks.</p>
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
        <li>For a fresh session, carry over the agreed plan, constraints and evidence; leave unrelated history behind.</li>
        <li>Two failed attempts? Stop, re-plan or narrow the task.</li>
        <li>Read every command before approving it, especially migrations, force-push, deletes and CI changes.</li>
      </ul>
    </div>
  </div>
</section>

<!-- ============ PART 3 ============ -->
<section class="slide divider" data-part="3" data-tab="Beyond code" aria-label="Part 3">
  <div class="dv">
    <div class="pn">Part 3</div>
    <h2 class="hero">Beyond code</h2>
    <p class="meta">Everyone</p>
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
<section class="slide divider" data-part="4" data-tab="Guardrails" aria-label="Part 4">
  <div class="dv">
    <div class="pn">Part 4</div>
    <h2 class="hero">Guardrails and mindset</h2>
    <p class="meta">Everyone</p>
    <ul class="covers">
      <li>Where we are today</li>
      <li>You are the engineer of record</li>
      <li>Data, secrets and tenant isolation</li>
      <li>Merging is accountability</li>
    </ul>
  </div>
  <figure class="plate"><figcaption><b>Fig. 4</b>Each chamber is one tenant's data, and nothing ever crosses a wall: 25 chambers, zero crossings. The blue chamber is the only one a query should ever touch.</figcaption><img alt="A grid of 25 sealed chambers, one highlighted" src="/images/blog/building-with-claude/fig-1.png"></figure>
</section>

<section class="slide" data-part="4" aria-label="Where we are">
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

<section class="slide" data-part="4" aria-label="Engineer of record">
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

<section class="slide" data-part="4" aria-label="Data in prompts">
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

<section class="slide" data-part="4" aria-label="Tenant isolation">
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

<section class="slide statement" data-part="4" aria-label="Merging is accountability">
  <p class="q">Merging is accountability, not automation.</p>
  <div class="row c3" style="margin-top:3.4cqw">
    <div class="card soft"><h3>Explain every line</h3><p>Never merge code you can't explain to a reviewer.</p></div>
    <div class="card soft"><h3>Watch for rubber stamps</h3><p>As speed goes up, review depth tends to go down. Don't let it.</p></div>
    <div class="card soft"><h3>A human approves</h3><p>Every merge and every deploy is a human decision.</p></div>
  </div>
</section>

<section class="slide" data-part="4" aria-label="This week">
  <h2>This week</h2>
  <div class="body">
    <div class="row c3">
      <div class="card blue"><span class="tag info">1</span><p class="big">Add CLAUDE.md</p><p class="mt-s">To every repo you own, starting from the template in Part 2.</p></div>
      <div class="card blue"><span class="tag info">2</span><p class="big">Plan first</p><p class="mt-s">Use the plan-first prompt on your next task, then review in a fresh session.</p></div>
      <div class="card blue"><span class="tag info">3</span><p class="big">Add useful context</p><p class="mt-s">Dictate the goal and constraints. Check the transcript, then confirm the brief.</p></div>
    </div>
    <p class="xs" style="margin-top:3cqw">Credit to the Engineering Leadership newsletter, whose writing on AI-assisted engineering, pragmatic engineering and multiplier leadership informed much of this series.</p>
  </div>
</section>
