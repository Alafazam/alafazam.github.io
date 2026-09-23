---
title: "Deterministic Spine, Agentic Interior"
date: TODO
description: "Why 'AI-first' is a promise about the product, not a mandate about the architecture — and how conflating the two produces enterprise software that can't be audited, demoed, or sold."
tags: [ai, architecture, enterprise, product]
draft: true
---

<!--
DRAFT / OUTLINE — not published. Structure in your own voice, set a date, remove `draft:`, move up one folder to publish.
Source: pm-brain ms-planning-brain extraction, Part 1.1 + Part 4 (ADR-006).
-->

## The one-line thesis

"AI-first" is a claim about the user's experience. "Agent-orchestrated" is a claim about the runtime. Most teams in 2026 conflate them — and the conflation is how you end up with an enterprise product that demos differently every time, burns 100x the tokens, and dies in a procurement review.

## Who this is for

Founders and eng leaders building AI-native B2B products who feel pressure to make "the agent" the backbone. The people about to make the most expensive architecture mistake of the cycle.

## The hook (open here)

Two ways to sit an AI planning product on its foundation:
- **Agent backbone** — the agent decides what happens next; deterministic operations are its tools.
- **Deterministic backbone** — a workflow/state-machine engine is the spine; the AI is one node type inside it.

Both are coherent. Only one survives an enterprise audit. Open with the audit line:

> "The agent decided to publish the plan" does not survive an audit. "Run #12847 of workflow `mfp-main@v1.2` published the plan after the Finance VP approved on step a3" does.

## The argument (section beats)

1. **The seduction.** In 2026 the exciting architecture is the agentic one. Name why it's tempting, honestly — it feels more "AI-native," it demos like magic once.
2. **Stress-test against two real scenarios.** A CFO-audited seasonal MFP cycle *and* a mostly-idle "morning sales-dip" monitor agent. The same engine has to express both. Walk the reader through why the audited cycle breaks the agent backbone.
3. **The five constraints that decide it** (this is the spine of the piece):
   - **Audit / procurement** — deterministic run IDs vs "the agent decided."
   - **Demo predictability** — agentic loops vary run-to-run; sales engineering needs the same demo twice.
   - **Unit economics** — 10–100x token burn (agent loops vs targeted AI nodes) at 50 workflows × 1,000 clients/day.
   - **Debuggability** — a bounded step failure vs a multi-day forensic replay of a 47-step agent trace.
   - **Blast radius** — containment when something goes wrong.
4. **The reframe.** You can deliver the *AI-first UX promise* (chat as the primary surface, AI as the dominant compute inside steps) on a boring, auditable backbone. The two are orthogonal. This is the paragraph the whole piece exists to deliver.
5. **The reference class.** Every successful AI-first B2B company in 2026 — Sierra, Decagon, Harvey, Hebbia, Glean, Cresta — has a deterministic process spine with agent execution inside. Pattern-match, don't reason from scratch.
6. **The evolvability kicker.** Today's workflow can be 30% AI nodes; v3 can be 80% — same runtime, no rewrite. You are not trading away the agentic future; you're sequencing it.

## The takeaway line to land

Put AI inside the nodes of a deterministic workflow. Never let it decide "what happens next" at the process level. "AI-first" is a UX claim; the ratio of AI nodes is a dial you turn over time, not a foundation you pour once.

## What's left to do

- Decide how much of the specific merchandising context to reveal vs abstract to "an enterprise planning product."
- Optional: a small diagram — workflow DAG with one node shaded as the `ai` node.
- Sharpen the Sierra/Harvey/Glean reference so it reads as observation, not name-drop.
