---
title: "Breadth Before Depth: A Finite-State Grid for Designing 18 Systems at Once"
date: TODO
description: "The biggest risk in AI-accelerated design isn't the AI getting things wrong — it's depth-seduction. A filesystem-audited maturity grid is the antidote to designing one system beautifully while seventeen rot."
tags: [ai, methodology, engineering-leadership, product]
draft: true
---

<!--
DRAFT / OUTLINE — not published. Structure in your own voice, set a date, remove `draft:`, move up one folder to publish.
Source: pm-brain ms-planning-brain extraction, Part 3 (4-pass sweep), Part 2.7 (problem-first roadmap), Part 4 moment #10.
Score against The Bar before publishing: pm-brain/meta/writing-rubric.md
-->

## The one-line thesis

When you design with an AI, the failure mode isn't hallucination — it's seduction. You and the model fall in love with the most interesting subsystem and go infinitely deep while the other seventeen sit at zero, and you lose the whole-system view. The fix is boring on purpose: a finite grid of components × maturity passes, and a rule to sweep breadth-first before deepening anything.

## Who this is for

Anyone doing large greenfield design with AI as a co-designer — solo or small team — who's noticed that "productive" AI sessions somehow leave most of the surface untouched.

## The hook (open here)

Ask an AI to help you design a platform and it will happily spend three days making one engine perfect. That feels like progress. It isn't — it's seventeen unstarted engines wearing the disguise of one finished one. I needed a way to make "how done are we, really?" a fact instead of a feeling.

## The argument (section beats)

1. **Name the failure: depth-seduction.** Depth-first feels like momentum because each step is high-quality. But quality-per-component is the wrong metric when coverage is the risk. The interesting subsystem is a gravity well.
2. **Turn an ambiguous problem into a checkable grid.** "Design a planning platform" is intractable. "18 engines × 4 passes (marker → data model → UI → interfaces) = 72 cells, each ✅/◐/⬜" is a finite state machine you can actually reason about. Ambiguity becomes arithmetic.
3. **Audit the grid from the filesystem, not the AI's self-report.** This is the load-bearing detail. If the tracker reflects what the model *says* it did, it's a wish list. If cell status is verified against what artifacts actually exist on disk, it's a claim. Never let the thing being measured also be the thing reporting the measurement.
4. **Sweep breadth-first: every component to pass-1 before any goes to pass-2.** A walking skeleton across the whole system beats a perfect limb. Breadth-first surfaces cross-cutting problems (a shared boundary, a missing seam) while they're still cheap to fix.
5. **Pair it with problem-first milestones.** The grid tracks *coverage*; problem-first roadmap items keep the *coverage honest*. If a cell can't be justified by the user pain it removes, it doesn't earn depth yet. (Diagnose the real bottleneck first — a boring, debuggable choice beat a flashier one precisely because we asked what the actual constraint was.)
6. **The dual-hat turn.** The grid is an engineering artifact (maturity passes, filesystem audit) enforcing a product discipline (breadth of user-facing coverage, problem-first justification). It's how one person holds both the system view and the roadmap view at once.

## The takeaway line to land

Depth is seductive; coverage is the risk. Build the grid, audit it from disk, and refuse to go deep on your favorite problem until everything else has a floor.

## Bar check

- **Non-obvious thesis:** with AI, the danger is depth (seduction), not errors — and the antidote is a grid audited from the filesystem, not from the model's own report.
- **Weakest dimension to defend: #6 Intellectual honesty.** Name the limit: breadth-first is wrong when one component carries existential risk and must be proven deep before anything else is worth building. The grid is a default, not a law.

## What's left to do

- Show the actual tracker grid (even a small mock) — the visual sells it.
- The "don't let the measured thing self-report" point generalizes beyond AI; consider making it the headline insight.
- Keep it from reading as process-for-process's-sake — anchor every rule to a concrete miss it prevents (dimension #8).
