---
title: "Graft, Don't Pick: Scoring Two Dashboard Designs on an AI-Native Rubric"
date: 2026-06-17
description: "Two home-page designs, each strong on the opposite half of a 10-point rubric. Why we grafted them instead of choosing a winner."
tags: [product, design, ai, ux]
series: Building a Planning Platform in the Age of Agents
seriesOrder: 3
---

In June someone shared a screenshot of an outside prototype dashboard, and it landed well with everyone who saw it. Warm coral palette, calm spacing, a friendly greeting, a little "ask me" pill. Our own home pages were blue, busier, and full of AI detail. The obvious question in the room was "should we just switch to that look?" I didn't want to answer it on taste, so I built the coral design inside our planning platform, put it next to ours, and scored both. The answer turned out to be neither.

## The problem with "which one looks better?"

Dashboard debates go badly because everyone is judging a different thing. One person loves the colours. Another notices the numbers look fake. A third likes that there's less on screen, without asking what went missing.

So I tried to remove two sources of noise before anyone voted.

First, **same shell, same data**. The coral version reused our existing top bar, sidebar and charting, and only replaced the body of the page. Its "Review" and "Approve" buttons were real links into the same review screens the blue pages used. Nothing was a static picture.

Second, **two data populations through one design**. I ran the coral look with two personas: one fed with demo data that copied the screenshot closely, and one fed with numbers from a live-looking plan. If a design only looks good with hand-picked numbers, you find out fast.

That gave us six home pages to compare: the blue ones we already had, plus the coral variants.

## What we considered

There were three honest options:

1. **Pick the coral design.** It was clearly the better-crafted page.
2. **Keep the blue design.** It carried a lot of hard-won AI detail.
3. **Graft.** Take one as the base and move the best parts of the other onto it.

To choose, I wrote a rubric. Ten dimensions, each scored out of 5, so 50 in total.

- **Six classic UX/UI dimensions**, the kind any design critique covers: visual hierarchy, density, clarity of the main action, and so on.
- **Four AI-native dimensions**, the ones that matter once software agents are doing part of the work:
  - **Agent legibility.** Can I tell which agent did what?
  - **Human in the loop.** Is it obvious what is waiting for *me* to decide?
  - **Trust and provenance.** Do I see how confident the system is, why, and where it came from?
  - **Conversational grounding.** Can I ask about the exact thing I'm looking at?

I captured full-page screenshots of every home page with a headless browser, scored each one, and put the scores in a colour-coded heatmap with a short scorecard per page. The rubric itself is reusable on any future dashboard.

## The scores split down the middle

The coral design averaged **41/50**. The blue design came in around **37/50**. A simple reading says "coral wins, switch."

The heatmap said something more useful. The two designs were strong on **opposite halves** of the rubric.

- Coral won on **craft**: hierarchy, calm density, and conversational grounding. You knew where to look first.
- Blue won on **AI-native depth**: a confidence percentage on each suggestion, a one-line "why", the name of the agent that produced it, and a "while you were away" summary of what ran overnight.

Picking coral would have thrown away the exact things that make an AI-run planning tool trustworthy. Picking blue would have kept a page people found tiring to read.

<figure class="diagram">
<svg viewBox="0 0 480 300" role="img" aria-labelledby="t-graft-1">
<title id="t-graft-1">Rubric totals: blue 37, coral 41, grafted 46 out of 50</title>
<text class="dg-muted" x="20" y="26" font-size="13">Rubric score out of 50</text>
<line class="dg-line" x1="110" y1="40" x2="110" y2="250"/>
<text class="dg-text" x="100" y="78" font-size="15" text-anchor="end">Blue</text>
<rect class="dg-ok" x="110" y="58" width="259" height="30" rx="4"/>
<text class="dg-on-accent" x="356" y="78" font-size="15" text-anchor="end">37</text>
<text class="dg-muted" x="110" y="106" font-size="13">wins AI depth: confidence, why, agent</text>
<text class="dg-text" x="100" y="148" font-size="15" text-anchor="end">Coral</text>
<rect class="dg-box" x="110" y="128" width="287" height="30" rx="4"/>
<text class="dg-text" x="384" y="148" font-size="15" text-anchor="end">41</text>
<text class="dg-muted" x="110" y="176" font-size="13">wins craft: hierarchy, calm, grounding</text>
<text class="dg-text" x="100" y="218" font-size="15" text-anchor="end">Graft</text>
<rect class="dg-accent" x="110" y="198" width="322" height="30" rx="4"/>
<text class="dg-on-accent" x="419" y="218" font-size="15" text-anchor="end">46</text>
<text class="dg-muted" x="110" y="246" font-size="13">coral shell + blue provenance</text>
<line class="dg-accent-line" x1="460" y1="44" x2="460" y2="232" stroke-dasharray="4 4"/>
<text class="dg-muted" x="460" y="270" font-size="13" text-anchor="middle">50</text>
<text class="dg-muted" x="20" y="290" font-size="12">Provenance 2→5, agent legibility 3→5, craft held at 5.</text>
</svg>
<figcaption>Each design was strong on the half of the rubric the other was weak on. The graft kept both halves.</figcaption>
</figure>

## The call: graft, don't pick

The recommendation was **the coral shell carrying the blue system's provenance**. Then I built it, because a recommendation that only exists in a slide is easy to agree with and easy to forget.

The grafts were small and specific:

- On every item waiting for approval: a **confidence pill**, a **one-line why**, and a **chip naming the source agent**.
- On every KPI in the watch list: the **agent that owns it**.
- A **"while you were away" card**: what ran, what cleared itself, and what needs you, with each agent's outcome tagged.

Re-scored, the grafted page came in at about **46/50**. Provenance went from 2 to 5 and agent legibility from 3 to 5, while hierarchy, craft and conversation stayed at 5. It became the template we carried forward.

One engineering choice made this cheap. Every graft was **additive and data-driven**: it renders only when the data carries the field (a `confidence`, a `why`, an `agent`). The other coral variants didn't change at all, and any of them could adopt provenance later by adding data, with no code change.

> A rubric doesn't pick the winner for you. It shows you which half of each option is worth keeping.

## The bug the rubric found

Scoring "trust" forced me to look at every coloured number on the page and ask "is this colour telling the truth?" One wasn't.

KPI changes were coloured by **arrow direction**: down was red, up was green. So "Stockout ▼" showed red, even though fewer stockouts is good news. For any metric where lower is better (stockouts, markdown, aged stock) the page was quietly telling planners the opposite of the truth.

<figure class="diagram">
<svg viewBox="0 0 480 210" role="img" aria-labelledby="t-graft-2">
<title id="t-graft-2">Colour by meaning, not by arrow direction</title>
<text class="dg-muted" x="120" y="24" font-size="13" text-anchor="middle">Before: colour = arrow</text>
<text class="dg-muted" x="360" y="24" font-size="13" text-anchor="middle">After: colour = good?</text>
<rect class="dg-box" x="20" y="40" width="200" height="110" rx="10"/>
<text class="dg-text" x="40" y="72" font-size="15">Stockout rate</text>
<rect class="dg-warn" x="40" y="88" width="120" height="34" rx="6"/>
<text class="dg-on-accent" x="100" y="111" font-size="15" text-anchor="middle">▼ falling</text>
<text class="dg-muted" x="40" y="140" font-size="13">down, so "bad"</text>
<rect class="dg-box" x="260" y="40" width="200" height="110" rx="10"/>
<text class="dg-text" x="280" y="72" font-size="15">Stockout rate</text>
<rect class="dg-ok" x="280" y="88" width="120" height="34" rx="6"/>
<text class="dg-on-accent" x="340" y="111" font-size="15" text-anchor="middle">▼ falling</text>
<text class="dg-muted" x="280" y="140" font-size="13">lower is better: good</text>
<text class="dg-muted" x="240" y="188" font-size="13" text-anchor="middle">Each KPI carries a good flag; arrow only as fallback</text>
</svg>
<figcaption>The same change, coloured two ways. Direction says what moved; only the metric knows whether that is good.</figcaption>
</figure>

The fix: each change now carries a `good` true/false flag and is coloured by that. When the flag is missing it falls back to direction, so nothing old broke. Because it lives in the shared renderer, every page using that component got the fix.

## The tradeoff we accepted

Grafting is not free. Provenance adds elements to every row, and the approval list got taller. To pay for it, I restructured each approval row into a compact layout: severity inline with the title, actions in a short row beneath, the "why" clamped to two lines. That roughly halved row height.

The other honest cost is the rubric itself. One person scored it, and a number like 46 suggests more precision than a judgement call deserves. I treat the scores as a structured argument, not a measurement. Their real value was the heatmap: it turned "I like this one" into "this one is weak on provenance", which is something a team can act on.

## What I'd tell another team

- **Build the challenger inside your real shell, with your real data.** A screenshot competes unfairly against a working product.
- **Add AI-native dimensions to your design critique.** Agent legibility, human in the loop, provenance and grounding are invisible to a classic UX review.
- **Look at the heatmap, not the total.** Two options with close totals often fail in completely different places.
- **Make grafts additive.** If new parts render only when the data supports them, you can move good ideas across designs without breaking anything.
- **Colour by meaning, never by direction.** "Down" is not a value judgement.

A week later the same question came back at a bigger scale: not "which dashboard?" but "how do we talk about AI at all?" That's [the next post](/blog/dont-lead-with-ai).
