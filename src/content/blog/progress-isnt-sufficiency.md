---
title: "Progress Isn't Sufficiency: Stress-Testing a Design Against a 176-Line RFP"
date: 2026-08-25
description: "Our tracker said the design was nearly done. Mapping an enterprise RFP onto it showed what 'done' was missing. 87 / 60 / 29."
tags: [product, architecture, strategy, ai]
series: Building a Planning Platform in the Age of Agents
seriesOrder: 10
---

For months we tracked our platform design engine by engine. Each engine had a row on a tracker, each design pass had a cell, and every cell turning green felt like getting closer to done. Then an enterprise RFP from a large fashion retailer arrived: **176 numbered requirements** across eight planning modules, plus a 37-row tab of the KPIs they would judge us on. I mapped every line onto our design in one sitting. It was the first time anyone had asked our architecture a different question: not "how far along are we?" but "is it enough?"

## The problem: two questions that look like one

A progress tracker answers *has this engine been designed?* It's an inside-out question. You decide what the engine should do, then measure how much of that you've written down.

A sufficiency check answers *does the designed engine cover what a real buyer asks for?* That's outside-in. The buyer decides the scope, and you find out how much of it your design already holds.

A tracker can be fully green while the design misses whole categories of need, because nobody put those categories on the tracker. Before this RFP, nothing in our documentation answered the second question.

## What we considered

There were three ways to use the RFP:

1. **Answer it module by module,** the way it was laid out. That produces a good sales response and no engineering insight.
2. **Update the progress tracker** with what the RFP revealed. That mixes the two questions and makes both less honest.
3. **Build a separate sufficiency matrix** next to the tracker: every requirement mapped to the platform capability it needs, then graded against what we had actually planned.

We chose 3. A key idea from our architecture made it possible: **modules are configured on shared engines, not coded one by one**. So "do we have an allocation module?" isn't the real question. The real question is *which engine capability does each requirement land on, and have we planned it?*

## How I kept it honest

- **Archive the source first.** I saved the full requirement sheet as-is before writing a single verdict, so every claim traces back to a row.
- **Assign ownership from the rules, not by instinct.** We keep a registry of which engine owns what. Each requirement was attributed using that registry, so tricky splits stayed consistent.
- **Verify gaps by search.** Every "gap" verdict was checked by searching the whole design for the concept. Words like "exclusion" and "blocklist" returned zero hits. That's evidence, not an assumption.
- **Use a generous bar, and say so.** Anything documented in a design doc or decision record, *or* built in the prototype, counted as planned. The verdict is diagnostic only. A serious buyer asked for all 176, so all 176 have to be built.

## What came back

**87 specified · 60 partial · 29 gaps.** The gaps and partials deduplicated to **21 net-new platform capabilities**. 37 of the 176 also had a working prototype screen behind them.

<figure class="diagram">
<svg viewBox="0 0 480 260" role="img" aria-labelledby="t-suff-1">
<title id="t-suff-1">176 requirements: 87 specified, 60 partial, 29 gaps</title>
<text class="dg-text" x="20" y="28" font-size="15">176 requirements, graded</text>
<rect class="dg-ok" x="20" y="44" width="218" height="44" rx="4"/>
<text class="dg-on-accent" x="129" y="72" font-size="16" text-anchor="middle">87</text>
<rect class="dg-box" x="240" y="44" width="150" height="44" rx="4"/>
<text class="dg-text" x="315" y="72" font-size="16" text-anchor="middle">60</text>
<rect class="dg-warn" x="392" y="44" width="68" height="44" rx="4"/>
<text class="dg-on-accent" x="426" y="72" font-size="16" text-anchor="middle">29</text>
<text class="dg-text" x="20" y="112" font-size="13">Specified 49%</text>
<text class="dg-text" x="240" y="112" font-size="13">Partial 34%</text>
<text class="dg-text" x="392" y="112" font-size="13">Gap 17%</text>
<line class="dg-line" x1="20" y1="132" x2="460" y2="132" stroke-dasharray="3 4"/>
<text class="dg-text" x="20" y="162" font-size="14">Rides the AI engine directly</text>
<rect class="dg-accent" x="20" y="174" width="6" height="24" rx="1"/>
<rect class="dg-box" x="28" y="174" width="432" height="24" rx="2"/>
<text class="dg-text" x="40" y="191" font-size="13">1 of 176</text>
<text class="dg-muted" x="20" y="226" font-size="13">Blue / neutral / amber, labelled in place:</text>
<text class="dg-muted" x="20" y="244" font-size="13">no meaning carried by colour alone.</text>
</svg>
<figcaption>Half the design was already specified. The interesting part is where the other half sits, and how little of it is about AI.</figcaption>
</figure>

The totals were less interesting than where the misses clustered.

<figure class="diagram">
<svg viewBox="0 0 480 400" role="img" aria-labelledby="t-suff-2">
<title id="t-suff-2">Coverage by engine: specified, partial and gap counts</title>
<text class="dg-muted" x="20" y="22" font-size="13">Requirements per engine (blue specified, grey partial, amber gap)</text>
<text class="dg-text" x="20" y="54" font-size="14">Planning data service · 46</text>
<rect class="dg-ok" x="20" y="62" width="240" height="18"/>
<rect class="dg-box" x="260" y="62" width="88" height="18"/>
<rect class="dg-warn" x="348" y="62" width="40" height="18"/>
<text class="dg-text" x="20" y="104" font-size="14">Algorithm engine · 45</text>
<rect class="dg-ok" x="20" y="112" width="112" height="18"/>
<rect class="dg-box" x="132" y="112" width="184" height="18"/>
<rect class="dg-warn" x="316" y="112" width="64" height="18"/>
<text class="dg-text" x="20" y="154" font-size="14">Grid / workbook engine · 24</text>
<rect class="dg-ok" x="20" y="162" width="112" height="18"/>
<rect class="dg-box" x="132" y="162" width="64" height="18"/>
<rect class="dg-warn" x="196" y="162" width="16" height="18"/>
<text class="dg-text" x="20" y="204" font-size="14">Workflow engine · 19</text>
<rect class="dg-ok" x="20" y="212" width="136" height="18"/>
<rect class="dg-box" x="156" y="212" width="8" height="18"/>
<rect class="dg-warn" x="164" y="212" width="8" height="18"/>
<text class="dg-text" x="20" y="254" font-size="14">KPI engine · 9</text>
<rect class="dg-ok" x="20" y="262" width="16" height="18"/>
<rect class="dg-box" x="36" y="262" width="56" height="18"/>
<text class="dg-text" x="20" y="304" font-size="14">Performance, cross-cutting · 7</text>
<rect class="dg-box" x="20" y="312" width="16" height="18"/>
<rect class="dg-warn" x="36" y="312" width="40" height="18"/>
<text class="dg-text" x="20" y="354" font-size="14">No owner at all · 6</text>
<rect class="dg-warn" x="20" y="362" width="48" height="18"/>
<text class="dg-muted" x="460" y="392" font-size="12" text-anchor="end">8px = 1 requirement</text>
</svg>
<figcaption>The data layer was the strongest. The algorithm engine had the worst ratio. Six requirements had no owning engine at all.</figcaption>
</figure>

Four findings were worth acting on:

**1. The data layer was not the risk.** 46 requirements landed on our planning data service, the largest share, and 30 were already specified. Fifteen requirements across six modules were pure scenario mechanics, and they resolved cleanly, which quietly validated [an earlier call to keep scenarios inside the data service](/blog/when-i-overruled-the-ai).

**2. The algorithm engine had the worst ratio: 45 requirements, 14 specified.** Not because its architecture was weak; its design doc is one of our best. The problem was the *catalog*. Retail planning needs blocks that enforce minimums and maximums, pack sizes, minimum order quantities, capacity and distance. We had the measures for those, but no blocks that enforce them. And ten requirements needed something nobody owned: a run scope with include and exclude lists.

**3. Six requirements had no owner at all.** They all asked for the same two things: turn an approved plan into an *executable business document* (a purchase order, a transfer order, a pick list), and *track that document* through dispatched, in transit, received. We could deliver files. Nothing modelled a document as a thing with an identity and a lifecycle. That needs an architecture decision before it needs a backlog item.

**4. The closed loop was missing, and it mattered commercially.** Two requirements asked the platform to say whether its own recommendation worked. Four of the buyer's own KPIs were defined as before-and-after comparisons. Without measuring projected against actual, we couldn't compute them. Outcome tracking stopped being an engineering nicety and became a sales requirement.

> A tracker tells you how far you've walked. Only someone else's map tells you whether you're walking toward the right place.

## The AI finding I didn't expect

**Only 1 of the 176 requirements rode our AI engine directly.**

After months of building agents into everything, that stung for a minute. Then it became useful. It meant our AI surface was ahead of this buyer's ask, not behind it. Better still, I counted 19 capabilities we build that the RFP format simply can't express: agents that author configuration, versioned algorithms, provenance on every cell, scored quality gates, propose-then-apply changes. A buyer can't ask for what their template has no row for. So our response has to name those deliberately rather than hope they get noticed.

## Smaller things the sheet exposed

- **Performance was an unbacked promise.** Seven requirements asked how fast we are, the hardest being a nightly, unattended, full product-by-store replenishment run. No prototype worksheet we had captured went past about 12 rows.
- **Our maths vocabulary was too narrow.** "Store stock imbalance" is a standard deviation across stores. Our measure layer supported sum, weighted average and last value only.
- **Ninety measures, and no this-year vs last-year comparisons.** Fundamental to every planning grid, and simply absent.
- **Eight of the 37 KPIs were outside our platform entirely** (product lifecycle and product information management). Better to say that plainly in the response than leave it implied.

## Two corrections I made along the way

While turning the matrix into a visual briefing, I recounted the KPI tab and found **37 rows, not 39** as I had written in four places. The mapping itself reconciled exactly (13 supported, 10 partial, 6 missing a measure, 8 out of scope), so I fixed the count everywhere.

The colours also failed. Green, amber and red looked fine to me, but a colourblind check on the 176-cell grid showed green and red were almost indistinguishable under the most common colour-vision deficiency, and at that mark size the cells carry no labels to rescue them. I switched to blue, amber and crimson, which passed in both light and dark themes.

## What it cost

The generous bar inflates the good news: "documented" is not "built". Attributing each requirement to one primary engine hides the ones that span two. A few lines in the sheet were terse enough that they need confirming with the buyer before we answer them. And one buyer is not the market. I deliberately didn't fold the gaps into each engine's scope on the spot; that's a per-engine decision, and for the document question, an architecture one.

## What I'd tell another team

- **Keep progress and sufficiency as separate artifacts.** Don't let one green tracker answer both.
- **Use a real buyer's requirements as the test,** not your own feature list.
- **Archive the source and verify every gap by search.** Then each verdict holds up when challenged.
- **Count what the buyer's format can't express.** That's where your differentiation hides.
- **Check your status colours for colourblind safety,** especially on small marks with no labels.

That's the last of the ten. If you're arriving here first, the [series intro](/blog/planning-platform-age-of-agents) has the whole list.
