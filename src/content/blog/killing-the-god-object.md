---
title: "Killing the God Object: A Strangler-Fig Plan for a Live Monolith"
date: 2026-07-02
description: "How we planned to turn a live monolith into a platform of engines without freezing customers: 28 capabilities sorted, six seams, six reversible releases."
tags: [architecture, migration, engineering-leadership, platform]
series: Building a Planning Platform in the Age of Agents
seriesOrder: 5
---

Designing a new platform on a whiteboard is the fun part. The hard part is that every paying customer is using the old one today, and it cannot stop. Our planning product runs on a single Java monolith that does everything: tenants, workspaces, projects, algorithm runs, uploads, dashboards, roles. On 2 July I spent a day finding out exactly how tangled it was, and then writing a plan to replace it piece by piece while it stays live. This is that plan, and the reasoning behind it.

## The problem: everything touches everything

I ran the audit with four AI agents in parallel, each taking one slice of the codebase (organisation concepts, task execution, data in and out, and cross-cutting concerns) and citing file and line for every claim. Five problems came back, and any migration has to beat all five.

1. **Two god objects sit under everything.** The workspace and project records mix business identity with cloud credentials, pipeline names, per-module wiring and runtime flags. About 30 classes read them directly. Touch the concept and you touch the whole system.
2. **One 961-line class is the real platform.** It fuses scheduling, dispatch, polling, file staging, cache invalidation and notifications, and pulls in 15 other services. There is no place where a new engine could plug in.
3. **Modules are hardcoded.** Every planning module exists as string constants and if/else branches. Adding or moving one means editing the core in four or more places.
4. **Our integration contracts are naming conventions.** File paths, database schema names and dashboard slugs are agreed by habit between the monolith and the algorithm workers. Change one side and the other breaks silently.
5. **We had done this badly once before.** An earlier move between cloud providers was done in place, with no abstraction layer. The dead dependency is still in the build.

That last one shaped the whole plan. We had a scar, and I wanted the plan to be built around not getting it again.

## Sorting what survives

The audit produced an inventory of 28 capabilities, each with a verdict.

<figure class="diagram">
<svg viewBox="0 0 480 190" role="img" aria-labelledby="t-killing-the-god-object-1">
<title id="t-killing-the-god-object-1">28 capabilities: 12 port, 11 rewrite, 3 keep as-is, 2 retire</title>
<rect class="dg-ok" x="20" y="40" width="188" height="56"/>
<rect class="dg-warn" x="208" y="40" width="173" height="56"/>
<rect class="dg-box" x="381" y="40" width="47" height="56"/>
<rect class="dg-line" x="428" y="40" width="32" height="56" stroke-dasharray="4 3"/>
<text class="dg-on-accent" x="114" y="74" font-size="18" text-anchor="middle">12 port</text>
<text class="dg-on-accent" x="294" y="74" font-size="18" text-anchor="middle">11 rewrite</text>
<text class="dg-text" x="404" y="75" font-size="16" text-anchor="middle">3</text>
<text class="dg-text" x="444" y="75" font-size="16" text-anchor="middle">2</text>
<text class="dg-muted" x="20" y="26" font-size="14">28 capabilities in the monolith</text>
<line class="dg-line" x1="404" y1="96" x2="404" y2="118"/>
<line class="dg-line" x1="444" y1="96" x2="444" y2="140"/>
<text class="dg-text" x="398" y="132" font-size="14" text-anchor="end">keep as-is</text>
<text class="dg-text" x="438" y="154" font-size="14" text-anchor="end">retire</text>
<text class="dg-muted" x="20" y="124" font-size="13">port: the idea carries over</text>
<text class="dg-muted" x="20" y="144" font-size="13">rewrite: needed, current form unusable</text>
<text class="dg-muted" x="20" y="178" font-size="13">Rewrites cluster where the concept itself changes.</text>
</svg>
<figcaption>Roughly half the system's ideas survive. What doesn't survive is how they are wired together.</figcaption>
</figure>

**Port** means the concept carries over and the code gets adapted: task tracking, schedules, the algorithms themselves, the module dependency graph, files, dashboards, audit. **Rewrite** means we need it but the current form cannot be saved: orchestration, tenancy, inputs, permissions. Two things retire outright, and three move across almost untouched.

The pattern in that split was the real finding. The ports sat where the old concepts already matched the new design. The rewrites sat exactly where the *concept* had to change.

## The concept nobody wanted to touch

The biggest concept change was the "project". Customers created a project whenever they needed the same algorithms with different settings or a different scope: one for the North region, one for a use case, three to try three parameter sets. A project was secretly doing three jobs at once: **picking a scope, holding a set of parameters for a what-if, and acting as a container for runs and data.** Customers cloned them constantly because we never gave them a better tool.

Every mature planning platform splits those jobs the same way, so we did too:

<figure class="diagram">
<svg viewBox="0 0 480 230" role="img" aria-labelledby="t-killing-the-god-object-2">
<title id="t-killing-the-god-object-2">The project concept splits into plan area, scenario and planning cycle</title>
<defs><marker id="arrow-killing-the-god-object" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<rect class="dg-warn" x="10" y="80" width="140" height="70" rx="10"/>
<text class="dg-on-accent" x="80" y="112" font-size="16" text-anchor="middle">Project</text>
<text class="dg-on-accent" x="80" y="134" font-size="13" text-anchor="middle">three jobs in one</text>
<line class="dg-line" x1="150" y1="100" x2="268" y2="44" marker-end="url(#arrow-killing-the-god-object)"/>
<line class="dg-line" x1="150" y1="115" x2="268" y2="115" marker-end="url(#arrow-killing-the-god-object)"/>
<line class="dg-line" x1="150" y1="130" x2="268" y2="186" marker-end="url(#arrow-killing-the-god-object)"/>
<text class="dg-muted" x="196" y="62" font-size="12" text-anchor="middle">scope</text>
<text class="dg-muted" x="210" y="108" font-size="12" text-anchor="middle">what-if</text>
<text class="dg-muted" x="196" y="174" font-size="12" text-anchor="middle">rhythm</text>
<rect class="dg-ok" x="270" y="16" width="200" height="56" rx="10"/>
<text class="dg-on-accent" x="370" y="40" font-size="15" text-anchor="middle">Plan area</text>
<text class="dg-on-accent" x="370" y="60" font-size="12" text-anchor="middle">a named slice of dimensions</text>
<rect class="dg-ok" x="270" y="87" width="200" height="56" rx="10"/>
<text class="dg-on-accent" x="370" y="111" font-size="15" text-anchor="middle">Scenario</text>
<text class="dg-on-accent" x="370" y="131" font-size="12" text-anchor="middle">a branch to compare, promote</text>
<rect class="dg-ok" x="270" y="158" width="200" height="56" rx="10"/>
<text class="dg-on-accent" x="370" y="182" font-size="15" text-anchor="middle">Planning cycle</text>
<text class="dg-on-accent" x="370" y="202" font-size="12" text-anchor="middle">pre-season, re-forecast</text>
</svg>
<figcaption>The project disappears as a platform concept. The workspace survives, reborn as the plan area.</figcaption>
</figure>

This has a cost that is easy to miss: **every existing project has to be classified by hand.** Is it a scope, an experiment, or both? That is joint engineering and services work, per customer. Map "one project to one scenario" blindly and you fossilise years of sprawl into the new system.

## What we considered

There were four realistic routes.

- **Big-bang rewrite.** Clean slate, but nothing ships until everything ships. You discover that the numbers don't match at the very end, when it is most expensive, and every customer sits on a frozen codebase for a year or two.
- **Parallel platform.** Clean architecture from day one, but two products to run, support and sell for years, and every migrated customer is still a big-bang for *that* customer.
- **Strangler fig.** Grow the new system inside the old one, route traffic capability by capability and customer by customer, and delete legacy as it drains. (The name comes from a vine that grows around a tree until it can stand on its own.)
- **Refactor only.** Cheapest now, but it never produces scenarios, plan areas or clean engine boundaries.

## The call (and why)

We chose the **strangler fig, hosted in a modular monolith.** New engines are built as cleanly separated modules inside the existing deployable, with boundaries the build enforces rather than a style guide.

The deciding reason was **numeric parity**. Customers' plans must not change because we migrated. Because old and new share the same data and infrastructure, we can run both paths on the same inputs and compare the outputs before any customer is switched. That makes shadow runs cheap and routine instead of a heroic project at the end.

> Microservices become an outcome, not a prerequisite. When an engine needs its own release cadence, extraction is a packaging change, because the boundary already exists.

The first step ships nothing visible on purpose. Before moving any engine, we carve six seams inside the monolith: a single place where tenants get resolved (already used by about 18 files), a dispatch switch in front of algorithm runs, the worker callback endpoints, the reporting surface, a typed run contract to replace a loose bag of properties, and one class that owns file paths. Each seam starts life as a no-op and soaks under production traffic.

<figure class="diagram">
<svg viewBox="0 0 480 380" role="img" aria-labelledby="t-killing-the-god-object-3">
<title id="t-killing-the-god-object-3">A dispatch seam routes each tenant to the legacy path or a new engine module, with shadow runs compared before the switch</title>
<defs><marker id="arrow-killing-the-god-object-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<rect class="dg-box" x="140" y="10" width="200" height="44" rx="10"/>
<text class="dg-text" x="240" y="38" font-size="15" text-anchor="middle">Run request</text>
<line class="dg-line" x1="240" y1="54" x2="240" y2="76" marker-end="url(#arrow-killing-the-god-object-b)"/>
<rect class="dg-accent" x="120" y="78" width="240" height="52" rx="10"/>
<text class="dg-on-accent" x="240" y="101" font-size="15" text-anchor="middle">Seam: dispatch switch</text>
<text class="dg-on-accent" x="240" y="120" font-size="12" text-anchor="middle">per tenant, per capability</text>
<line class="dg-line" x1="170" y1="130" x2="110" y2="170" marker-end="url(#arrow-killing-the-god-object-b)"/>
<line class="dg-line" x1="310" y1="130" x2="370" y2="170" marker-end="url(#arrow-killing-the-god-object-b)"/>
<rect class="dg-box" x="20" y="172" width="180" height="48" rx="10" stroke-dasharray="5 4"/>
<text class="dg-text" x="110" y="201" font-size="15" text-anchor="middle">Legacy path</text>
<rect class="dg-ok" x="280" y="172" width="180" height="48" rx="10"/>
<text class="dg-on-accent" x="370" y="201" font-size="15" text-anchor="middle">New engine module</text>
<line class="dg-line" x1="110" y1="220" x2="200" y2="258" marker-end="url(#arrow-killing-the-god-object-b)"/>
<line class="dg-line" x1="370" y1="220" x2="280" y2="258" marker-end="url(#arrow-killing-the-god-object-b)"/>
<rect class="dg-warn" x="140" y="260" width="200" height="48" rx="10"/>
<text class="dg-on-accent" x="240" y="289" font-size="15" text-anchor="middle">Diff the outputs</text>
<line class="dg-line" x1="240" y1="308" x2="240" y2="328" marker-end="url(#arrow-killing-the-god-object-b)"/>
<text class="dg-text" x="240" y="350" font-size="14" text-anchor="middle">clean cycles → flip cohort → widen</text>
<text class="dg-muted" x="240" y="372" font-size="13" text-anchor="middle">→ delete the legacy path</text>
</svg>
<figcaption>Every numeric cutover goes through the same loop. Nothing flips until old and new agree.</figcaption>
</figure>

After the seams come six customer-facing releases, each shippable and reversible on its own: a shared identity, audit and notification layer; a new run experience for a pilot group; algorithm modules ported in waves; new data ingestion with typed contracts; plan areas, scenarios and cycles; and a final sweep that deletes the old orchestrator. Every data change follows expand-then-contract: add the new beside the old, write to both, backfill, verify, then remove.

The ordering is deliberate. The concept change goes *late*, not because it matters least, but because it is riskiest: more than 23 tables carry project and workspace keys. It has to ride on seams with months of production soak. Inside that release the order is forced too: dimensions first, then classification, then scenarios.

## The tradeoffs we accepted

- **A slower start than greenfield.** The first release is invisible by design, which is a hard sell in a quarterly review.
- **Two paths for a while.** Old and new coexist, and someone has to own the switches and the diffs.
- **Discipline is a cost.** Enforced module boundaries slow down the quick hack, which is the point, and also the friction.
- **Services time per customer.** The project classification cannot be automated away.

## What I'd tell another team

- Audit before you plan, with evidence down to the file and line. Opinions about a codebase are cheap.
- Sort every capability into port, rewrite, keep or retire. The pattern tells you where the concept is wrong.
- Carve seams first and let them soak as no-ops before routing anything through them.
- Make shadow runs routine for anything numeric. Parity is the real risk, not code quality.
- Treat user workarounds (like cloned projects) as evidence of a missing concept, not as bad behaviour.

Later in the series: with the migration path drawn, the data layer still had one open question, and it was the one where I disagreed with my AI collaborator.
