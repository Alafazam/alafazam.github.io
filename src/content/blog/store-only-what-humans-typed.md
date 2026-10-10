---
title: "Store Only What Humans Typed: Modelling a Planning Cube on a Columnar Database"
date: 2026-04-25
description: "Why we put a planning cube on one columnar database, stored only the numbers people decided, and cut eight dimensions to four."
tags: [architecture, data, clickhouse, planning]
series: Building a Planning Platform in the Age of Agents
seriesOrder: 1
---

A merchandise plan looks like a spreadsheet, but underneath it is a cube: every product, at every store, in every channel, for every week. When we started designing the data layer for our planning platform, the first sum I did was 200,000 products × 500 stores × 52 weeks. That is 5.2 billion cells for one measure, in one version, for one mid-sized retailer. Then you multiply by thirty measures and every scenario a planner ever creates. That number decided most of what follows.

## The problem: two jobs that pull in opposite directions

A planning system has to do two things that databases usually split between them.

First, it has to **read huge slices fast**. A planner opens "all of footwear, by region, by month" and expects totals in a second. That is analytics work, and columnar databases are built for it.

Second, it has to **handle relationships and edits**. Products sit inside categories, stores sit inside regions, and when a planner types a number at the top, it has to flow down to the bottom. That is join-heavy, update-heavy work, and analytics databases are bad at it.

On 24 April we wrote down six options: ClickHouse, Snowflake, PostgreSQL, a data lake, a hybrid of a relational and an analytical store, and DuckDB. The hybrid looked like the textbook answer: joins in one place, aggregations in the other.

## What we considered

The hybrid was the option I wanted to like. It gives each workload its natural home. But it also gives you two systems to run, a sync pipeline between them, and a permanent question about which one is the truth. For a small team building a multi-tenant product, that tax never goes away.

Snowflake was strong but tied us to one vendor and its pricing at scale. PostgreSQL was a great fit for joins, but we had real doubts about aggregation speed at this size. DuckDB is lovely on a laptop, but it is not built to be a shared multi-tenant server.

So the real question became: **can one columnar store do both jobs if we change how we model the data?**

## The call (and why)

On 25 April we closed the decision: **ClickHouse as the single store.** No second database, no sync.

The trick that made it work was to stop asking the database to walk hierarchies at query time. We resolve hierarchies when data is written, in flat tables, so reads never need a deep join. That is a known pattern for columnar stores, and it turned "ClickHouse is bad at joins" from a blocker into a design rule.

The bigger idea came two months later, while I was trying to explain the model in plain words. Picture a giant wall of mailboxes, one number per box. Almost every box is empty, or could be worked out from other boxes. So why store them?

We ended up with two words that now run through the whole design:

- An **anchor** is a number someone decided on purpose. "Jeans, all stores, whole spring season: 12,000 units." A planner typed that, or an algorithm produced it. It is a real decision.
- A **basis** is the recipe for splitting a big number into small ones. "Split it the way last year's sales were shaped." Delhi got 60% last year, Mumbai 40%, and the early weeks were busier than the late ones.

We store the anchors and the bases. Everything else is worked out when someone looks at it.

<figure class="diagram">
<svg viewBox="0 0 480 400" role="img" aria-labelledby="t-store-only-what-humans-typed-1">
<title id="t-store-only-what-humans-typed-1">One typed anchor fans out to derived cells through a basis; roll-up only needs addition</title>
<defs><marker id="arrow-store-only-what-humans-typed" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<rect class="dg-accent" x="90" y="16" width="300" height="64" rx="10"/>
<text class="dg-on-accent" x="240" y="44" font-size="16" text-anchor="middle">Jeans · all stores · Spring</text>
<text class="dg-on-accent" x="240" y="66" font-size="16" text-anchor="middle">12,000 units (typed)</text>
<line class="dg-line" x1="190" y1="80" x2="130" y2="150" marker-end="url(#arrow-store-only-what-humans-typed)"/>
<line class="dg-line" x1="290" y1="80" x2="350" y2="150" marker-end="url(#arrow-store-only-what-humans-typed)"/>
<text class="dg-muted" x="240" y="128" font-size="14" text-anchor="middle">basis: last year's shape</text>
<rect class="dg-box" x="40" y="152" width="180" height="56" rx="10" stroke-dasharray="5 4"/>
<text class="dg-text" x="130" y="176" font-size="15" text-anchor="middle">Delhi · 60%</text>
<text class="dg-muted" x="130" y="197" font-size="14" text-anchor="middle">7,200 (derived)</text>
<rect class="dg-box" x="260" y="152" width="180" height="56" rx="10" stroke-dasharray="5 4"/>
<text class="dg-text" x="350" y="176" font-size="15" text-anchor="middle">Mumbai · 40%</text>
<text class="dg-muted" x="350" y="197" font-size="14" text-anchor="middle">4,800 (derived)</text>
<line class="dg-line" x1="130" y1="208" x2="130" y2="262" marker-end="url(#arrow-store-only-what-humans-typed)"/>
<line class="dg-line" x1="350" y1="208" x2="350" y2="262" marker-end="url(#arrow-store-only-what-humans-typed)"/>
<rect class="dg-box" x="40" y="264" width="180" height="56" rx="10" stroke-dasharray="5 4"/>
<text class="dg-text" x="130" y="288" font-size="15" text-anchor="middle">Delhi · Week 1</text>
<text class="dg-muted" x="130" y="309" font-size="14" text-anchor="middle">≈ 200 (derived)</text>
<rect class="dg-box" x="260" y="264" width="180" height="56" rx="10" stroke-dasharray="5 4"/>
<text class="dg-text" x="350" y="288" font-size="15" text-anchor="middle">Mumbai · Week 1</text>
<text class="dg-muted" x="350" y="309" font-size="14" text-anchor="middle">≈ 133 (derived)</text>
<rect class="dg-accent" x="40" y="342" width="18" height="18" rx="3"/>
<text class="dg-text" x="66" y="356" font-size="14">stored</text>
<rect class="dg-box" x="140" y="342" width="18" height="18" rx="3" stroke-dasharray="4 3"/>
<text class="dg-text" x="166" y="356" font-size="14">computed on read</text>
<text class="dg-muted" x="40" y="388" font-size="14">Going down needs a basis. Going up is just addition.</text>
</svg>
<figcaption>Only the filled box is saved. Every dashed box is worked out from the anchor and the basis when someone opens the view.</figcaption>
</figure>

The asymmetry is the heart of it. **Going up is just addition.** If you know every store's number, the region total needs no recipe. **Going down is a choice.** One number can be split a thousand ways, so splitting always needs a basis, and the basis is a named, visible input rather than a hidden default.

> We don't save what a formula computes. We save the inputs and recompute. Anchors are the inputs.

This also made versioning cheap. A scenario is a branch that stores only the anchors it changed. Everything else comes from its parent.

## Eight dimensions became four

The first model, sketched on day one, borrowed eight dimensions from o9's published model: customer group, account, channel, region, location, planning items, time and demand domain. On 2 July we sat down and asked which of these were really separate questions.

<figure class="diagram">
<svg viewBox="0 0 480 360" role="img" aria-labelledby="t-store-only-what-humans-typed-2">
<title id="t-store-only-what-humans-typed-2">Eight original dimensions mapped to four core dimensions and two candidates</title>
<text class="dg-muted" x="90" y="20" font-size="14" text-anchor="middle">Before: 8</text>
<text class="dg-muted" x="380" y="20" font-size="14" text-anchor="middle">After: 4 + candidates</text>
<rect class="dg-box" x="10" y="32" width="160" height="30" rx="6"/><text class="dg-text" x="90" y="52" font-size="14" text-anchor="middle">Planning items</text>
<rect class="dg-box" x="10" y="72" width="160" height="30" rx="6"/><text class="dg-text" x="90" y="92" font-size="14" text-anchor="middle">Time</text>
<rect class="dg-box" x="10" y="112" width="160" height="30" rx="6"/><text class="dg-text" x="90" y="132" font-size="14" text-anchor="middle">Location</text>
<rect class="dg-box" x="10" y="152" width="160" height="30" rx="6"/><text class="dg-text" x="90" y="172" font-size="14" text-anchor="middle">Region</text>
<rect class="dg-box" x="10" y="192" width="160" height="30" rx="6"/><text class="dg-text" x="90" y="212" font-size="14" text-anchor="middle">Channel</text>
<rect class="dg-box" x="10" y="232" width="160" height="30" rx="6"/><text class="dg-text" x="90" y="252" font-size="14" text-anchor="middle">Customer group</text>
<rect class="dg-box" x="10" y="272" width="160" height="30" rx="6"/><text class="dg-text" x="90" y="292" font-size="14" text-anchor="middle">Account</text>
<rect class="dg-box" x="10" y="312" width="160" height="30" rx="6"/><text class="dg-text" x="90" y="332" font-size="14" text-anchor="middle">Demand domain</text>
<rect class="dg-ok" x="290" y="32" width="180" height="30" rx="6"/><text class="dg-on-accent" x="380" y="52" font-size="14" text-anchor="middle">Product</text>
<rect class="dg-ok" x="290" y="72" width="180" height="30" rx="6"/><text class="dg-on-accent" x="380" y="92" font-size="14" text-anchor="middle">Time</text>
<rect class="dg-ok" x="290" y="122" width="180" height="40" rx="6"/><text class="dg-on-accent" x="380" y="139" font-size="14" text-anchor="middle">Location</text><text class="dg-on-accent" x="380" y="155" font-size="12" text-anchor="middle">region is now a level</text>
<rect class="dg-ok" x="290" y="192" width="180" height="30" rx="6"/><text class="dg-on-accent" x="380" y="212" font-size="14" text-anchor="middle">Channel</text>
<rect class="dg-box" x="290" y="252" width="180" height="30" rx="6" stroke-dasharray="5 4"/><text class="dg-text" x="380" y="272" font-size="14" text-anchor="middle">Customer (candidate)</text>
<rect class="dg-box" x="290" y="312" width="180" height="30" rx="6" stroke-dasharray="5 4"/><text class="dg-text" x="380" y="332" font-size="14" text-anchor="middle">Attribute (candidate)</text>
<line class="dg-line" x1="170" y1="47" x2="290" y2="47"/>
<line class="dg-line" x1="170" y1="87" x2="290" y2="87"/>
<line class="dg-line" x1="170" y1="127" x2="290" y2="137"/>
<line class="dg-accent-line" x1="170" y1="167" x2="290" y2="147"/>
<line class="dg-line" x1="170" y1="207" x2="290" y2="207"/>
<line class="dg-line" x1="170" y1="247" x2="290" y2="263"/>
<line class="dg-line" x1="170" y1="287" x2="290" y2="271"/>
<line class="dg-line" x1="170" y1="327" x2="290" y2="327"/>
</svg>
<figcaption>Region was never its own axis, just a coarser view of location. Customer group and account were one axis split in two.</figcaption>
</figure>

Region was the clearest case. A planner thinking about "the North" is thinking about locations at a coarser zoom, not asking a different question. So region became a level inside the location hierarchy. Customer group and account collapsed into one candidate "customer" dimension that matters mostly for wholesale tenants. Demand domain (regular, promotional, event) may end up as a tag on a measure rather than an axis.

Fewer axes means flatter tables, predictable queries and a much simpler grid. We kept a metadata-driven way to add a fifth dimension later, but rejected fully configurable N-dimension models for now. That flexibility multiplies complexity at every layer, and fashion planning does not need it.

## What the outside review caught

Later in the summer we had the physical model reviewed in depth. Two findings ranked above every question we had actually asked.

The first: our draft treated a version as a plain column. That quietly implies full copies, so **a scenario that changes 200 cells would copy 5 billion rows**. The fix is the same idea as anchors: copy-on-write versions that store only their changes and point to a parent.

The second was harder to hear. Planning tools that live in memory give you a sub-second loop: edit a cell, recalculate everything that depends on it, see the result. **A columnar store on disk cannot do that, and no schema fixes it.** So the edit loop moves into memory. The database serves the slice when a workbook opens, the spread and recalculation happen in the workbook service, and the changed cells are saved back as an append.

The review also settled a quieter question. Storing one row per measure ("tall") would mean about 156 billion rows per version. One column per measure ("wide") keeps it at 5.2 billion, and compresses far better because each column holds similar numbers.

## The tradeoffs we accepted

- **No live recalculation in the database.** We own an in-memory working set and the code that keeps it honest.
- **The planning hierarchy freezes for a season.** Reclassifying a product mid-season becomes a change for the next version, not an instant edit. Merchandise planning mostly works this way already; we made it an explicit rule.
- **Rates need care.** Margin % or sell-through cannot simply be summed, and stock cannot be summed across weeks. In our worked example, getting that rule wrong made on-hand stock look seven times higher than it was. The aggregation rule has to live in exactly one place.

## What I'd tell another team

- Do the cell-count arithmetic on day one. It will veto designs faster than any debate.
- Store decisions, not results. If a number can be derived, derive it on read.
- Make the split recipe (the basis) a named input. Hidden defaults become arguments with customers.
- Challenge your dimension list. Ask whether each axis is a new question or a different zoom on an old one.
- Ask a reviewer where your store is weakest, not whether it is good. The most useful finding was the one we didn't ask for.

Next in the series: once the data could hold a plan, we had to decide who gets to change it, and whether the AI or the workflow is in charge.
