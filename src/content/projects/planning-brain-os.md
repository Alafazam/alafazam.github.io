---
name: Planning Brain OS
tagline: An AI-first operating system for platform design
category: Frameworks & Processes
status: Active
impact: Team-scale architecture output from a practice of one
icon: brain
order: 6
tags: [AI-first workflows, ADRs, Knowledge management, Claude Code]
---

A git-repo operating system for AI-assisted platform design — the coherence-maintenance function that normally requires a team (architects, PM, tech writer) compiled into governance artifacts that AI tools execute faithfully.

## Problem

One person + AI can generate a team's worth of architecture output — but not a team's worth of coherence. Docs drift, decisions get re-litigated, the AI tunnels deep on one interesting component while seventeen others rot, and every "please remember to…" instruction decays under context pressure or a tool switch.

## Approach

Discipline becomes infrastructure, not willpower. **Hooks over hopes:** a pre-commit hook blocks any `git commit` until the day's decision log exists. **ADR-at-log-time:** decisions are captured the moment they're spoken, with rejected options named so they stay rejected. **Breadth before depth:** 18 engines tracked through a 4-pass maturity grid audited from the filesystem, not self-reported. **One source of truth per fact:** routing, boundaries, and decision status each live in exactly one file, enforced by a self-auditing sweep. **Fat root, thin adapters:** Claude Code, Cursor, and Codex all run against one canonical memory, so knowledge outlives any single tool.

## Outcome

~10 weeks of part-time work produced 93k lines of cross-referenced architecture documentation, 17 closed ADRs, a 40+ page working prototype, and an auto-generated product trailer driven by the same JSON as the QA checklist — all kept mutually consistent by the operating system, not by memory.
