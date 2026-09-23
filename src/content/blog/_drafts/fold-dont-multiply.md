---
title: "Fold, Don't Multiply"
date: TODO
description: "An abstraction with one consumer is a liability, not an asset. The engineering-leadership skill nobody trains for: deleting the component you already put on the diagram."
tags: [architecture, engineering-leadership, abstraction, ai]
draft: true
---

<!--
DRAFT / OUTLINE — not published. Structure in your own voice, set a date, remove `draft:`, move up one folder to publish.
Source: pm-brain ms-planning-brain extraction, Part 1.6 (ADR-010), Part 4 moments #1 #4 #5, Part 5 rule #6.
Score against The Bar before publishing: pm-brain/meta/writing-rubric.md
-->

## The one-line thesis

Adding an abstraction is easy and feels productive. Deleting one you already designed feels like admitting a mistake — so nobody does it, and systems bloat. But a shared engine with one consumer pays the full abstraction tax and earns zero reuse dividend. The health signal isn't components added; it's components *folded* while depth goes up.

## Who this is for

Engineers and architects who reflexively "build it properly" — a service, an engine, a generic layer — the moment a concept appears. And the leaders who have to approve, or kill, those abstractions.

## The hook (open here)

The most productive thing I did on the architecture wasn't designing an engine. It was deleting one — before a line of it was written — on the strength of a five-minute question. By the end, the engine *count had gone down* while the design depth had gone up. That inversion is the whole point.

## The argument (section beats)

1. **Why we over-abstract.** Naming a component on a diagram creates a phantom obligation to build it. Future-proofing feels responsible. Deleting your own box feels like failure. All three push one direction: multiply.
2. **The one-consumer test.** Before promoting anything to a shared engine/service/library, name its *second* consumer. If there isn't one, you're not building an abstraction — you're building indirection with a tax and no dividend. (Worked example: the Calculation Engine had exactly one consumer and no user-authored formulas — folded into a plain library inside that consumer. Engine count 15 → 14.)
3. **De-abstraction is the harder, rarer skill.** Anyone can add. Reversing an over-investment already drawn on the diagram takes more judgment and more spine. A second example: solver work reclassified from a standalone Optimization Engine into a single leaf block — an entire engine retired the moment a cleaner substitution existed.
4. **The buy-vs-build heuristic hiding inside.** "It's open source" is not diligence. The only viable third-party engine here was AGPL — paid-equivalent for a SaaS product — so it was out on a license screen, not a feature comparison. A crisp, reusable filter most teams get wrong.
5. **Fold without losing the option.** Folding isn't burning the bridge. Each kill documented its *re-promotion path*: extract to a shared package when a second consumer appears; add a DSL when users actually author formulas. Reversible by design.
6. **The dual-hat turn.** This isn't only tidiness — it's prioritization. Every phantom engine is opportunity cost: weeks spent on indirection nobody needed instead of the module that wins deals. Deleting the abstraction *is* a product decision.

## The takeaway line to land

Track your abstraction count going *down* while your depth goes up. If it only ever goes up, you're not designing — you're accumulating.

## Bar check

- **Non-obvious thesis:** the health metric is components *removed*, and de-abstraction is a harder skill than abstraction.
- **Weakest dimension to defend: #3 Mechanism depth.** Don't let it become "delete stuff, it's good." Explain *when* folding is right (one consumer, no divergence, cheap re-promotion) vs when a real shared abstraction earns its keep (genuine second consumer, cross-cutting invariant) — so the reader can tell the difference.

## What's left to do

- Show the actual before/after (one engine → a library inside its consumer) as a small diagram.
- Sharpen the AGPL heuristic into a one-liner readers will remember.
- Optional: connect to "future-proofing" as the default engineer error — the inverse instinct.
