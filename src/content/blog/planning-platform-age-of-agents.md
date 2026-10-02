---
title: "Series intro: 10 lessons from building a planning platform with AI agents"
date: 2026-10-02
description: "Ten real decisions from five months of redesigning a retail planning platform alongside AI agents: the options, the call, and the cost."
tags: [product, engineering, ai, series]
series: Building a Planning Platform in the Age of Agents
seriesOrder: 0
---

Between April and August 2026 I spent most of my working days redesigning a retail planning platform: the data model, the engines underneath it, where AI fits, and a working prototype of the whole thing. I did most of it alongside AI agents, not as a demo but as the normal way the work got done. This series is ten decisions from those months, written down while I still remember why we made them.

## Who's writing

I lead product architecture at Increff. My days sit between product and engineering: deciding what the platform should be, then making sure the design can actually carry it. Merchandisers and planners at fashion and lifestyle retailers use what we build to decide what to buy, how much, and where to send it.

Everything in this series is about *our planning platform* in general terms. Customers appear only as "a large fashion retailer". No client names, no internal code names, no revenue numbers. The numbers that are left (row counts, coverage percentages, scores) are the real ones from the work.

## Why I'm writing this

Most writing about AI products falls into two piles. Demos that show the happy path. Predictions about what AI will do to software in five years. I wanted the part in the middle: an ordinary team making ordinary product calls in 2026, with agents in the loop, and being honest about what each call cost.

The other reason is selfish. Through those five months I kept a "second brain": a repository of decision records, daily logs and design notes that both I and the agents read every session. Rereading it, the same few ideas kept showing up in very different places. Writing them out is how I find out which ones actually hold.

## How each post works

Every post follows the same shape, so you can skim:

- **The problem**, in plain words.
- **What we considered**: usually two or three real options, including the one we didn't pick.
- **The call, and why.**
- **What it cost.** Every decision here gave something up. I say what.
- **What I'd tell another team**: three to five takeaways.

Each one has a diagram drawn for the post, because most of these decisions are easier to see than to read.

There are two tracks. **Product** posts are about positioning, design and what goes on the screen. **Engineering** posts are about data, architecture and how AI fits into a system that has to be correct. They're ordered by when the work happened, so they interleave.

<figure class="diagram">
<svg viewBox="0 0 480 540" role="img" aria-labelledby="t-intro-1">
<title id="t-intro-1">Timeline of the ten stories, April to August 2026</title>
<circle class="dg-accent" cx="30" cy="22" r="8"/>
<text class="dg-text" x="46" y="27" font-size="14">Product</text>
<circle class="dg-ok" cx="140" cy="22" r="8"/>
<text class="dg-text" x="156" y="27" font-size="14">Engineering</text>
<line class="dg-line" x1="110" y1="56" x2="110" y2="512"/>
<text class="dg-muted" x="20" y="84" font-size="13">Apr</text>
<text class="dg-muted" x="20" y="128" font-size="13">May</text>
<text class="dg-muted" x="20" y="172" font-size="13">Jun</text>
<text class="dg-muted" x="20" y="304" font-size="13">Jul</text>
<text class="dg-muted" x="20" y="480" font-size="13">Aug</text>
<line class="dg-line" x1="16" y1="102" x2="100" y2="102" stroke-dasharray="2 4"/>
<line class="dg-line" x1="16" y1="150" x2="100" y2="150" stroke-dasharray="2 4"/>
<line class="dg-line" x1="16" y1="238" x2="100" y2="238" stroke-dasharray="2 4"/>
<line class="dg-line" x1="16" y1="458" x2="100" y2="458" stroke-dasharray="2 4"/>
<text class="dg-muted" x="96" y="84" font-size="12" text-anchor="end">25</text>
<circle class="dg-ok" cx="110" cy="80" r="8"/>
<text class="dg-text" x="130" y="85" font-size="14">1 · Store only what humans typed</text>
<text class="dg-muted" x="96" y="128" font-size="12" text-anchor="end">14</text>
<circle class="dg-ok" cx="110" cy="124" r="8"/>
<text class="dg-text" x="130" y="129" font-size="14">2 · Agents inside the nodes</text>
<text class="dg-muted" x="96" y="172" font-size="12" text-anchor="end">17</text>
<circle class="dg-accent" cx="110" cy="168" r="8"/>
<text class="dg-text" x="130" y="173" font-size="14">3 · Graft, don't pick</text>
<text class="dg-muted" x="96" y="216" font-size="12" text-anchor="end">22</text>
<circle class="dg-accent" cx="110" cy="212" r="8"/>
<text class="dg-text" x="130" y="217" font-size="14">4 · Don't lead with AI</text>
<text class="dg-muted" x="96" y="260" font-size="12" text-anchor="end">02</text>
<circle class="dg-ok" cx="110" cy="256" r="8"/>
<text class="dg-text" x="130" y="261" font-size="14">5 · Killing the god object</text>
<text class="dg-muted" x="96" y="304" font-size="12" text-anchor="end">04</text>
<circle class="dg-accent" cx="110" cy="300" r="8"/>
<text class="dg-text" x="130" y="305" font-size="14">6 · Stop drawing pipelines</text>
<text class="dg-muted" x="96" y="348" font-size="12" text-anchor="end">10</text>
<circle class="dg-ok" cx="110" cy="344" r="8"/>
<text class="dg-text" x="130" y="349" font-size="14">7 · When I overruled the AI</text>
<text class="dg-muted" x="96" y="392" font-size="12" text-anchor="end">22</text>
<circle class="dg-ok" cx="110" cy="388" r="8"/>
<text class="dg-text" x="130" y="393" font-size="14">8 · A second brain for the org</text>
<text class="dg-muted" x="96" y="436" font-size="12" text-anchor="end">27</text>
<circle class="dg-accent" cx="110" cy="432" r="8"/>
<text class="dg-text" x="130" y="437" font-size="14">9 · Every AI widget costs rows</text>
<text class="dg-muted" x="96" y="480" font-size="12" text-anchor="end">25</text>
<circle class="dg-accent" cx="110" cy="476" r="8"/>
<text class="dg-text" x="130" y="481" font-size="14">10 · Progress isn't sufficiency</text>
<text class="dg-muted" x="130" y="530" font-size="12">Evenly spaced; July was the busy month.</text>
</svg>
<figcaption>Ten stories in the order the work happened. Engineering opened the run; product decisions bunched up as the prototype took shape.</figcaption>
</figure>

## The ten parts

| Part | Story | In one line |
|---|---|---|
| 1 | [Store Only What Humans Typed](/blog/store-only-what-humans-typed) | Modelling a planning cube on a columnar database: keep the cells people entered, compute the rest, and cut eight dimensions to four. |
| 2 | [Agents Inside the Nodes, Not at the Wheel](/blog/agents-inside-the-nodes) | Why a deterministic workflow decides and AI is one kind of step inside it, with separate permissions to read, propose and commit. |
| 3 | [Graft, Don't Pick](/blog/graft-dont-pick) | Two dashboard designs, each strong on the opposite half of a 10-point AI-native rubric. We merged them instead of choosing. |
| 4 | [Don't Lead With AI](/blog/dont-lead-with-ai) | Positioning a platform as AI-enabled, not AI-native, when every vendor says the same two words. |
| 5 | [Killing the God Object](/blog/killing-the-god-object) | A strangler-fig plan for a live monolith: 28 capabilities, each ported, rewritten, kept or retired, over six reversible releases. |
| 6 | [Stop Drawing Pipelines](/blog/stop-drawing-pipelines) | Replacing a drag-and-drop pipeline builder with a mapping file an agent drafts and a human approves. |
| 7 | [When I Overruled the AI](/blog/when-i-overruled-the-ai) | The agent's design kept scenarios as a separate service. I folded them into one data service: one question, one hop. |
| 8 | [A Second Brain That Runs the Product Org](/blog/second-brain-product-org) | The memory, routing and guard-rails that let AI agents work on product and architecture every day, including in parallel. |
| 9 | [Every AI Widget Costs Rows](/blog/every-ai-widget-costs-rows) | Doubling the rows planners can see, then finding room for AI without giving them back. |
| 10 | [Progress Isn't Sufficiency](/blog/progress-isnt-sufficiency) | Mapping a 176-line enterprise RFP onto the design: 87 specified, 60 partial, 29 gaps, and only one about AI. |

## The threads that run through all ten

I didn't plan these as themes. They showed up anyway:

- **AI proposes, a human decides.** In data onboarding, in the planning grid, in workflow design. The interesting work is drawing that line clearly.
- **Store what's real, derive the rest.** Cells people typed, feeds that exist, findings computed from the rows on screen. Derived things can't drift.
- **Every feature has a price in space, time or trust.** Saying the price out loud is most of the decision.
- **Measure against someone else's map.** Rubrics, analyst reports and a real buyer's requirements kept catching what our own trackers missed.

> The question is rarely "should we use AI here?" It's "where exactly does the AI stop and the system begin?"

If you build planning software, or any product where AI has to work inside rules rather than replace them, I hope a few of these save you a week. Start with [part 1](/blog/store-only-what-humans-typed), or jump to whichever headline made you wince.
