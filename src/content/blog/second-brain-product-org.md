---
title: "A Second Brain That Runs the Product Org: Operating With AI Agents Day to Day"
date: 2026-07-22
description: "How one git repo of plain Markdown became the shared memory for me and several AI agents, and the rules that keep it from rotting."
tags: [ai, agents, engineering-leadership, ways-of-working]
series: Building a Planning Platform in the Age of Agents
seriesOrder: 8
---

Every post in this series so far describes a design decision. None of them would have happened at this pace without the thing underneath: a single git repository of plain Markdown that acts as the shared memory for me and every AI agent I work with. I started it on 24 April with one rule, no implementation code, and by late July it was coordinating four AI agents in parallel without them stepping on each other. This post is about how that "second brain" works, what broke along the way, and the handful of rules that keep it useful.

## The problem: agents forget, and so do people

AI agents are brilliant inside one conversation and amnesiac across them. Every new session starts from zero. If the context lives in chat history, it is gone. If it lives in a tool's private memory, it is invisible the moment you switch tools, and I use three of them daily (Claude Code, Cursor and Codex).

People have the same problem, just slower. A decision made in a call in May gets argued again in July because nobody can find where it was written down.

So the requirement was simple to state: **one place where decisions, context and open questions live, readable by any agent and any person, cheap to load, and hard to let rot.**

## What we considered

The obvious options were a wiki, the AI tools' own memory features, or just long prompts.

A wiki is readable by people but awkward for agents, and nothing stops it from going stale. Tool memory is convenient but locked to one vendor, and it silently diverges between tools. Long prompts work for a week and then cost a fortune in tokens, because you pay to reload everything on every session.

What I chose instead was a git repo with a few strict conventions. Git gives history, review and branches for free. Markdown is readable by every model and every human. And because the repo is planning-only, with no product code in it, agents aren't distracted by build files and the whole thing can be shared with stakeholders as is.

## The call (and why): three files, everything else on demand

The core of the design is that an agent loads only three short files at the start of every session. Everything else stays asleep until a task wakes it.

<figure class="diagram">
<svg viewBox="0 0 480 410" role="img" aria-labelledby="t-second-brain-product-org-1">
<title id="t-second-brain-product-org-1">Three always-loaded files route an agent to on-demand context, with a commit hook guarding the log</title>
<defs><marker id="arrow-second-brain-product-org" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<text class="dg-muted" x="240" y="18" font-size="13" text-anchor="middle">loaded every session (about 3,800 words)</text>
<rect class="dg-accent" x="10" y="28" width="148" height="66" rx="10"/>
<text class="dg-on-accent" x="84" y="56" font-size="15" text-anchor="middle">AGENTS</text>
<text class="dg-on-accent" x="84" y="78" font-size="12" text-anchor="middle">how to behave</text>
<rect class="dg-accent" x="166" y="28" width="148" height="66" rx="10"/>
<text class="dg-on-accent" x="240" y="56" font-size="15" text-anchor="middle">INDEX</text>
<text class="dg-on-accent" x="240" y="78" font-size="12" text-anchor="middle">where things live</text>
<rect class="dg-accent" x="322" y="28" width="148" height="66" rx="10"/>
<text class="dg-on-accent" x="396" y="56" font-size="15" text-anchor="middle">MEMORY</text>
<text class="dg-on-accent" x="396" y="78" font-size="12" text-anchor="middle">what to wake, when</text>
<line class="dg-line" x1="240" y1="94" x2="240" y2="126" marker-end="url(#arrow-second-brain-product-org)"/>
<text class="dg-muted" x="248" y="116" font-size="12">task mentions "versioning"</text>
<text class="dg-muted" x="240" y="146" font-size="13" text-anchor="middle">asleep until a trigger word wakes them</text>
<rect class="dg-box" x="10" y="156" width="110" height="56" rx="8"/><text class="dg-text" x="65" y="181" font-size="14" text-anchor="middle">Decision</text><text class="dg-text" x="65" y="199" font-size="14" text-anchor="middle">records</text>
<rect class="dg-box" x="130" y="156" width="110" height="56" rx="8"/><text class="dg-text" x="185" y="181" font-size="14" text-anchor="middle">Layer and</text><text class="dg-text" x="185" y="199" font-size="14" text-anchor="middle">engine docs</text>
<rect class="dg-box" x="250" y="156" width="110" height="56" rx="8"/><text class="dg-text" x="305" y="181" font-size="14" text-anchor="middle">Open</text><text class="dg-text" x="305" y="199" font-size="14" text-anchor="middle">questions</text>
<rect class="dg-box" x="370" y="156" width="100" height="56" rx="8"/><text class="dg-text" x="420" y="181" font-size="14" text-anchor="middle">Context</text><text class="dg-text" x="420" y="199" font-size="14" text-anchor="middle">files</text>
<rect class="dg-box" x="10" y="246" width="220" height="56" rx="8"/><text class="dg-text" x="120" y="270" font-size="14" text-anchor="middle">Daily log</text><text class="dg-muted" x="120" y="290" font-size="12" text-anchor="middle">5 to 15 lines, written by the agent</text>
<rect class="dg-warn" x="250" y="246" width="220" height="56" rx="8"/><text class="dg-on-accent" x="360" y="270" font-size="14" text-anchor="middle">Commit hook</text><text class="dg-on-accent" x="360" y="290" font-size="12" text-anchor="middle">no log today, no commit</text>
<line class="dg-line" x1="250" y1="274" x2="232" y2="274" marker-end="url(#arrow-second-brain-product-org)"/>
<rect class="dg-ok" x="10" y="334" width="460" height="56" rx="8"/>
<text class="dg-on-accent" x="240" y="358" font-size="14" text-anchor="middle">Promotion: logs feed decision records,</text>
<text class="dg-on-accent" x="240" y="378" font-size="14" text-anchor="middle">open questions and rules, never the other way round</text>
<line class="dg-line" x1="120" y1="302" x2="120" y2="332" marker-end="url(#arrow-second-brain-product-org)"/>
</svg>
<figcaption>The manifest doesn't hold memory, it holds a list of what exists and the words that should wake it.</figcaption>
</figure>

- **AGENTS** describes how to behave: challenge weak assumptions, surface what a decision forecloses before agreeing, keep the final call with me. It also captures how I actually work. I braindump without announcing it, so the agent is told to detect that and ask one question at a time rather than structuring too early.
- **INDEX** is the map. It holds the only routing table from topic to folder.
- **MEMORY** is a manifest of sleeping context. Each row says "wake this file when the task mentions these words". It also carries one hard rule: memory lives in this repo, never in a tool's private storage, because another AI will need it tomorrow.

## The rules that keep it from rotting

A second brain is easy to start and very easy to let decay. These are the rules that earned their place, each one after something went wrong.

**One job per file.** In June I audited what was loaded every session: 4,988 words. The bloat wasn't wordiness; the same routing table had been copied into three files and the copies were drifting. I made one file the single source, deleted instructions for habits I don't actually have, and got the always-loaded set down to 3,809 words. That is about 24% fewer tokens on every session, with nothing lost.

**Logs before commits, enforced by code.** The agent writes a short daily note after any real work: what changed and why. Rather than trust that instruction, a hook blocks any `git commit` until today's log exists and was updated today. If the commit is blocked, the agent writes the log, which it can do well because it has the conversation, and then commits. An instruction is a hope. A hook is a guarantee.

**One decision structure, and status lives in one place.** By July we had two places for decisions, a decisions folder and architecture decision records. On 2 July we folded seven entries into the decision records and deleted the folder. The same audit found five documents that restated a decision's open or closed status, and the restated copies were wrong. Now status lives only in the record itself; everything else links to it. While migrating, we even caught one record still naming a database we had never chosen.

**Prompt for the record at the moment of logging.** Decisions used to get logged in the daily note and then forgotten. Now, when a log captures an important decision, the agent asks in the same breath whether to open or update the record. Records get written when the decision is fresh, not reconstructed later.

**Register everything, and hunt orphans.** A document the brain cannot route to is a document nobody will read. Our canonical architecture diagram once went missing from every index for exactly this reason. Now any new artifact gets registered in its index in the same session, and the agent flags anything important that nothing points to.

> An instruction is a hope. A hook is a guarantee. Put the rules you care about most into code the agent cannot skip.

## What it unlocked: parallel agents without collisions

The payoff came on 21 July, when we migrated the 53-page design prototype to a real Angular app. Because the plan, the ownership rules and the conventions were all written down, I could run the work as waves of parallel agents.

<figure class="diagram">
<svg viewBox="0 0 480 360" role="img" aria-labelledby="t-second-brain-product-org-2">
<title id="t-second-brain-product-org-2">Four agent lanes with separate folder ownership merge into one integration build with zero conflicts</title>
<defs><marker id="arrow-second-brain-product-org-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<rect class="dg-box" x="10" y="10" width="460" height="40" rx="8" stroke-dasharray="5 4"/>
<text class="dg-text" x="240" y="35" font-size="14" text-anchor="middle">shared code frozen · owned by the integrator only</text>
<rect class="dg-ok" x="10" y="66" width="300" height="40" rx="8"/><text class="dg-on-accent" x="22" y="91" font-size="14">Lane A · operations</text><text class="dg-on-accent" x="298" y="91" font-size="14" text-anchor="end">9 pages</text>
<rect class="dg-ok" x="10" y="116" width="300" height="40" rx="8"/><text class="dg-on-accent" x="22" y="141" font-size="14">Lane B · standalone</text><text class="dg-on-accent" x="298" y="141" font-size="14" text-anchor="end">7 pages</text>
<rect class="dg-ok" x="10" y="166" width="300" height="40" rx="8"/><text class="dg-on-accent" x="22" y="191" font-size="14">Lane C · AI studio</text><text class="dg-on-accent" x="298" y="191" font-size="14" text-anchor="end">8 pages</text>
<rect class="dg-ok" x="10" y="216" width="300" height="40" rx="8"/><text class="dg-on-accent" x="22" y="241" font-size="14">Lane D · data flows</text><text class="dg-on-accent" x="298" y="241" font-size="14" text-anchor="end">7 pages</text>
<path class="dg-line" d="M310,86 L350,86 L350,236 L310,236"/>
<line class="dg-line" x1="310" y1="136" x2="350" y2="136"/>
<line class="dg-line" x1="310" y1="186" x2="350" y2="186"/>
<line class="dg-line" x1="350" y1="161" x2="368" y2="161" marker-end="url(#arrow-second-brain-product-org-b)"/>
<rect class="dg-accent" x="370" y="116" width="100" height="90" rx="10"/>
<text class="dg-on-accent" x="420" y="148" font-size="14" text-anchor="middle">Integration</text>
<text class="dg-on-accent" x="420" y="168" font-size="14" text-anchor="middle">build</text>
<text class="dg-on-accent" x="420" y="190" font-size="12" text-anchor="middle">first try</text>
<text class="dg-text" x="10" y="292" font-size="15">0 cross-lane conflicts</text>
<text class="dg-text" x="10" y="316" font-size="15">1 lint error across about 31 pages</text>
<text class="dg-muted" x="10" y="342" font-size="13">Then 52 old-vs-new screenshot pairs for a human to check.</text>
</svg>
<figcaption>Each lane owned its own folders and route file. Nobody touched shared code except the integrator.</figcaption>
</figure>

Four agents worked in one tree at the same time, each owning its own folders, with shared code frozen. The integration build passed on the first attempt, with one lint error across about 31 pages and zero conflicts between lanes. The second wave, four engine-sized tracks, went just as cleanly, even after a usage outage killed three agents mid-flight; they resumed from their transcripts and finished. A screenshot harness comparing old and new pages caught a real bug that code review had missed: one page was quietly pinning the browser's main thread in a reactive loop.

## The tradeoffs we accepted

- **Upkeep is real.** Registering artifacts, writing logs and sweeping for drift take time every week. The brain is only as good as its weakest index.
- **Logs are not truth.** Daily notes are raw capture. Someone, usually me with an agent, has to promote what matters into decision records and rules.
- **Hooks can annoy.** Blocking a commit for a missing log feels heavy on a one-line fix. I kept it anyway, because the exceptions are where the gaps come from.
- **It concentrates context in one repo.** That's the point, but it also means access to the repo is access to a lot of reasoning, so what goes in needs care.

## What I'd tell another team

- Keep memory in a repo you own, in plain text, not in any one AI tool.
- Load three small files every session and wake the rest by trigger words. Measure what you load.
- Give every file one job, and keep each fact in exactly one place.
- Turn the rules you care about most into hooks. Agents follow code more reliably than prose.
- Write ownership down before you run agents in parallel. Clear lanes beat clever merging.

That is the machinery behind every decision in this series. The next post goes back to the product: what happens when you try to fit AI into a grid that planners already find dense.
