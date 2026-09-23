---
title: "Store the Decision, Derive the Rest"
date: TODO
description: "Most planning systems try to materialize an N-dimensional cube. Store only the authored decisions and the named shapes that fan them out — and the storage problem becomes a transparency feature."
tags: [architecture, data-modeling, engineering, product]
draft: true
---

<!--
DRAFT / OUTLINE — not published. Structure in your own voice, set a date, remove `draft:`, move up one folder to publish.
Source: pm-brain ms-planning-brain extraction, Part 1.4 (anchors + bases), Part 1.5 (ADR-003), ADR-004, Part 5 rule #2.
Score against The Bar before publishing: pm-brain/meta/writing-rubric.md
-->

## The one-line thesis

The instinct in any multi-dimensional planning system is to materialize the cube — every product × time × location × channel cell. It's astronomically large and almost entirely derivable. Store only two things: the **anchors** (values someone deliberately authored) and the **bases** (named, versioned shapes for splitting a number down). Everything else is computed on read. The storage problem turns into an auditability feature.

## Who this is for

Engineers modeling anything hierarchical and multi-level — forecasts, budgets, org rollups, capacity plans — who feel the pull to precompute the whole grid "for performance," and the product folks who'll later ask "wait, where did this number come from?"

## The hook (open here)

The naive planning data model stores every cell. Ours stores almost none of them — and that's not a compromise for scale, it's what makes every number in the system explainable. The trick is an asymmetry hiding in plain sight.

## The argument (section beats)

1. **The asymmetry.** Rolling *up* (children → parent) is mechanical and lossless — pure summation, no information added, so there's nothing worth storing. Rolling *down* (parent → children) is underdetermined — one number splits many ways. The "how it splits" is real information, and it has to come from somewhere.
2. **Name the split, don't bury it.** In most systems the disaggregation logic is an implicit default smeared across code — inconsistent per module, invisible to the user. Make it a first-class, named, versioned input instead: historical-ratio, even-split, seasonality-curve, manual. That's the **basis**. Now "how did this number get here" has an auditable answer.
3. **Anchors: store only what was authored.** A cell is worth persisting only when a human deliberately set it. Everything else derives from anchors + bases on read. The cube stays sparse because reality is sparse — planners author a few decisions, not a Cartesian product.
4. **Why this cascades.** Sparse anchors make append-only, denormalized columnar storage viable. Copy-on-write scenarios become nearly free — a scenario stores only its *overrides*, because "the rest is derived" is the default. The data model choice quietly unlocks the versioning and cost model. (Link the deterministic-spine / platform pieces.)
5. **The discipline that generalizes: where is the decision hiding?** The reusable move isn't "anchors and bases" — it's asking, of any schema, *which cells encode a real decision and which are derivable?* Store the former, derive the latter, and name the derivation. Applies far beyond planning.
6. **The dual-hat turn.** This looks like pure engineering, but the payoff is a product one: explainability. "Why is this forecast 4,200?" resolves to "anchored at the region level, split by last year's ratio" — a sentence a merchandiser trusts. The data model *is* the trust surface.

## The takeaway line to land

Don't store the answer to every question. Store the decisions and the rules that generate the rest — and make the rules things people can name.

## Bar check

- **Non-obvious thesis:** aggregation is free (don't store it), disaggregation is information (name and version it) — and that reframing turns a scaling problem into a transparency feature.
- **Weakest dimension to defend: #7 Practitioner utility.** Keep it from staying abstract. Give the reader the concrete test to run on their own schema ("which columns are authored vs derived?") and the failure mode of getting it wrong (derived values stored as if authored, then silently stale).

## What's left to do

- A tiny worked example (one anchored number fanning out via two different bases) makes this land.
- Decide how much to lean on the merchandising specifics vs a neutral example (budgets/org trees).
- Watch the jargon — "anchors/bases" needs a one-line plain-English gloss up front (dimension #10).
