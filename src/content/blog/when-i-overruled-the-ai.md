---
title: "When I Overruled the AI: One Data Service, Scenarios Included"
date: 2026-07-10
description: "My AI collaborator recommended keeping scenarios in their own service. I folded them into the data service instead. Here is the reasoning on both sides."
tags: [architecture, ai, data, decision-making]
series: Building a Planning Platform in the Age of Agents
seriesOrder: 7
---

Most of my design work this year happened in conversation with an AI agent. It reads the whole design repo, drafts the documents, and pushes back when my logic is weak. On 10 July it designed the single most important service in our planning platform, did it very well, and then flagged one decision it didn't want to make for me. It also told me which way it leaned. I went the other way. This post is about that call, why I think it was right, and what it taught me about working with an AI that has opinions.

## The problem: every engine was going to do its own maths

Our platform has fourteen engines: forecasting, algorithms, workbooks, KPIs, alerts, dashboards, the AI layer and more. Almost every one of them needs to read planning data, and almost every one needs to aggregate it.

If each engine walks the product and store hierarchies itself and applies its own rules for adding things up, they drift. The classic symptom is two screens showing two different totals for the same thing. The rules are subtle enough that drift is guaranteed. Stock on hand, for example, adds up across stores but must *not* add up across weeks; you take the last week's value instead. In our worked example, summing it across weeks by mistake made on-hand stock look seven times higher than it was.

That rule has to live in exactly one place. So the direction I gave was: one data service for the whole platform, covering hierarchies, dimension master data, the coordinate system and scenarios.

## What the AI designed

The agent turned that direction into a concrete design in a single session. We call it the Planning Data Service. It sits in front of the columnar database and hides the physical tables behind a small API shaped around coordinates (one member from each dimension, like "jeans, North, week 12"). No engine writes SQL, walks a hierarchy or hardcodes an aggregation rule. Instead every engine asks three kinds of question:

1. **What does the model look like?** Dimensions, levels, members, measures, and the rules attached to each measure.
2. **What is the number here?** A measure at a coordinate, rolled up or fanned down as needed, with a note on whether each cell was typed by a person or derived.
3. **What did a human decide?** Write a typed value, choose the recipe for splitting it, and work out effective values across scenarios.

The most useful part was the consumer map: engine by engine, which parts of the service it calls and why.

<figure class="diagram">
<svg viewBox="0 0 480 380" role="img" aria-labelledby="t-when-i-overruled-the-ai-1">
<title id="t-when-i-overruled-the-ai-1">Consumer map: four heavy readers, four medium readers and two producers around one data service</title>
<defs><marker id="arrow-when-i-overruled-the-ai" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<text class="dg-muted" x="240" y="18" font-size="13" text-anchor="middle">heavy: their core loop depends on it</text>
<rect class="dg-ok" x="15" y="28" width="105" height="40" rx="8"/><text class="dg-on-accent" x="67" y="53" font-size="14" text-anchor="middle">Demand</text>
<rect class="dg-ok" x="130" y="28" width="105" height="40" rx="8"/><text class="dg-on-accent" x="182" y="53" font-size="14" text-anchor="middle">Algorithms</text>
<rect class="dg-ok" x="245" y="28" width="105" height="40" rx="8"/><text class="dg-on-accent" x="297" y="53" font-size="14" text-anchor="middle">Workbook</text>
<rect class="dg-ok" x="360" y="28" width="105" height="40" rx="8"/><text class="dg-on-accent" x="412" y="53" font-size="14" text-anchor="middle">KPIs</text>
<line class="dg-line" x1="67" y1="68" x2="170" y2="150" marker-end="url(#arrow-when-i-overruled-the-ai)"/>
<line class="dg-line" x1="182" y1="68" x2="215" y2="150" marker-end="url(#arrow-when-i-overruled-the-ai)"/>
<line class="dg-line" x1="297" y1="68" x2="265" y2="150" marker-end="url(#arrow-when-i-overruled-the-ai)"/>
<line class="dg-line" x1="412" y1="68" x2="310" y2="150" marker-end="url(#arrow-when-i-overruled-the-ai)"/>
<rect class="dg-accent" x="120" y="152" width="240" height="64" rx="12"/>
<text class="dg-on-accent" x="240" y="180" font-size="16" text-anchor="middle">Planning Data Service</text>
<text class="dg-on-accent" x="240" y="202" font-size="13" text-anchor="middle">scenarios included</text>
<rect class="dg-box" x="10" y="160" width="90" height="48" rx="8" stroke-dasharray="5 4"/><text class="dg-text" x="55" y="181" font-size="13" text-anchor="middle">Ingestion</text><text class="dg-muted" x="55" y="198" font-size="12" text-anchor="middle">writes</text>
<rect class="dg-box" x="380" y="160" width="90" height="48" rx="8" stroke-dasharray="5 4"/><text class="dg-text" x="425" y="181" font-size="13" text-anchor="middle">Connectors</text><text class="dg-muted" x="425" y="198" font-size="12" text-anchor="middle">writes</text>
<line class="dg-line" x1="100" y1="184" x2="118" y2="184" marker-end="url(#arrow-when-i-overruled-the-ai)"/>
<line class="dg-line" x1="380" y1="184" x2="362" y2="184" marker-end="url(#arrow-when-i-overruled-the-ai)"/>
<line class="dg-line" x1="67" y1="292" x2="170" y2="218" marker-end="url(#arrow-when-i-overruled-the-ai)"/>
<line class="dg-line" x1="182" y1="292" x2="215" y2="218" marker-end="url(#arrow-when-i-overruled-the-ai)"/>
<line class="dg-line" x1="297" y1="292" x2="265" y2="218" marker-end="url(#arrow-when-i-overruled-the-ai)"/>
<line class="dg-line" x1="412" y1="292" x2="310" y2="218" marker-end="url(#arrow-when-i-overruled-the-ai)"/>
<rect class="dg-box" x="15" y="292" width="105" height="40" rx="8"/><text class="dg-text" x="67" y="317" font-size="14" text-anchor="middle">Alerts</text>
<rect class="dg-box" x="130" y="292" width="105" height="40" rx="8"/><text class="dg-text" x="182" y="317" font-size="14" text-anchor="middle">AI</text>
<rect class="dg-box" x="245" y="292" width="105" height="40" rx="8"/><text class="dg-text" x="297" y="317" font-size="14" text-anchor="middle">Dashboards</text>
<rect class="dg-box" x="360" y="292" width="105" height="40" rx="8"/><text class="dg-text" x="412" y="317" font-size="14" text-anchor="middle">Workflow</text>
<text class="dg-muted" x="240" y="356" font-size="13" text-anchor="middle">medium: regular reads, not the core loop</text>
<text class="dg-muted" x="240" y="374" font-size="12" text-anchor="middle">(approval and audit are light; three engines need nothing)</text>
</svg>
<figcaption>The map doubled as the interface backlog: every heavy or medium arrow is a contract to write before that engine can be built.</figcaption>
</figure>

## The fork it flagged

Here is where it got interesting. An earlier design, written before this data service existed, had a separate scenario engine. Scenarios work like git branches for a plan: you branch from a baseline, change a few inputs, compare, and promote the winner. The open question was whether scenarios stay in their own engine, which asks the data service for numbers, or move into the data service itself.

The agent did not bake an answer in. It wrote the fork up as a decision for me, which is exactly what our working norms ask for on hard-to-reverse choices. But it also gave its lean: **keep the split.** Its reasoning was good. The scenario tree, promotion and approval are *planning logic*, not a database gateway, and a clean data layer should not own planning logic. Keep the layers pure, and present one logical surface to callers.

I sat with that for a while, because layer purity is usually the argument I make.

## The call (and why)

I decided to fold scenarios into the data service. **Scenario and the coordinate system are too tightly coupled to split.**

<figure class="diagram">
<svg viewBox="0 0 480 300" role="img" aria-labelledby="t-when-i-overruled-the-ai-2">
<title id="t-when-i-overruled-the-ai-2">Split design needs two hops and two caches per question; folded design answers in one hop</title>
<defs><marker id="arrow-when-i-overruled-the-ai-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<text class="dg-text" x="115" y="22" font-size="15" text-anchor="middle" font-weight="600">Split (the AI's lean)</text>
<text class="dg-text" x="365" y="22" font-size="15" text-anchor="middle" font-weight="600">Folded (my call)</text>
<line class="dg-line" x1="240" y1="10" x2="240" y2="290" stroke-dasharray="3 5"/>
<rect class="dg-box" x="30" y="40" width="170" height="40" rx="8"/><text class="dg-text" x="115" y="65" font-size="14" text-anchor="middle">Any engine</text>
<line class="dg-line" x1="115" y1="80" x2="115" y2="104" marker-end="url(#arrow-when-i-overruled-the-ai-b)"/>
<rect class="dg-warn" x="30" y="106" width="170" height="48" rx="8"/><text class="dg-on-accent" x="115" y="127" font-size="14" text-anchor="middle">Scenario engine</text><text class="dg-on-accent" x="115" y="145" font-size="12" text-anchor="middle">cache #1</text>
<line class="dg-line" x1="115" y1="154" x2="115" y2="178" marker-end="url(#arrow-when-i-overruled-the-ai-b)"/>
<rect class="dg-warn" x="30" y="180" width="170" height="48" rx="8"/><text class="dg-on-accent" x="115" y="201" font-size="14" text-anchor="middle">Data service</text><text class="dg-on-accent" x="115" y="219" font-size="12" text-anchor="middle">cache #2</text>
<line class="dg-line" x1="115" y1="228" x2="115" y2="252" marker-end="url(#arrow-when-i-overruled-the-ai-b)"/>
<rect class="dg-box" x="30" y="254" width="170" height="36" rx="8"/><text class="dg-text" x="115" y="277" font-size="14" text-anchor="middle">Database</text>
<rect class="dg-box" x="280" y="40" width="170" height="40" rx="8"/><text class="dg-text" x="365" y="65" font-size="14" text-anchor="middle">Any engine</text>
<line class="dg-line" x1="365" y1="80" x2="365" y2="126" marker-end="url(#arrow-when-i-overruled-the-ai-b)"/>
<text class="dg-muted" x="373" y="108" font-size="12">one hop</text>
<rect class="dg-ok" x="280" y="128" width="170" height="74" rx="8"/><text class="dg-on-accent" x="365" y="152" font-size="14" text-anchor="middle">Data service</text><text class="dg-on-accent" x="365" y="172" font-size="12" text-anchor="middle">chain walk + roll-up</text><text class="dg-on-accent" x="365" y="190" font-size="12" text-anchor="middle">one cache</text>
<line class="dg-line" x1="365" y1="202" x2="365" y2="252" marker-end="url(#arrow-when-i-overruled-the-ai-b)"/>
<rect class="dg-box" x="280" y="254" width="170" height="36" rx="8"/><text class="dg-text" x="365" y="277" font-size="14" text-anchor="middle">Database</text>
</svg>
<figcaption>"Value of this measure, at this coordinate, in this scenario" is one logical question. The split design answers it with two services that must agree.</figcaption>
</figure>

Three things decided it for me:

- **Every read is scenario-scoped.** A scenario id is a parameter on nearly every query. There is no such thing as "just the data" in a planning tool; there is always "the data, in which version".
- **Resolving a scenario *is* a coordinate read.** To find the effective value, you walk up the branch chain (this scenario's change, else its parent's, else the baseline) and then roll up or fan out. That is the data service's core job with one extra loop.
- **Splitting doubles the moving parts.** Two hops for every question, two caches to keep in step, and an artificial seam between the data and which version of the data. We were writing the API anyway, so adding create, branch, promote and compare was incremental.

> One question, one hop. If every caller has to make the same two calls in the same order, the seam is in the wrong place.

The mechanics didn't change, only where they live. Branches still store only their changes, promotion is still a pointer move rather than a bulk merge, and siblings of a promoted scenario still get flagged as stale for the planner to rebase or discard. Edits typed into the grid stay owned by the workbook. And the data service exposes `promote()`, but the workflow and approval engines still decide *whether* it may run.

Folding also closed a question that had been open for weeks: where does fan-out actually compute? Answer: in the data service, at read time, as a join of the typed value and its split recipe. The algorithm engine stays completely scenario-unaware; it receives inputs that are already resolved.

## The tradeoffs we accepted

- **The data layer is no longer pure.** The service now owns some planning logic. Our layer diagram has to admit it spans the boundary between data and engines, which is honest but less tidy.
- **A bigger, more central service.** More of the platform depends on one component, so its reliability and ownership matter more.
- **The AI's concern doesn't disappear.** If promotion rules grow complicated, the pressure to split will come back. We'll know because the service's scenario code will start to look like its own product.

## What I'd tell another team

- Ask your AI collaborator to flag hard-to-reverse decisions rather than make them, and to say which way it leans.
- Notice what each side is optimising. The agent optimised for layering principles; I optimised for the call pattern every consumer actually makes.
- Watch for stale defaults. The "separate engine" verdict was made before the data service existed, and the AI gave it extra weight because it was already written down.
- Overruling is cheap when the reasoning is written. The agent's argument now sits in the decision record as the case we rejected, ready if we need to revisit.
- Count hops. If every caller makes the same two calls, merge the services.

The decision record was written and closed in the same session. Next in the series: the operating system behind all of this, a second brain that keeps an AI-heavy product org coherent.
