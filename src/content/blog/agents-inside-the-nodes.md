---
title: "Agents Inside the Nodes, Not at the Wheel: Why We Chose a Deterministic Backbone"
date: 2026-05-14
description: "We let AI do the thinking inside each step, but kept a plain, auditable workflow in charge of what happens next. Here is why."
tags: [architecture, ai, agents, workflow]
series: Building a Planning Platform in the Age of Agents
seriesOrder: 2
---

In May 2026 every pitch deck in our market said "agentic". So when we designed the spine of our planning platform, there was real pressure to let an AI agent run the whole process: look at the data, decide the next step, call tools, repeat. I spent a morning arguing for exactly that, and then a week dismantling the argument. This post is about the one question that shaped every engine after it: **what is the backbone, the workflow or the agent?**

## The problem: two shapes, and you only get one

There are two coherent ways to build an "AI-first" product.

1. **Workflow-first.** A plain state machine (a fixed graph of steps) is the spine. AI is one kind of step. The process is declared and visible. Agents have freedom *inside* a step.
2. **Agent-first.** An agent loop is the spine. The agent reasons about what to do next. Deterministic operations are tools it calls. The process emerges as it goes.

Whichever you pick constrains audit, cost, debugging, demos and how much damage a mistake can do. You cannot easily switch later, because every engine grows around the choice.

We tested both shapes against two real scenarios that one engine had to serve:

- **The seasonal financial plan.** Load the baseline, draft assumptions, let planners reconcile, check variance, get sign-off from a finance VP, publish. Heavy on rules and audit.
- **The morning sales-dip check.** A standing agent that scans sales every morning, runs simulations when something looks off, builds a dashboard and offers options. Idle most days, very interactive on bad ones.

## What we considered

The agent-first shape is genuinely attractive. It handles surprises well, it needs less up-front modelling, and it demos beautifully the first time.

The problems showed up when I walked it through the financial plan:

- **Audit.** Financial plans get signed off by CFOs and audited. "The agent decided to publish the plan" does not survive an audit. "Run 12847 of the plan workflow, version 1.2, published after the finance VP approved step a3" does. Without declared structure there is no audit record.
- **Repeatable demos.** Sales engineering needs the same happy path every time: trigger, plan created, approver notified, click, next step. An agent loop varies between runs.
- **Cost.** A pure agent loop burns roughly 10 to 100 times more tokens than a workflow that calls AI only where judgement is actually needed. Across many tenants, each with dozens of daily workflows, that is the difference between healthy margins and a money pit.
- **Debugging.** "Step 3 returned an odd output" takes ten minutes to investigate. "The agent took 47 reasoning steps and we are not sure where it went wrong" takes days.
- **Blast radius.** When an agent gets something wrong (when, not if), a fixed structure contains the damage to one step, with clear inputs, clear outputs and an approval gate downstream.

We also looked at merging workflow and AI into one engine, and at off-the-shelf workflow runtimes like Temporal and Camunda. The merge produced an unmanageable blob: orchestrator, model runtime, tool router and chat surface in one box. The off-the-shelf runtimes were more operational weight than our scale needed, since most of our workflows sit idle waiting on a human.

## The call (and why)

On 14 May we closed it: **a deterministic workflow engine is the backbone, and the AI engine is the intelligence that runs inside `ai` steps.** Chat is still the main thing users touch. But the workflow decides what happens next.

<figure class="diagram">
<svg viewBox="0 0 480 470" role="img" aria-labelledby="t-agents-inside-the-nodes-1">
<title id="t-agents-inside-the-nodes-1">A seasonal plan workflow where AI is one node type among algorithm, human, gate and approval steps</title>
<defs><marker id="arrow-agents-inside-the-nodes" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<rect class="dg-box" x="120" y="10" width="240" height="44" rx="10"/>
<text class="dg-text" x="240" y="38" font-size="15" text-anchor="middle">algo · pull baseline</text>
<line class="dg-line" x1="240" y1="54" x2="240" y2="72" marker-end="url(#arrow-agents-inside-the-nodes)"/>
<rect class="dg-accent" x="120" y="74" width="240" height="44" rx="10"/>
<text class="dg-on-accent" x="240" y="102" font-size="15" text-anchor="middle">ai · draft assumptions</text>
<line class="dg-line" x1="240" y1="118" x2="240" y2="136" marker-end="url(#arrow-agents-inside-the-nodes)"/>
<rect class="dg-box" x="120" y="138" width="240" height="44" rx="10"/>
<text class="dg-text" x="240" y="166" font-size="15" text-anchor="middle">human · planner review</text>
<line class="dg-line" x1="240" y1="182" x2="240" y2="200" marker-end="url(#arrow-agents-inside-the-nodes)"/>
<rect class="dg-box" x="120" y="202" width="240" height="44" rx="10"/>
<text class="dg-text" x="240" y="230" font-size="15" text-anchor="middle">algo · reconcile</text>
<line class="dg-line" x1="240" y1="246" x2="240" y2="264" marker-end="url(#arrow-agents-inside-the-nodes)"/>
<polygon class="dg-box" points="240,266 330,300 240,334 150,300"/>
<text class="dg-text" x="240" y="305" font-size="14" text-anchor="middle">variance &gt; 5%?</text>
<line class="dg-line" x1="150" y1="300" x2="100" y2="350" marker-end="url(#arrow-agents-inside-the-nodes)"/>
<line class="dg-line" x1="330" y1="300" x2="380" y2="350" marker-end="url(#arrow-agents-inside-the-nodes)"/>
<text class="dg-muted" x="105" y="318" font-size="13" text-anchor="middle">yes</text>
<text class="dg-muted" x="375" y="318" font-size="13" text-anchor="middle">no</text>
<rect class="dg-ok" x="20" y="352" width="160" height="44" rx="10"/>
<text class="dg-on-accent" x="100" y="380" font-size="15" text-anchor="middle">approval · VP</text>
<rect class="dg-box" x="300" y="352" width="160" height="44" rx="10"/>
<text class="dg-text" x="380" y="380" font-size="15" text-anchor="middle">auto-approve</text>
<line class="dg-line" x1="100" y1="396" x2="200" y2="420" marker-end="url(#arrow-agents-inside-the-nodes)"/>
<line class="dg-line" x1="380" y1="396" x2="280" y2="420" marker-end="url(#arrow-agents-inside-the-nodes)"/>
<rect class="dg-box" x="160" y="422" width="160" height="40" rx="10"/>
<text class="dg-text" x="240" y="447" font-size="15" text-anchor="middle">publish · notify</text>
</svg>
<figcaption>The shape is fixed and auditable. The filled step is where an agent gets real freedom, with a clear input, a clear output and a gate after it.</figcaption>
</figure>

The split of jobs is strict. The workflow engine owns the graph, run state, schedules, human tasks and when to ask for approval. The AI engine owns prompts, models, tools, reasoning traces and the chat surface. **The workflow never knows about prompts. The AI never decides what happens at the process level.** Each `ai` step is a call that returns a structured result, including "I need a human to choose between these options", which the workflow then routes.

The morning sales-dip check fits the same engine. It is a short workflow: a daily trigger, one big `ai` step that does the analysis, a condition that ends silently on normal days, and a notify-and-approve tail on bad days. Inside that one step the agent has wide latitude. The shape around it does not move.

> "AI-first" is not the same as "agent-orchestrated". For us it means chat-first, AI doing most of the thinking inside steps, and AI helping to write the workflows themselves.

That last part matters. A customer admin can type "set up a seasonal plan with three-tier approval" and an agent drafts the workflow. The runtime stays deterministic; only the *authoring* is conversational. And going more AI-heavy later is just a matter of swapping `algo` steps for `ai` steps. Today's plan might be 30% AI steps; a later version might be 80%. Same engine.

## Who is allowed to change a plan

Two days earlier we had settled a related rule for the chat side, and the two decisions lock together. Every tool an agent can call sits in one of three tiers:

<figure class="diagram">
<svg viewBox="0 0 480 330" role="img" aria-labelledby="t-agents-inside-the-nodes-2">
<title id="t-agents-inside-the-nodes-2">Read, propose and commit tool tiers, with commits routed through the workbook, workflow and approval engines</title>
<defs><marker id="arrow-agents-inside-the-nodes-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<rect class="dg-box" x="10" y="10" width="210" height="82" rx="10"/>
<text class="dg-text" x="24" y="36" font-size="16" font-weight="600">Read</text>
<text class="dg-muted" x="24" y="58" font-size="13">read plan, KPI, snapshot</text>
<text class="dg-muted" x="24" y="78" font-size="13">no side effects</text>
<rect class="dg-box" x="10" y="110" width="210" height="82" rx="10"/>
<text class="dg-text" x="24" y="136" font-size="16" font-weight="600">Propose</text>
<text class="dg-muted" x="24" y="158" font-size="13">plan edit, scenario</text>
<text class="dg-muted" x="24" y="178" font-size="13">returns a diff card</text>
<rect class="dg-accent" x="10" y="210" width="210" height="82" rx="10"/>
<text class="dg-on-accent" x="24" y="236" font-size="16">Commit</text>
<text class="dg-on-accent" x="24" y="258" font-size="13">apply an accepted diff</text>
<text class="dg-on-accent" x="24" y="278" font-size="13">agent mode only</text>
<rect class="dg-box" x="260" y="10" width="210" height="60" rx="10"/>
<text class="dg-text" x="365" y="36" font-size="15" text-anchor="middle">Workbook applies</text>
<text class="dg-muted" x="365" y="56" font-size="13" text-anchor="middle">the only writer</text>
<rect class="dg-box" x="260" y="100" width="210" height="60" rx="10"/>
<text class="dg-text" x="365" y="126" font-size="15" text-anchor="middle">Workflow decides</text>
<text class="dg-muted" x="365" y="146" font-size="13" text-anchor="middle">is approval needed?</text>
<rect class="dg-ok" x="260" y="190" width="210" height="60" rx="10"/>
<text class="dg-on-accent" x="365" y="216" font-size="15" text-anchor="middle">Approval routes</text>
<text class="dg-on-accent" x="365" y="236" font-size="13" text-anchor="middle">only if asked to</text>
<path class="dg-line" d="M220,251 L240,251 L240,40 L258,40" marker-end="url(#arrow-agents-inside-the-nodes-b)"/>
<line class="dg-line" x1="365" y1="70" x2="365" y2="98" marker-end="url(#arrow-agents-inside-the-nodes-b)"/>
<line class="dg-line" x1="365" y1="160" x2="365" y2="188" marker-end="url(#arrow-agents-inside-the-nodes-b)"/>
<text class="dg-muted" x="365" y="282" font-size="13" text-anchor="middle">the AI never writes</text><text class="dg-muted" x="365" y="300" font-size="13" text-anchor="middle">plan data itself</text>
</svg>
<figcaption>Widening what an agent can do means adding tools to a tier. It never opens a new path to the data.</figcaption>
</figure>

This held up when the scope grew. In July we decided the sidebar chat should be a full orchestration agent, with a tool for anything a human can do in the workbook: edit data, create scenarios, tune algorithm settings, rerun algorithms, even run bounded loops toward a goal. That sounds like the agent-first shape coming back. It is not. Every one of those tools still proposes, the workbook still applies, and the workflow still decides. **It is parity of capability, not a bypass.**

## The tradeoffs we accepted

- **Less improvisation.** An agent cannot invent a new process step on the fly. If a customer needs a new shape, someone (or some agent) has to author it and publish it.
- **We built our own runtime.** Skipping Temporal meant writing an event-sourced runner on the SQL database we already operate, plus a separate scheduler. That is code we own forever.
- **Authoring becomes the bottleneck.** If workflows are the product, writing good ones has to be easy. That pushed AI-assisted authoring from nice-to-have to essential.

## What I'd tell another team

- Decide the backbone explicitly and early, then write down the framings you rejected so nobody reopens them every quarter.
- Use your most audited process as the test case, not your flashiest demo.
- Give agents freedom inside a box with a typed input, a typed output and a gate after it.
- Split agent tools into read, propose and commit. Governance then becomes a list, not a debate.
- Let AI write the workflow, not run it. You keep the speed of conversation and the safety of a fixed shape.

The previous post covered how we store a plan. With the backbone settled, the next fights were about design: what a planner should actually see on screen.
