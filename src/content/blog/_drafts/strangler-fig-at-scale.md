---
title: "The Strangler Fig at Scale"
date: TODO
description: "How to migrate a live, multi-client monolith onto a new architecture without a rewrite, a parallel platform, or a terrifying cutover — by carving seams first and sequencing the riskiest change last."
tags: [architecture, migration, engineering-leadership]
draft: true
---

<!--
DRAFT / OUTLINE — not published. Structure in your own voice, set a date, remove `draft:`, move up one folder to publish.
Source: pm-brain ms-planning-brain extraction, Part 1.3 (ms-master migration), Part 4 moment #12, Part 5 rules #9 #10.
Score against The Bar before publishing: pm-brain/meta/writing-rubric.md
-->

## The one-line thesis

The scary part of migrating a live monolith isn't the code volume — it's the numeric-parity risk at cutover. So don't sequence the migration by what's easy to build. Sequence it by risk: carve the seams first, run old and new side by side on the same data, and schedule the single riskiest change *last*, on seams that have had months of production soak.

## Who this is for

Engineering leaders sitting on a monolith with paying customers on it, being pitched a big-bang rewrite or a shiny parallel platform — and anyone who's watched an "in-place, no seams" migration leave dead code behind for a decade.

## The hook (open here)

Four ways to move thirty-plus paying clients off a monolith. Three of them ask you to hold your breath. The fourth makes the terrifying step — "do the new numbers match the old ones?" — a routine, cheap check you run before every cutover instead of once, at the end, in the dark.

## The argument (section beats)

1. **Score the options honestly.** Big-bang rewrite: nothing ships until everything ships, parity discovered too late, clients frozen for a year+. Parallel platform: doubles carrying cost, and every migrated client is still a big-bang for *that* client. Refactor-only: never produces the platform. Strangler fig: chosen — but only if you pay for seams up front.
2. **The deciding argument is parity risk.** Running old and new against the same data makes shadow-comparison a step, not an event. That single property is why strangler fig wins — not elegance, risk economics.
3. **Phase 0 is seam-carving, and you don't skip it.** Before extracting anything, carve the boundaries: the god-objects, the shared-DB coupling invisible from either repo, the saga with no boundary. Extraction becomes a *packaging* change once boundaries are enforced — which decouples "modular" from "distributed," a distinction most teams conflate.
4. **Sequence the hardest change last, deliberately.** The deepest conceptual decomposition rides *on top of* seams that have already soaked in production for months — not because it matters least, but because unreliability compounds if you attempt it on fresh boundaries. Counterintuitive: the riskiest work is safest when it goes last.
5. **The safety playbook, stated not vibed.** Shadow-run before every cutover. Expand-contract for every data change. Move, don't copy. Per-client, per-capability traffic switches. These are guardrails you write down, not instincts you hope for.
6. **Operationalize your own scar tissue.** The forcing function here was a *named past failure*: a prior cloud migration done in place, without seams, that left dead code and duplicated conventions a migration later. Citing your organization's own documented mistake as the reason to pay the seam tax is a distinctly senior move — juniors bury failures; leaders turn them into guardrails.
7. **The dual-hat turn.** The same plan exists in two registers: a file:line coupling analysis for engineers, and a leadership edition with industry analogies for the CTO/CPO/board. Same conclusions, different audience — the translation is part of the engineering leadership, not a separate comms task.

## The takeaway line to land

Migrate for reversibility, not for velocity. Carve the seams, shadow-run the parity, and put the scariest change last — after its foundations have earned your trust in production.

## Bar check

- **Non-obvious thesis:** the riskiest change should go *last* on production-soaked seams, and the real migration risk is parity, not code volume.
- **Weakest dimension to defend: #7 Practitioner utility + #2 specificity.** This can drift into strategy-deck abstraction. Keep at least two concrete, checkable specifics (the god-object example, the shadow-run mechanic) and give the reader the Phase-0 seam checklist they can actually apply.

## What's left to do

- Decide how much of the legacy system to describe concretely vs anonymize.
- The four-options scoring table would work well rendered inline.
- Land the "packaging change, not a prerequisite" point on modular-vs-distributed — it's the sharpest technical insight.
