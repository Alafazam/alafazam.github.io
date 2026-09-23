---
title: "One Brain, Three AIs: Fat Root, Thin Adapters"
date: TODO
description: "Every AI coding tool wants its own memory format — and they silently drift until each 'knows' something different about your project. Keep the brain in files, and give each tool a shim."
tags: [ai, workflows, tooling, engineering-leadership]
draft: true
---

<!--
DRAFT / OUTLINE — not published. Structure in your own voice, set a date, remove `draft:`, move up one folder to publish.
Source: pm-brain ms-planning-brain extraction, Part 3 (fat root/thin adapters, wake-on-trigger memory), Part 5 rules.
Score against The Bar before publishing: pm-brain/meta/writing-rubric.md
-->

## The one-line thesis

Adopt Claude Code, Cursor, and Codex and you'll soon have three memories that quietly disagree — each tool "knows" a different version of your project. The fix is an old software pattern applied to prompt engineering: put all the substance in one canonical root, and give each tool a thin adapter that points back. The brain lives in files, not in any vendor's memory feature.

## Who this is for

Anyone running more than one AI coding tool, or who will be — and anyone who's felt the low-grade dread that their `.cursorrules` and their `CLAUDE.md` have drifted apart and they can't tell which one is right.

## The hook (open here)

I use three different AI tools on the same repo. They do not each get their own memory. They get one memory, in plain markdown, and a five-line shim each. The day I stopped letting each tool remember things its own way was the day the project stopped contradicting itself.

## The argument (section beats)

1. **The drift problem.** Per-tool memory is a trap in a multi-tool world. Each vendor's mechanism is a silo; anything you save in one is invisible to the others and gone when you switch. Three silos → three subtly different truths → coherence rot.
2. **Fat root, thin adapters.** All substance — identity, routing, decisions, memory, workflows — lives in canonical root files. Each tool gets an adapter that only *points back* (the Claude file adds Claude-specific bootstrap and nothing else). It's the adapter pattern from software design, aimed at context instead of code.
3. **The hard rule that makes it work.** "Any memory saved outside the canonical folder is invisible to other tools and lost on a switch." Stated as an invariant, not a preference — because the moment one tool writes to its own memory, drift restarts.
4. **Memory as a routing manifest, not a dump.** The canonical memory file isn't content — it's a keyword→file index ("wake this doc when the task mentions X"). A hand-built retrieval layer in markdown: don't load the whole brain, load the relevant branch. Cheaper context, and it survives any tool.
5. **Why this is DRY for knowledge work.** The same instinct that stops duplicated business logic — one authoritative home per fact — applied to a knowledge base an AI co-writes a hundred files a day into. Single-source-of-truth is the only thing that holds under that write volume.
6. **The dual-hat turn.** This is an engineering pattern (adapters, single source of truth, a retrieval index) in service of a leadership outcome: a team can adopt new AI tools without forking their operating knowledge, and no tool choice locks you in. Portability of the *brain* is the real deliverable.

## The takeaway line to land

Never store project knowledge where only one tool can read it. Keep the brain in files, hand each tool a shim, and let your memory outlive whatever AI you're using this quarter.

## Bar check

- **Non-obvious thesis:** the multi-AI problem isn't capability, it's silent memory drift — and the fix is a decades-old software pattern (adapters + single source of truth), not a new tool.
- **Weakest dimension to defend: #2 Earned specificity.** Keep it concrete: show the actual root/adapter file split and a real routing-manifest line, or it reads as generic "stay organized" advice. The specifics are what separate this from a listicle.

## What's left to do

- Include a real (sanitized) adapter file and a routing-manifest snippet as fenced blocks.
- Decide whether to name the specific tools throughout or keep it tool-agnostic with named examples.
- Optional cross-link to "Stop Prompting, Start Compiling" — same spirit (infrastructure over instructions).
