---
title: "“Don't Lead With AI”: Positioning a Platform When Every Vendor Is AI-Native"
date: 2026-06-22
description: "Why our vision doc calls the platform AI-enabled, not AI-native, and how a public analyst report backed the call."
tags: [product, strategy, positioning, ai]
series: Building a Planning Platform in the Age of Agents
seriesOrder: 4
---

My first draft of our platform's vision document opened with "AI-native planning". It felt right. We were building agents into every surface, and every competitor deck I'd read that year led with the same two words. Then I got a correction I've repeated to myself many times since: *everyone is doing AI. If AI is our identity, we have the same identity as everyone else.* This post is about what we put in its place, and why I now think "don't lead with AI" is the right default for most AI products in 2026.

## The problem: a vision doc nobody could argue with

The task was a board-level vision and strategy document. It sits above our architecture overview (the *what*) and our roadmap (the *when*). Its job is the *why*, and the bet.

I built it by walking a well-known seven-step product strategy framework (objectives, users, superpowers, vision, pillars, impact, roadmap) against the transcript of a long founder vision session and the prototype we already had. That gave the doc a spine. It didn't give it a position.

"AI-native planning platform" was the easy position because it was unfalsifiable. Nobody in a board meeting argues against AI. But a position nobody can argue with also can't help anyone choose you.

## What we considered

There were really three identities on the table.

1. **"AI-native planning."** Modern, matches the market's language, and gives no reason to pick us over any other vendor saying it.
2. **"A fashion merchandising tool, now with AI."** Honest about our roots, but it caps both our win rate and our market. Our product was shaped around one vertical.
3. **"A configurable, AI-enabled retail planning platform that works without AI."** AI as the accelerant and the "wow", not the headline.

What pushed me to option 3 was a line I ended up writing into the doc: *AI made two things true at once. Anyone can copy a tool, and no one can sustain one.* Security, governance, support and speed don't come free with a model. That raises the bar from "tool" to "platform", and it means the defensible thing is not the AI. It's what the AI sits on top of.

For us that was two things:

- **Years of expertise**, encoded as a library of mathematically optimised planning blocks. Hard to hire, hard to copy.
- **Counter-positioning.** Weeks instead of years, configurable without engineering, against incumbents whose services-heavy model they can't cheaply walk away from.

<figure class="diagram">
<svg viewBox="0 0 480 380" role="img" aria-labelledby="t-lead-1">
<title id="t-lead-1">The positioning ladder: expertise, then platform, then AI</title>
<defs><marker id="arrow-lead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<text class="dg-muted" x="240" y="24" font-size="13" text-anchor="middle">What holds the position up</text>
<rect class="dg-accent" x="60" y="40" width="300" height="64" rx="10"/>
<text class="dg-on-accent" x="210" y="68" font-size="16" text-anchor="middle">AI: the accelerant</text>
<text class="dg-on-accent" x="210" y="90" font-size="13" text-anchor="middle">no learning curve, build your own agents</text>
<rect class="dg-box" x="60" y="124" width="300" height="64" rx="10"/>
<text class="dg-text" x="210" y="152" font-size="16" text-anchor="middle">Platform: the shift</text>
<text class="dg-muted" x="210" y="174" font-size="13" text-anchor="middle">configure your workflow, no engineering</text>
<rect class="dg-ok" x="60" y="208" width="300" height="64" rx="10"/>
<text class="dg-on-accent" x="210" y="236" font-size="16" text-anchor="middle">Expertise: the moat</text>
<text class="dg-on-accent" x="210" y="258" font-size="13" text-anchor="middle">optimised planning-block library</text>
<line class="dg-line" x1="400" y1="264" x2="400" y2="50" marker-end="url(#arrow-lead)"/>
<text class="dg-muted" x="420" y="150" font-size="13" text-anchor="middle" transform="rotate(-90 420 150)">builds on</text>
<text class="dg-text" x="60" y="306" font-size="14">Remove the top rung: still a product.</text>
<text class="dg-text" x="60" y="328" font-size="14">Remove the bottom rung: nothing to sell.</text>
<text class="dg-muted" x="60" y="360" font-size="13">Framework self-score: 3.8 → 4.4 out of 5</text>
</svg>
<figcaption>AI sits at the top of the ladder, not the bottom. The test of a position: take AI away and see what is still standing.</figcaption>
</figure>

## Checking the bet against the market

A vision doc full of my own conviction is still just my conviction, so I went looking for outside evidence. Gartner's 2026 Magic Quadrant for supply chain planning (process industries) turned out to be useful in a specific way.

A caveat first, because it matters: that report covers an **adjacent** market, and we are not rated in it. I used it for trend validation and as a market-size anchor, never as a claim of leadership.

With that said, three things lined up:

- **The market is growing**, from about $8.4B in 2025 to a forecast $15.1B by 2029, roughly 15% a year. The report describes the winning move as new entrants using AI to attack incumbent gaps *with rapid ROI*.
- **The most common caution on the big vendors is platform complexity**, with pricing close behind. That is exactly the counter-position: weeks not years, configurable, transparent pricing.
- **Agents are everywhere in the report.** Every vendor is adding agents and GenAI. That told me AI is table-stakes direction, not a moat. It reinforced the decision not to lead with it.

I turned this into one battle card per competitor, each with three lines: *their edge* (where not to fight), *our opening*, and *how we win*. The discipline of writing "don't fight here" for each vendor was useful on its own. For the strongest platform vendor, for example, the honest card says: don't try to out-"brain" them; win on speed, cost and depth of retail expertise.

> If you remove the AI and the product falls over, you don't have a position. You have a feature.

## The call (and why)

The doc ended up saying our platform is **configurable and AI-enabled**, and that it **stands without AI**. In practice that meant:

- **AI is woven through the bets, not given its own pillar.** The three bets are closing our competitive backlog (scenarios, hierarchies, connected modules), platformisation (studios for algorithms, workflows and workbooks, with AI as the wow layer), and demand forecasting as a first-class capability.
- **Two explicit "no"s.** No services-heavy, multi-year implementations. And no "prove the numbers" proof-of-concept as our lead sales motion; we lead with *replicate your workflow* instead.
- **A demo rule.** Show the workflow and the configurability, not the output numbers.

Then I graded the doc against the framework I'd used to build it: about **3.8 out of 5**. The structure was there, but every quantitative claim was a placeholder. So I added a fillable impact model (qualified deals × win-rate change × contract value, market-size multiple, retention, onboarding effort) and rewrote each roadmap milestone as *problem → outcome* instead of *feature → date*. Re-graded, it reached about **4.4**. The gap that remained was honest: 25 numbers still waiting for finance.

## What it cost

Not leading with AI has a price. In a market where every keynote opens with agents, a pitch that opens with "configure your own workflow" can look less exciting, and some buyers will read "AI-enabled" as "behind". We accepted that.

The second cost is internal. "AI is the accelerant" is a harder sentence to rally a team around than "we are an AI company". You have to keep explaining that it's not a demotion. AI still shows up everywhere in the product; it just doesn't carry the identity on its own.

And a self-score of 4.4 is not a validation. A structurally complete doc with blank numbers is still a doc with blank numbers.

## What I'd tell another team

- **Run the removal test.** Take AI out of your positioning sentence. If nothing defensible is left, fix that before you fix the copy.
- **Name the moat in plain words.** Ours was "years of expertise, encoded as blocks". If you can't say yours in five words, it isn't one yet.
- **Use analyst reports for direction, and say what they don't cover.** Being honest about scope makes the evidence stronger, not weaker.
- **Write "don't fight here" for every competitor.** Knowing where you lose sharpens where you win.
- **Grade your own strategy doc.** A rubric score with placeholders in it tells you exactly what is still missing.

The positioning held up a few weeks later when we [stopped drawing pipelines](/blog/stop-drawing-pipelines) and let an agent do the drafting instead. AI did the work there too. It just wasn't the headline.
