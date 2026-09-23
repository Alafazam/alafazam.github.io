---
title: "Stop Prompting, Start Compiling"
date: TODO
description: "Every AGENTS.md is full of 'please remember to…' instructions, and they all decay. The process rules you actually care about belong in a hook, not a system prompt."
tags: [ai, workflows, engineering-leadership, tooling]
draft: true
---

<!--
DRAFT / OUTLINE — not published. Structure in your own voice, set a date, remove `draft:`, move up one folder to publish.
Source: pm-brain ms-planning-brain extraction, Part 3 (operating-model innovations) + ai-first-practice/rules.md.
-->

## The one-line thesis

Prose governance is advisory. Code governance isn't. Any rule you actually care about enforcing — not just aspiring to — needs to become a hook or a deterministic check, because a model under context pressure (or a teammate switching tools) will quietly skip the markdown.

## Who this is for

Anyone running an AI-first practice who has written a beautiful `AGENTS.md` / `.cursorrules` / `CLAUDE.md` full of "always do X before Y" — and watched the AI ignore it three sessions later.

## The hook (open here)

I told my AI to write a decision log before every commit. It agreed every time. It did it maybe half the time. The fix wasn't a better prompt — it was a 12-line shell script that refuses the commit until the log exists.

## The argument (section beats)

1. **Why prose decays.** An instruction buried in a context file is one of a thousand tokens competing for attention. Under pressure — long session, big diff, a different tool driving — it loses. This isn't the model being bad; it's how attention works.
2. **The taxonomy** (the useful, sharable core of the piece): sort your process rules into two bins.
   - **Taste / judgment** — "challenge weak assumptions," "braindump before structuring." These *should* live in prose; they need context a script can't have.
   - **Load-bearing invariants** — "a log exists before every commit," "no decision status lives in two files," "no orphaned docs." These must be code.
   The skill is knowing which bin a rule is in.
3. **A worked example: the commit gate.** A `PreToolUse` hook intercepts every `git commit` and blocks it until today's log file exists and was modified today. The division of labor is the point: the *hook* enforces the gate; the *LLM* does the writing (it has conversation context the script never will). Enforcement and intelligence, cleanly split.
4. **A second example: the coherence linter.** A `/sync-brain` sweep that hunts duplicated routing, orphaned docs, and drifted decision statuses across a hundred-file knowledge base. Written *after* the first incident (an important architecture doc that no index pointed to went invisible) — a postmortem that produced a check, exactly like a CI regression test.
5. **The generalization.** This is DRY and CI applied to knowledge work, not code. The same instincts that stop duplicated business logic and un-tested regressions should stop duplicated facts and un-enforced process. Most people never make the jump because "it's just docs."

## The takeaway line to land

For every rule in your AGENTS.md, ask one question: *is this load-bearing?* If yes, it doesn't belong in the prompt — it belongs in a hook. Don't ask your AI to remember your process. Compile it.

## What's left to do

- Include the actual hook (sanitized) as a fenced `bash` block — the piece is much stronger with the real 12 lines shown.
- Decide whether to name Claude Code specifically or keep it tool-agnostic (`PreToolUse` is Claude-Code-specific; the principle isn't).
- Optional callback to the companion idea: the AI writes; the infrastructure enforces. Could cross-link the "Deterministic Spine" piece (same split: intelligence inside, determinism around).
