---
title: "The Day I Stopped Prioritizing Features"
date: 2025-12-14
description: "Why every prioritization framework kept failing me across six products — and how treating attention, not engineering hours, as the scarce resource became Return on Attention."
tags: [prioritization, roadmap, leadership]
---

A few years ago, I was leading a team of four PMs across six products at Increff — a B2B retail-tech SaaS company serving over a hundred enterprise customers. My backlog looked like every PM's nightmare.

Sales wanted features to close deals. Customer Success wanted features to retain accounts. Onboarding wanted features to cut implementation time. Engineering wanted architectural cleanup. Founders had strategic bets they wanted placed. Customers had urgent, contract-threatening asks. And every single request came with data attached, proving why it deserved to go first.

I did what most PMs do. I went looking for a better prioritization framework.

RICE. MoSCoW. Value vs. Effort. Opportunity scoring. I tried variations of all of them.

They worked — for about a sprint. Then they quietly stopped working, and I couldn't immediately tell why.

It took me a while to see it clearly: I wasn't struggling to prioritize. I was struggling to *compare*. I was putting apples, oranges, and satellites on the same scoring sheet and asking a formula to tell me which one mattered more. No framework fixes a comparison problem — it just hides it behind a number.

## The Real Shape of the Problem

I stopped trying to score features and started trying to understand the *shape* of the chaos instead. I looked at it through three lenses — Company, People, and Tech — and in each one, there was an external face and an internal face.

**Company.** Externally: every one of our hundred-plus customers was a company at a different stage of life. Some scaling fast. Some cutting costs. Some just funded and eager to experiment. Some mature and optimizing for stability. The same feature could be mission-critical for one and irrelevant for another. Internally: we ran six products, each at a different point in its own life — some 0-to-1, some 1-to-10, some 10-to-100 — each with a different pace, a different relationship with its founders, a different definition of success.

**People.** Externally: the old B2B line is "the buyer isn't the user." I'd go further — there isn't even *one* user. A single enterprise account has operations teams, finance, warehouse managers, analytics teams, and leadership, all touching the same product for completely different reasons. Internally: requests came from Sales, Success, Onboarding, Product, Legal, DevOps — every function pursuing a goal that was completely legitimate on its own terms.

**Tech.** Externally: a customer asking for "a feature" might really be migrating to a new ERP, or need a different payload shape, or care about retry logic, or latency, or compliance — five different problems wearing the same request. Internally: our own six products ran on different architectures, some OLTP-heavy, some OLAP, each with its own tech leads and its own idea of "the right way to build."

Once I laid that grid out, the real insight arrived: **the scarce resource in this system was never engineering hours or money. It was attention** — leadership attention, department-head attention, my own attention as the person supposedly holding the whole map in my head. Every framework I'd tried was trying to optimize *feature selection*. None of them touched the actual bottleneck, which was *where human attention got spent, and how often it had to be spent again*.

## Where This Came From

I want to be precise about the origin of this, because it matters for how much weight to give it.

I'd taken Shreyas Doshi's course and learned his LNO framework there — Leverage, Neutral, Overhead — a way of deciding how much effort a given task deserves. It shaped how I thought about my own time. But LNO is about an individual's effort allocation. It doesn't tell you how a department head's list should relate to a founder's vision, or how six products at six different life stages should share one engineering org's attention.

I hadn't read Herbert Simon's work on the attention economy, or the academic literature on attention as an organizational resource, when I built this. I only found out about it later, after I'd already been running this system for months and started researching whether anyone had written about it formally. Turns out economists have been describing pieces of this idea since the 1970s. That was a genuinely interesting discovery, but it's not where this came from — I found the research after the framework, not before it.

This came from first principles, under pressure, with four PMs and me trying to make sense of a demand curve that had no ceiling and a bandwidth curve that very much did. **Unlimited demand. Limited capacity.** Every conventional framework I threw at that mismatch dissolved into arguments about whose request mattered more. None of them addressed the actual constraint.

## The Question That Changed Everything

Once the shape of the problem was clear, we stopped asking:

*"Which feature should we build next?"*

And started asking:

*"How do we build a system that consistently makes good prioritization decisions — without me, or any single PM, being the bottleneck?"*

That single reframe is what became **Return on Attention**: not a scoring model for features, but a model for deciding where the organization's scarcest resource — attention — gets deployed, so that spending it once pays out for a long time afterward, instead of needing to be spent again every sprint.

## The System, Mechanically

Here's what we actually built. It has four moving parts, and each one earned its place the hard way — by breaking first, then getting fixed.

**Every department head owns one prioritized list, and it's never static.** Sales owns the Sales list. Success owns the Success list. Onboarding owns its own. Engineering owns its own. Each list is ranked by what creates the highest impact for that function. Critically, these lists aren't set once and left alone — department heads re-rank them continuously, and re-ranking happens as a natural side effect of preparing for the next sprint, not on some separate calendar reminder. If a deal falls through, a competitor launches something, or the market shifts mid-quarter, that shows up the next time a department head sits down to plan — because re-ranking isn't an event, it's a habit built into how they already operate.

**Theme-setting happens across a rolling window, not in one high-stakes meeting.** This is the part I didn't get right in earlier versions of this system, and it's the part that made the biggest difference once we fixed it. Instead of negotiating bandwidth fresh every single sprint — which turns into exactly the kind of political scramble you'd expect when everyone shows up wanting their fair share right now — we plan theme and bandwidth across the next three sprints at once. We might commit some capacity to next sprint and a smaller slice to the sprint after that, and the one after that. Each time we sit down again, we're not starting from zero — we already know what's been committed, and we're just filling in what's left. Spreading the negotiation across the quarter instead of concentrating it at each sprint boundary took most of the heat out of the room. It's not that the negotiation disappeared. It's that nobody's negotiating under time pressure anymore.

**Cross-functional resource contention mostly doesn't happen — by design, not by process.** Early critiques of this system rightly asked: what happens when two department heads' top priorities both need the same specialized engineer this sprint? Our answer turned out to be structural rather than procedural — most engineers are mapped to a single product, so the kind of contention that looks scary on paper almost never shows up in practice. When it does — usually around shared platform components that serve more than one product — we resolve it explicitly during theme-setting, and if a team's bandwidth is being spent on something that benefits every product, we say so out loud and push them to build it that way deliberately, not by accident. Disagreements that can't get resolved there come to me as the product head. If I can't resolve it, it goes to the founders, anchored in company vision. That's the actual chain, and it's short on purpose.

**Selection is mechanical, but the tail is a judgment call, not a guarantee.** Engineering does t-shirt sizing or story-pointing against the agreed bandwidth, and the team fills each bucket from the top of the relevant department's list. Most of the time, that's the whole story. But I want to be honest about the one place this system doesn't fully solve the problem it was built for: long-tail and edge-case items. What sits at the bottom of Engineering's list sometimes sits at the top of Sales' list, and we do catch that — but we catch it because it happens to surface during theme-setting, when two lists visibly disagree about something. A genuinely niche item that never collides with anything on anyone else's list can sit near the bottom indefinitely. We handle this today through department-head judgment, not through an automatic safeguard. That's a real limitation, and I'd rather say so than pretend the system quietly solves the exact problem it was named after.

## Why I Didn't Just Pick One Off the Shelf

I want to pause on something before I get to results, because I think it's the more useful takeaway than the framework itself.

There is no shortage of product frameworks in the world. Search for "prioritization framework" and you'll get RICE, MoSCoW, Kano, Opportunity Scoring, Weighted Scoring, ICE, and a dozen others, each with a slide deck and a case study from a company that isn't yours. Every one of them is well-reasoned. Every one of them has genuinely worked — for the team, the domain, and the specific pressures that existed when it was built. None of that means it will work for you.

That's the trap I want to name plainly: treating a framework's popularity, or its logo-studded case-study list, as evidence it will transfer into your context. A framework isn't a law of physics. It's someone else's answer to their own specific mix of company stage, team maturity, market structure, and org politics. RICE assumes you can meaningfully estimate reach and confidence — that's a real assumption, not a neutral default. MoSCoW assumes your stakeholders can agree on what "must" means — also not neutral. These frameworks aren't wrong. They're *someone else's fit*.

I tried several of them here, honestly, before building this. They didn't fail because they were bad frameworks. They failed because Increff's specific shape — six products at wildly different maturity stages, a hundred-plus B2B accounts each with their own internal politics, engineering teams split across OLTP and OLAP paradigms — wasn't the shape any of those frameworks were built to fit. My team, my company's stage, my engineering setup, my specific blend of art and politics and architecture, were different from whatever context produced those frameworks. So I stopped trying to make my problem fit someone else's answer, and started building something for the actual shape of what I had.

That's the real instruction I'd give anyone reading this, more than the mechanics of Return on Attention itself: read the frameworks, learn from them, take what's genuinely useful — but don't adopt one wholesale out of fear that you need "a real framework" to be legitimate. You are not in the same company, with the same team, the same stage, the same politics, or the same technical debt as whoever wrote the framework you're reading about. Build your own operating method for your own context. Run it. Take feedback. Break it on purpose by asking people to attack it. Improve it. Run it again. That loop — not the specific mechanism — is the actual transferable skill.

## What Changed at Increff

This wasn't a thought experiment. It ran, and it's still running, across six products and a hundred-plus customers.

The clearest signal: the volume of ad-hoc, "drop everything" critical requests dropped sharply. Not because customers stopped having urgent needs — they still do — but because most of what used to arrive as a fire actually had a home in someone's prioritized list already. It just needed a theme and a bandwidth slot, not a crisis meeting.

The second, quieter shift mattered more to me. Teams across different pods and products now know which direction we're moving in — and *why* — because the "why" was settled upstream, by the leaders who own those goals, in a negotiation spread calmly across the quarter instead of relitigated under pressure every two weeks.

## The One Lesson

I've come to believe prioritization was never the real skill I needed. Alignment was — and alignment that holds up under pressure needs its negotiation spread out in time, not concentrated at the one moment everyone's watching the clock.

When company goals, product goals, departmental goals, and engineering capacity all point in the same direction *before* a feature ever gets discussed, the backlog effectively prioritizes itself. The scoring model you use to pick between two aligned features barely matters. The system that gets you to alignment in the first place is the whole game — and the timing of when that alignment gets negotiated matters almost as much as the alignment itself.

So if you're leading product at any real scale and you feel like you're drowning in incompatible, well-justified, urgent requests — my honest suggestion is: stop looking for a better prioritization framework. Ask where your organization's attention is actually being spent, whether it's being spent once, upstream, in a way that keeps paying out, and whether that negotiation is happening calmly ahead of time or frantically under a deadline.

That's Return on Attention. Not a framework for ranking features. A model for where judgment gets deployed, and when — so that features stop needing to be fought over at all, and the long tail becomes a conscious trade-off instead of an accident.

And to be clear — I'm not asking you to adopt Return on Attention either, at least not as-is. I'm asking you to do what building it forced me to do: look honestly at your own company, your own team, your own stage, your own politics, and your own technical constraints, and build something that fits *that* — not a framework that fit someone else's. Mine will keep changing as Increff changes. Yours should too.

---

*The operating mechanics of the framework — lists, theme-setting, the escalation chain — are also summarized in [my work section](/projects/roa-prioritization).*

*If you're running into a version of this in your own org, I'd genuinely like to hear how you're solving it — reach out on [LinkedIn](https://www.linkedin.com/in/alafazam).*
