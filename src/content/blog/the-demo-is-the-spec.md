---
title: "The Demo Is the Spec"
date: 2026-08-29
description: "A PRD can be internally consistent and still describe an incoherent product. A working prototype can feel the contradictions that prose hides."
tags: [product, prototyping, ai, design]
---

<!-- The opening scene uses the story-lede treatment; the argument resumes below it. -->
<div class="story-lede">
<p class="story-lede-label">From the work</p>
<p>We had a clean story for each user.</p>
<p>The planner saw an overdue cluster approval. The team lead saw the same delay blocking downstream work. The VP saw the financial consequence at portfolio level. Each view made sense on its own.</p>
<p>The contradiction appeared only when we clicked through all three views in the same running product.</p>
<p>The blocker was technically the same, but the framing, urgency, and next action did not connect. Three individually reasonable specifications had produced one incoherent experience. We had reviewed the documents. We had approved the screens. None of that surfaced the problem.</p>
<p class="story-lede-turn">Using the product did.</p>
</div>

That changed how I think about product specifications:

> A PRD can describe what a product should do. A demo can reveal whether the product makes sense.

When building a working prototype becomes nearly as cheap as writing a thorough document, the prototype should stop being an illustration of the spec. For interaction-heavy products, the demo should become the primary spec.

## Prose cannot feel wrong

A document is read linearly. A product is not.

Users move between pages, roles, decisions, and states. They arrive with history. They leave work half-finished. They see the same business event at different levels of detail. The hardest product problems often live in the gaps between individually correct requirements:

- Does the action on one page create a believable state on the next?
- Do two personas understand the same event consistently?
- Does the system explain why a number changed, not merely show that it changed?
- Can a user recover when they enter a workflow from somewhere other than the happy path?

A PRD can mention all four and still hide the contradictions. Prose is unusually tolerant of seams. A running interface is not.

In our merchandising-platform work, the prototype grew to 41 pages across planner, team-lead, executive, and administrator roles. It used a live simulation engine so approvals, scenarios, blockers, and downstream tasks changed together. That detail mattered. Static screens would have shown visual consistency. Shared state showed product consistency—or its absence.

The same overdue approval had to remain the same business fact everywhere, while changing altitude appropriately:

- The planner needed the next action.
- The team lead needed the dependency and owner.
- The VP needed the consequence and escalation threshold.

That is difficult to validate in three sections of a document. It is obvious after thirty seconds of clicking.

## AI changed the economics, not the standard

“Prototype before building” is not new advice. What changed is the cost.

Historically, a realistic prototype could require enough design and engineering effort that teams reserved it for high-risk flows. The PRD remained the source of truth because it was cheap to edit, easy to circulate, and broad enough to cover the whole product.

AI has compressed the cost of the working version. A runnable, data-driven prototype can now cost roughly what a thorough PRD used to cost. That changes the sensible default.

It does not lower the quality bar. In fact, it raises it.

AI can generate an impressive amount of plausible UI very quickly. Plausible is dangerous. A polished screen can make an unresolved workflow look finished. If the prototype is going to carry specification authority, it needs the same discipline we expect from a serious document:

- Named user and business states, not disconnected screens
- Deterministic fixtures for important paths
- A simulation model that propagates meaningful changes
- A route and journey inventory
- A QA checklist tied to the actual demo flow
- Explicit maturity gates for unfinished areas

We made the working UI a formal design deliverable, not a disposable mock. The demo script doubled as a QA path. The same structured flow later drove guided playback and video capture. One source described the intended journey; several tools consumed it.

Without that rigor, “the demo is the spec” becomes “the prettiest artifact wins.” That is worse than a PRD.

## Let artifacts settle taste debates

One homepage discussion had stalled around two competing directions. Both had reasonable arguments. Neither side lacked vocabulary; more discussion was not going to create evidence.

So we built both.

We then expanded the comparison to six variants, scored them against a ten-dimension rubric, and combined the strongest parts into a new direction. The synthesis scored 46 out of 50—higher than either original.

The useful move was not “run a design competition.” It was converting an opinion loop into an artifact loop:

1. Make the alternatives concrete.
2. Define the evaluation criteria before choosing.
3. Score what exists, not what each advocate imagines.
4. Allow synthesis instead of forcing a false binary.

Documents are excellent at preserving arguments. Prototypes are better at ending them.

## A prototype should also kill features

The highest-value outcome of a prototype is sometimes a smaller product.

We had started designing a flexible visual pipeline builder for data onboarding. It looked like the platform-grade answer: drag-and-drop nodes, open-ended composition, room for future transformations.

Then the workflow became real enough to interrogate.

The recurring problem was not authoring arbitrary pipelines. It was mapping messy customer headers into a known target schema, reviewing the proposed mapping, and activating it safely. The canvas solved a generality problem we did not actually have.

We killed it.

The replacement was a declarative mapping specification: an agent could propose it, a human could review the diff, and the system could enforce that the agent never activated it. The estimated build dropped from large to medium. The result was easier to audit and closer to the real job.

A prose spec often rewards completeness. Once a feature has a heading, requirements, and acceptance criteria, removing it feels like lost work. A prototype rewards usefulness. If nobody needs the flexibility when the workflow is in front of them, the abstraction has nowhere to hide.

## Where this model breaks

The demo is not the whole specification.

It is weak at things that do not become visible through interaction: scale limits, security boundaries, tenant isolation, recovery guarantees, data retention, observability, accessibility details, and unusual edge cases. A happy-path prototype can actively conceal these concerns.

I use a simple boundary:

> The demo owns experiential truth. Written contracts own invisible constraints.

The prototype should be authoritative for journeys, states, hierarchy, language, and cross-role coherence. Architecture decisions, API contracts, threat models, non-functional requirements, and failure semantics still belong in explicit written artifacts and tests.

There is another cost: keeping the prototype trustworthy. Once people use it as the spec, stale behavior becomes misinformation. Shared fixtures, automated journey checks, and clear “implemented versus simulated” labels are not polish. They are maintenance of the specification itself.

## What to change on Monday

Do not begin by replacing every PRD with code. Pick one workflow where the risk lives between screens or roles.

Build the thinnest version that can answer three questions:

1. Can the user complete the job from entry to outcome?
2. Does every state transition remain believable across pages?
3. Do different roles see the same underlying business truth at the right altitude?

Give the prototype deterministic data. Write the critical journey as a replayable checklist. Record unresolved non-functional constraints beside it rather than pretending the UI answers them.

Then review by using it.

Stop asking whether each screen matches its section of the document. Ask whether the product feels coherent when the user refuses to follow the document’s order.

That is the standard prose cannot meet.

Ship the demo, and let the thing that can feel wrong become the spec.
