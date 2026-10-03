---
title: "Stop Drawing Pipelines: Let the Agent Draft the Mapping, Let a Human Press Go"
date: 2026-07-04
description: "We dropped a drag-and-drop pipeline builder for a versioned mapping spec that an agent drafts and a human approves. Here is why."
tags: [product, data, ai, architecture]
series: Building a Planning Platform in the Age of Agents
seriesOrder: 6
---

Almost every data-integration product demo starts the same way: a canvas, some boxes, and someone dragging an arrow from "Source" to "Transform" to "Load". Our original design for the data-onboarding engine of our planning platform looked exactly like that. On 4 July we threw it out. What replaced it is less impressive in a demo and much better in real life: an agent drafts a plain, versioned mapping file, and a human reviews it like a spreadsheet and presses go.

## The problem: the bottleneck wasn't the pipeline

When a new retailer comes on board, their systems (usually an ERP, a point-of-sale system, a warehouse system) drop files on an SFTP server every night. Sales, inventory, product master, store master, purchase orders, returns.

The expensive part of onboarding was never wiring those files together. It was:

- reading the customer's column headers and guessing what they mean,
- mapping them to our tables,
- cleaning the values (date formats, currency symbols, leading zeros),
- deciding what to do when a row is bad,
- and working out why the sales file mentions products the product file has never heard of.

And here is the fact that changed the design: **our target schemas are fixed**. Every pipeline ends in the same core tables. The only things that really vary per customer are the mapping, the transforms, and the validation rules.

A freeform pipeline builder solves a *generality* problem. We didn't have one.

## What we considered

1. **A visual pipeline builder** (the original plan). Maximum flexibility. But a big build: a canvas runtime, a block library, graph validation. Users can draw graphs that don't work. And a picture of a pipeline is very hard to diff or review.
2. **A declarative mapping spec, drafted by an agent and approved by a human.**
3. **A fully managed onboarding service**, the way the big incumbents do it: hide the pipeline behind a services engagement. That contradicts our whole "configure, don't just integrate" position.

We chose option 2.

## The call: the spec is the product

The artifact is a **Mapping Spec**: a JSON file that says, for one feed, which source column goes to which target field, what transform to apply, which validation rules run, how to dedupe, how to load, when to run, and what to do on errors. That last part, the error policy, is a **required** field. Strict for master data, tolerant for transactions, but never left blank.

A few lines of one, simplified:

```json
{ "source_column": "str_code", "target_field": "store_code",
  "transform": "trim(str_code)", "agent_confidence": 0.98,
  "note": "100% value overlap with approved store master" },
{ "source_column": null, "target_field": "channel",
  "default": "offline", "agent_confidence": 0.4 }
```

Why a file and not a picture?

- **An agent can write it.** Given about 100 sample rows, the header, the filename and our target contract, a model can draft a spec with a confidence score per column. Drafting a correct visual graph is a much harder ask.
- **It diffs.** Version 3 to version 4 reads row by row, exactly like the workbook that displays it. Approval, audit and bug fixes all become diffs.
- **It's smaller to build.** No canvas runtime. The effort goes into the review screen and the agent's quality, which is where the value is.

<figure class="diagram">
<svg viewBox="0 0 480 440" role="img" aria-labelledby="t-pipes-1">
<title id="t-pipes-1">The agent proposes a spec; humans pass four gates; only a human activates it</title>
<defs><marker id="arrow-pipes" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<rect class="dg-box" x="20" y="20" width="200" height="56" rx="10"/>
<text class="dg-text" x="120" y="44" font-size="15" text-anchor="middle">Sample file</text>
<text class="dg-muted" x="120" y="64" font-size="13" text-anchor="middle">~100 rows + header</text>
<rect class="dg-box" x="260" y="20" width="200" height="56" rx="10"/>
<text class="dg-text" x="360" y="44" font-size="15" text-anchor="middle">Target contract</text>
<text class="dg-muted" x="360" y="64" font-size="13" text-anchor="middle">fixed fields + keys</text>
<line class="dg-line" x1="120" y1="76" x2="200" y2="104" marker-end="url(#arrow-pipes)"/>
<line class="dg-line" x1="360" y1="76" x2="280" y2="104" marker-end="url(#arrow-pipes)"/>
<rect class="dg-accent" x="120" y="106" width="240" height="56" rx="10"/>
<text class="dg-on-accent" x="240" y="130" font-size="15" text-anchor="middle">Agent drafts spec</text>
<text class="dg-on-accent" x="240" y="150" font-size="13" text-anchor="middle">confidence per column</text>
<line class="dg-line" x1="240" y1="162" x2="240" y2="186" marker-end="url(#arrow-pipes)"/>
<rect class="dg-ok" x="60" y="188" width="360" height="40" rx="8"/>
<text class="dg-on-accent" x="240" y="213" font-size="14" text-anchor="middle">1 · Mapping review, lowest confidence first</text>
<rect class="dg-ok" x="60" y="236" width="360" height="40" rx="8"/>
<text class="dg-on-accent" x="240" y="261" font-size="14" text-anchor="middle">2 · Before / after preview</text>
<rect class="dg-ok" x="60" y="284" width="360" height="40" rx="8"/>
<text class="dg-on-accent" x="240" y="309" font-size="14" text-anchor="middle">3 · Trial run: fix in spec or in data?</text>
<rect class="dg-ok" x="60" y="332" width="360" height="40" rx="8"/>
<text class="dg-on-accent" x="240" y="357" font-size="14" text-anchor="middle">4 · Human approves → spec goes live</text>
<path class="dg-line" d="M60,308 C10,308 10,134 116,134" marker-end="url(#arrow-pipes)"/>
<text class="dg-muted" x="46" y="226" font-size="12" text-anchor="middle" transform="rotate(-90 46 226)">new version</text>
<text class="dg-muted" x="240" y="400" font-size="13" text-anchor="middle">The agent can draft and revise.</text>
<text class="dg-muted" x="240" y="420" font-size="13" text-anchor="middle">It can never approve or activate.</text>
</svg>
<figcaption>Propose, review, approve. Every fix found in a trial run becomes a new spec version, not a hand patch.</figcaption>
</figure>

The guardrails mattered more than the model:

- **Never guess under the threshold.** Below a confidence of 0.5, the agent leaves the column unmapped and asks a question. A wrong silent mapping costs far more than a blank one.
- **The schema forbids self-approval.** Going from draft to approved needs a named human.
- **Invalid output is regenerated, never hand-repaired.** If the draft doesn't validate against the schema, it never reaches the screen.
- **Agent transforms come from an allowed list of functions.** Free-form SQL needs a human author.

On the runtime side we went with "load first, transform later": files land raw, with their file name and row number attached, and every transform is versioned SQL inside our database. Bad rows land in a queryable table instead of a log. That makes the fix loop cheap. In the prototype, one date-parsing fix took a trial run from 2,432 rejected rows to 1,452 at spec version 4, with no re-fetch, just a re-run. Another time the agent noticed the filename suffix encoded the sales channel, and channel mapping jumped from 40% to 97%.

> Make the agent draft. Make the human decide. Make the difference between the two a file you can diff.

## The question that actually stalls onboarding

The hardest onboarding problem isn't a bad row. It's this: *the sales file references products that aren't in the product master. Why?*

Row-level checks tell you *that*. They never tell you *why*, and the why decides who has to act. So we made cross-file reconciliation its own layer, with the agent sorting every mismatch into one of four root causes using simple statistical signatures.

<figure class="diagram">
<svg viewBox="0 0 480 400" role="img" aria-labelledby="t-pipes-2">
<title id="t-pipes-2">Four root causes for keys that don't match across files</title>
<defs><marker id="arrow-pipes-2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<rect class="dg-warn" x="110" y="16" width="260" height="52" rx="10"/>
<text class="dg-on-accent" x="240" y="40" font-size="15" text-anchor="middle">Sales keys missing</text>
<text class="dg-on-accent" x="240" y="58" font-size="13" text-anchor="middle">from the master file</text>
<line class="dg-line" x1="240" y1="68" x2="240" y2="88"/>
<line class="dg-line" x1="60" y1="88" x2="420" y2="88"/>
<line class="dg-line" x1="60" y1="88" x2="60" y2="108" marker-end="url(#arrow-pipes-2)"/>
<line class="dg-line" x1="180" y1="88" x2="180" y2="108" marker-end="url(#arrow-pipes-2)"/>
<line class="dg-line" x1="300" y1="88" x2="300" y2="108" marker-end="url(#arrow-pipes-2)"/>
<line class="dg-line" x1="420" y1="88" x2="420" y2="108" marker-end="url(#arrow-pipes-2)"/>
<rect class="dg-box" x="6" y="110" width="108" height="150" rx="8"/>
<text class="dg-text" x="60" y="134" font-size="14" text-anchor="middle">Filtered</text>
<text class="dg-text" x="60" y="152" font-size="14" text-anchor="middle">master</text>
<text class="dg-muted" x="60" y="182" font-size="12" text-anchor="middle">spread evenly</text>
<text class="dg-muted" x="60" y="198" font-size="12" text-anchor="middle">over time,</text>
<text class="dg-muted" x="60" y="214" font-size="12" text-anchor="middle">shared pattern</text>
<rect class="dg-box" x="126" y="110" width="108" height="150" rx="8"/>
<text class="dg-text" x="180" y="134" font-size="14" text-anchor="middle">Lagging</text>
<text class="dg-text" x="180" y="152" font-size="14" text-anchor="middle">master</text>
<text class="dg-muted" x="180" y="182" font-size="12" text-anchor="middle">bunched in</text>
<text class="dg-muted" x="180" y="198" font-size="12" text-anchor="middle">recent dates</text>
<text class="dg-muted" x="180" y="214" font-size="12" text-anchor="middle">(new launches)</text>
<rect class="dg-box" x="246" y="110" width="108" height="150" rx="8"/>
<text class="dg-text" x="300" y="134" font-size="14" text-anchor="middle">Key</text>
<text class="dg-text" x="300" y="152" font-size="14" text-anchor="middle">transform</text>
<text class="dg-muted" x="300" y="182" font-size="12" text-anchor="middle">match after</text>
<text class="dg-muted" x="300" y="198" font-size="12" text-anchor="middle">zeros, case</text>
<text class="dg-muted" x="300" y="214" font-size="12" text-anchor="middle">or prefix fix</text>
<rect class="dg-box" x="366" y="110" width="108" height="150" rx="8"/>
<text class="dg-text" x="420" y="134" font-size="14" text-anchor="middle">Missing</text>
<text class="dg-text" x="420" y="152" font-size="14" text-anchor="middle">data</text>
<text class="dg-muted" x="420" y="182" font-size="12" text-anchor="middle">none of the</text>
<text class="dg-muted" x="420" y="198" font-size="12" text-anchor="middle">above</text>
<rect class="dg-box" x="6" y="280" width="108" height="56" rx="8"/>
<text class="dg-text" x="60" y="304" font-size="13" text-anchor="middle">Flag to</text>
<text class="dg-text" x="60" y="322" font-size="13" text-anchor="middle">customer</text>
<rect class="dg-box" x="126" y="280" width="108" height="56" rx="8"/>
<text class="dg-text" x="180" y="304" font-size="13" text-anchor="middle">Fix load</text>
<text class="dg-text" x="180" y="322" font-size="13" text-anchor="middle">order</text>
<rect class="dg-accent" x="246" y="280" width="108" height="56" rx="8"/>
<text class="dg-on-accent" x="300" y="304" font-size="13" text-anchor="middle">Fix in spec</text>
<text class="dg-on-accent" x="300" y="322" font-size="13" text-anchor="middle">(our side)</text>
<rect class="dg-box" x="366" y="280" width="108" height="56" rx="8"/>
<text class="dg-text" x="420" y="304" font-size="13" text-anchor="middle">Flag to</text>
<text class="dg-text" x="420" y="322" font-size="13" text-anchor="middle">customer</text>
<line class="dg-line" x1="60" y1="260" x2="60" y2="278" marker-end="url(#arrow-pipes-2)"/>
<line class="dg-line" x1="180" y1="260" x2="180" y2="278" marker-end="url(#arrow-pipes-2)"/>
<line class="dg-line" x1="300" y1="260" x2="300" y2="278" marker-end="url(#arrow-pipes-2)"/>
<line class="dg-line" x1="420" y1="260" x2="420" y2="278" marker-end="url(#arrow-pipes-2)"/>
<text class="dg-muted" x="240" y="372" font-size="13" text-anchor="middle">The agent proposes a cause with evidence;</text>
<text class="dg-muted" x="240" y="390" font-size="13" text-anchor="middle">a human confirms it by taking the action.</text>
</svg>
<figcaption>The diagnosis decides who acts: us, through a new spec version, or the customer, through their data.</figcaption>
</figure>

Two choices kept this honest. The checks are **derived** from the references declared in our target contracts, so nobody authors them. And we **don't block loads** by default: one late master file shouldn't stop every transaction from landing. Consistency is measured, diagnosed and routed as work.

## We kept one canvas

After all that, I was asked whether we still needed a canvas. Yes, one, but **derived, never drawn**. Data teams love lineage graphs generated from metadata and quietly abandon hand-drawn diagrams, because the hand-drawn ones go stale the week after go-live.

So our systems view is built from real objects: a node is a configured system, an edge is a feed. Drawing an edge creates a feed in a *planned* state, which becomes the onboarding to-do list. After go-live the same map shows feed health. And the agent can draft it: paste the customer IT team's email ("the ERP sends five files nightly over SFTP…") and it proposes the systems and planned feeds for review.

## What it cost

- **Less flexibility.** Anything that isn't a mapping (combining feeds, aggregation) lives in versioned SQL stages that engineers own. Customers review; they don't build.
- **The agent's quality is now the product.** If confidence scores aren't calibrated, the "lowest confidence first" review order is a lie. We tie every score to evidence (header match, value overlap with an approved master, a glossary hit), but that needs ongoing work.
- **Some questions stayed open,** like exactly which functions belong on the allowed list.
- **We chose "our onboarding engineer drives, the customer reviews"** for now. Self-serve is later.

## What I'd tell another team

- **Find the real bottleneck before you design the tool.** Ours was meaning, not topology.
- **If your targets are fixed, your artifact should be declarative.** Specs beat graphs for review, diff and agent drafting.
- **Give the agent a "don't know" option** and a threshold below which it must use it.
- **Diagnose, don't just detect.** "Why" and "who acts" is what unblocks people.
- **Derive your diagrams.** A canvas built from real objects can't drift from reality.

Same pattern, different layer: in the next product story, AI suggestions had to [fight for space in a dense grid](/blog/every-ai-widget-costs-rows).
