---
title: "Every AI Widget Costs Rows: Fitting Intelligence Into an Excel-Dense Grid"
date: 2026-07-27
description: "We doubled the rows planners could see, then had to find room for AI without giving them back. A story about pixel budgets."
tags: [product, design, ai, ux]
series: Building a Planning Platform in the Age of Agents
seriesOrder: 9
---

The trigger was a single screenshot of a competitor's planning grid: 24 rows by 15 columns, at a 24-pixel row height. Ours showed about 14 rows, or about 6 when a chart sat above the table. Planners, buyers and merchandisers grow up in Excel. To them a dense grid isn't intimidating, it's reassuring: it says "all your numbers are here". So we set out to make our planning workbench dense. Halfway through, I realised we'd squeezed out the one thing we cared about most, the AI. This is the story of putting it back without giving away the rows.

## The problem: it wasn't the font size

My first guess was that our rows were too tall. They were, a little (29px against the competitor's 24). But when we measured everything stacked above the first data row, the real culprit was obvious.

Top bar, scope bar, tab bar, a decision brief, a command bar, a toolbar row, a KPI strip, panel padding, the grid header: **about 473 pixels of chrome** before a single number. Plus another ~236 whenever a chart tile rendered. Row height was the second problem. Chrome was the first.

## What we changed for density

- **A density setting, defaulting to Compact.** Three levels: Comfortable, Compact, Ultra. Ultra stays opt-in because 11px text on a 20px row is below comfortable reading size. The control is an accessibility escape hatch in both directions.
- **Chrome reclaimed: ~473px down to ~247px.** The decision brief collapses to a one-line strip, two toolbars merged into one, charts are hidden behind a "Charts (n)" toggle, padding tightened everywhere.
- **A Grid focus mode** (one key, guarded so it never steals a keystroke from a cell edit) that hides everything except the grid: ~171px of chrome.
- **The grid owns its own scroll.** Before, the whole page scrolled and the column header scrolled away with it, which would have made dense rows unreadable. Now the header sticks and the first identifier columns stay frozen.
- **Editing a cell no longer changes the row height,** and comments became a small corner marker.

Then we measured, with a browser script, on a 12-column buy sheet:

| Screen | Comfortable | **Compact** | Ultra |
|---|---|---|---|
| 1920×1080 | 21 | **29** | 32 |
| 1920×1080, Grid focus | 24 | **32** | 35 |
| 1440×900 | 16 | **22** | 24 |

**From about 14 rows to 29 by default, and 35 at most.** We "beat" the competitor's 24, with an honest footnote: their grid sits inside a modal dialog and ours uses the whole pane. It's not a like-for-like contest. It was enough to stop the grid feeling cramped.

## Then the catch

When I showed it, the response was immediate: *"We need a place for AI. It's important to us."*

Fair, and partly my fault. The density pass had squashed the AI commentary into a one-line disclosure. But looking closer, AI in the workbench had been thin even before that:

- an **AI Findings** tab existed, but it was inert: severity was never styled and nothing linked a finding to the rows it described,
- AI prose showed up on only 3 of the workbench tasks,
- the copilot side panel was closed by default.

So the question became sharper: **where does AI live in a grid whose whole point is that every row counts?**

## What we considered

1. **A tall AI block above the grid.** Most visible. But it spends exactly the rows we had just won.
2. **An always-open copilot rail on the side.** Great for conversation. But at 340px wide it costs about three columns, and planners scroll sideways enough already.
3. **A one-row insight bar above the grid, plus markers inside the grid.** Small, always there, and connected to the data.

<figure class="diagram">
<svg viewBox="0 0 480 330" role="img" aria-labelledby="t-rows-1">
<title id="t-rows-1">Rows visible at 1080p: before, competitor, after, and with the AI bar</title>
<text class="dg-muted" x="20" y="24" font-size="13">Data rows visible, 1920×1080</text>
<line class="dg-line" x1="170" y1="36" x2="170" y2="290"/>
<text class="dg-text" x="160" y="62" font-size="14" text-anchor="end">Before</text>
<rect class="dg-warn" x="170" y="44" width="112" height="28" rx="4"/>
<text class="dg-on-accent" x="270" y="63" font-size="14" text-anchor="end">14</text>
<text class="dg-text" x="160" y="108" font-size="14" text-anchor="end">Competitor modal</text>
<rect class="dg-box" x="170" y="90" width="192" height="28" rx="4"/>
<text class="dg-text" x="350" y="109" font-size="14" text-anchor="end">24</text>
<text class="dg-text" x="160" y="154" font-size="14" text-anchor="end">After, Compact</text>
<rect class="dg-ok" x="170" y="136" width="232" height="28" rx="4"/>
<text class="dg-on-accent" x="390" y="155" font-size="14" text-anchor="end">29</text>
<text class="dg-text" x="160" y="200" font-size="14" text-anchor="end">+ AI bar, 1 line</text>
<rect class="dg-ok" x="170" y="182" width="216" height="28" rx="4"/>
<rect class="dg-accent" x="386" y="182" width="16" height="28" rx="2"/>
<text class="dg-on-accent" x="374" y="201" font-size="14" text-anchor="end">27</text>
<text class="dg-text" x="160" y="246" font-size="14" text-anchor="end">+ AI bar, 2 lines</text>
<rect class="dg-ok" x="170" y="228" width="200" height="28" rx="4"/>
<rect class="dg-accent" x="370" y="228" width="32" height="28" rx="2"/>
<text class="dg-on-accent" x="358" y="247" font-size="14" text-anchor="end">25</text>
<text class="dg-muted" x="20" y="286" font-size="13">Accent = rows spent on AI</text>
<text class="dg-muted" x="20" y="312" font-size="13">Max with Grid focus + Ultra: 35</text>
</svg>
<figcaption>The density work bought 15 rows. The AI bar spends 4 of them back, on purpose.</figcaption>
</figure>

## The call: a bar and a dot

We went with option 3. The reasoning that settled it: a one-row bar plus in-grid markers makes AI **more present for less space**, and for the first time connects findings to the data they're about.

**The insight bar** sits directly above the grid and survives Grid focus. It shows severity counts and the current finding, with arrows to step through findings and buttons to accept, explain or dismiss. Stepping to a finding switches to the right sheet and scrolls its rows into view. "Explain" opens the copilot with that finding already pinned as context.

**Row markers** do the linking. Each finding names a target: a sheet, a column, and the business keys it's about. Matching on business keys instead of row positions means the link survives sorting, filtering and refreshed data. Targeted rows get a soft tint, and every flagged row gets a severity dot in the frozen label column.

<figure class="diagram">
<svg viewBox="0 0 480 300" role="img" aria-labelledby="t-rows-2">
<title id="t-rows-2">Side rail costs columns; insight bar plus row dots costs two rows</title>
<text class="dg-text" x="110" y="22" font-size="14" text-anchor="middle">Side rail</text>
<text class="dg-text" x="360" y="22" font-size="14" text-anchor="middle">Bar + dots</text>
<rect class="dg-box" x="10" y="36" width="130" height="220" rx="6"/>
<rect class="dg-accent" x="144" y="36" width="76" height="220" rx="6"/>
<text class="dg-on-accent" x="182" y="140" font-size="13" text-anchor="middle">copilot</text>
<text class="dg-on-accent" x="182" y="158" font-size="13" text-anchor="middle">340px</text>
<line class="dg-line" x1="10" y1="66" x2="140" y2="66"/>
<line class="dg-line" x1="10" y1="96" x2="140" y2="96"/>
<line class="dg-line" x1="10" y1="126" x2="140" y2="126"/>
<line class="dg-line" x1="10" y1="156" x2="140" y2="156"/>
<line class="dg-line" x1="10" y1="186" x2="140" y2="186"/>
<line class="dg-line" x1="10" y1="216" x2="140" y2="216"/>
<text class="dg-muted" x="115" y="278" font-size="13" text-anchor="middle">costs ~3 columns</text>
<rect class="dg-accent" x="260" y="36" width="210" height="26" rx="6"/>
<text class="dg-on-accent" x="365" y="54" font-size="13" text-anchor="middle">3 high · finding 1 of 7 ‹ ›</text>
<rect class="dg-box" x="260" y="66" width="210" height="190" rx="6"/>
<line class="dg-line" x1="260" y1="96" x2="470" y2="96"/>
<line class="dg-line" x1="260" y1="126" x2="470" y2="126"/>
<line class="dg-line" x1="260" y1="156" x2="470" y2="156"/>
<line class="dg-line" x1="260" y1="186" x2="470" y2="186"/>
<line class="dg-line" x1="260" y1="216" x2="470" y2="216"/>
<rect class="dg-warn" x="262" y="98" width="206" height="26" rx="2" opacity="0.35"/>
<circle class="dg-warn" cx="274" cy="111" r="5"/>
<circle class="dg-warn" cx="274" cy="171" r="5"/>
<circle class="dg-ok" cx="274" cy="231" r="5"/>
<text class="dg-muted" x="365" y="278" font-size="13" text-anchor="middle">costs 2 rows, keeps columns</text>
</svg>
<figcaption>Dots sit in the frozen label column, so they stay visible however far you scroll sideways.</figcaption>
</figure>

One rule made the whole thing trustworthy: the AI findings for every task were **derived from the rows actually on screen**. Thresholds applied to real values, numbers recomputed. If the bar says a category is over budget, the grid underneath adds up to that.

> An AI feature that costs no space is one nobody sees. One that costs too much is one nobody keeps. Price it in rows.

## Round two: paying for trust

The first bar cost **2 rows** (29 to 27). Review feedback asked for more, and it was right:

- **Provenance on line one:** the agent's name, its version, and when it ran ("ran 12 min ago").
- **A call to action instead of a label:** "3 high-severity findings need a decision before you approve", computed from the findings when nobody has written one.
- **A short pulse when a plan opens,** three cycles, cleared on first interaction or after six seconds. An animation that outlives being noticed is noise. With reduced-motion turned on, it's a static ring.

That made the bar two lines, and the grid went to **25 rows**. Four rows was the price of provenance, a call to action and the actions themselves. We stated it plainly and paid it.

## Two "Approve" buttons, two different objects

Now the screen had an Approve in the top bar and an Approve in the AI bar. My instinct was to remove one. The better answer was that they **approve different things**.

- The top bar approves **the plan**: the human sign-off.
- The AI bar now reads **"Approve N suggestions"**. It applies every open finding that carries a concrete action. Findings without one are observations, so they aren't counted and stay in the queue for a human to judge. If the agent has recommended nothing, the button disappears.

The confirmation says what happened and what's left: "Applied 7 AI suggestions · nothing left open", or "… · 2 findings left to judge". Different verbs on different objects. No duplicate.

Testing caught a nice bug here. The written call to action was static, so after you accepted everything it still said "approve the agent's 7 suggestions". Now the written line only holds while the queue is untouched; after the first accept or dismiss, live computed text takes over, ending at "Every finding on this plan is resolved."

## What I'd tell another team

- **Measure where the pixels go before you shrink anything.** Our problem was chrome, not font size.
- **Give every AI surface a row budget,** and say out loud what it costs. "Four rows for provenance" is a decision a team can make; "a bit more AI" isn't.
- **Link AI to the data it's about.** A finding that can't point to its rows is just a paragraph.
- **Separate approving the AI's suggestions from approving the work.** Same word, different objects; make the label say which.
- **Keep a density escape hatch** in both directions. Dense is a default, not a mandate.

Next, the last product story: what happened when a real RFP [tested the whole design](/blog/progress-isnt-sufficiency).
