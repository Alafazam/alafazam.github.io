---
name: Merchandising Planning Platform
tagline: Product-to-platform re-architecture of retail planning
category: Builds
status: Active
impact: 18 engines · 22 modules · 17 ADRs · deterministic spine
icon: boxes
order: 0
tags: [Platform architecture, AI agents, Retail planning, ADRs]
---

An end-to-end merchandising planning platform — demand forecasting, MFP, assortment, allocation, markdown — re-architected from a fashion-vertical point product into a configurable 4-layer platform (Infra → Data → Engines → Business Solutions), designed AI-first in ~10 weeks.

## Problem

The existing merchandising product was fashion-shaped and rigid: one root cause capping both win-rate (deals lost on scenarios and hierarchies) and TAM (non-fashion verticals out of reach). Meanwhile AI was compressing feature-parity time toward zero — meaning feature moats were becoming unsustainable, and the defensibility bar was moving to platform depth.

## Approach

Designed the platform as 18 reusable engines and 22 business modules, with every consequential decision closed as an ADR — named rejected options, explicit revisit conditions. The defining call: a **deterministic, event-sourced workflow spine with AI confined to bounded nodes** — chosen over an agent-orchestrated backbone for auditability ("run #12847 published after VP approved" survives an audit; "the agent decided" does not), demo predictability, and 10–100x better token economics. AI governance reduced to an auditable tool registry: agents propose diffs, never write plan data directly.

The legacy multi-client monolith migrates via strangler fig: seams carved before extraction, shadow-run parity before every cutover, the riskiest decomposition deliberately sequenced last.

## Outcome

A coherent platform architecture — 17 closed ADRs, a 40+ page multi-persona working prototype with a live simulation engine as the spec, Gartner-validated positioning with per-competitor battle-cards — produced by one leader running an AI-first design practice, at output that normally takes a platform team a quarter or two.
