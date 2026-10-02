---
name: Return-on-Attention (ROA) Prioritization
tagline: One lens to align focus across teams
category: Frameworks & Processes
impact: Urgent-critical asks → 0 per sprint
icon: target
order: 4
tags: [Prioritization, Roadmap, Alignment]
---

**Return on Attention (ROA)** is an operating system for prioritization that I built and still run at Increff — across six products, four PMs, and a hundred-plus enterprise customers. Its core claim is simple: the scarce resource in a product organization is not engineering hours or money. It's **attention** — leadership attention, department-head attention, PM attention. ROA is a system for deciding where that attention gets deployed, so that spending it *once, upstream* keeps paying out for months, instead of being re-spent in a crisis meeting every two weeks.

> The origin story — why RICE, MoSCoW, and friends kept failing me, and how this emerged from first principles — is in the essay [The Day I Stopped Prioritizing Features](/blog/return-on-attention). This page is the reference manual: what the framework is and how it works.

## The problem it solves

Every function sends requests, every request arrives with data proving it should go first, and demand has no ceiling while capacity very much does. A typical Monday looked like this:

| Who | The ask | Their justification | Urgency claimed |
|---|---|---|---|
| Sales | "Excel export, but it must open in the client's Excel 2007" | ₹2 Cr deal "depends on it" | 🔥🔥🔥 |
| Success | Custom dashboard for one account | "They mentioned churn on a call" | 🔥🔥🔥 |
| Onboarding | Bulk-upload validation | Cuts implementation by 2 weeks | 🔥🔥 |
| Engineering | "Let us delete the old service" | It wakes someone up at 3 a.m. weekly | 🔥 (they're too polite) |
| Founder | Strategic AI bet | The future of the company | 🔥🔥🔥🔥 |
| A customer, directly | A button. Just one button. | Contract renewal in 6 weeks | 🔥🔥🔥 |

Every one of these is *legitimate*. None of them are comparable. Scoring them on one sheet is how you end up asking a formula whether an apple beats a satellite.

And the standard fix — adopting yet another prioritization framework — has a well-documented failure mode:

![xkcd 927: Standards](https://imgs.xkcd.com/comics/standards.png)

*Replace "standards" with "prioritization frameworks" and this is a documentary. ([xkcd #927](https://xkcd.com/927/), CC BY-NC 2.5)*

## What ROA actually is

Not a scoring formula. It's four operating rules that move the expensive negotiation *upstream* and spread it *over time*:

### 1. Every department head owns one living, ranked list

Sales owns the Sales list. Success owns Success. Onboarding, Engineering — same. Each list is ranked by impact *for that function*, and re-ranking is a habit built into sprint prep, not a calendar event. A lost deal or a competitor launch shows up in the ranking the next time that leader sits down to plan.

The important trick: **I never argue with the inside of someone else's list.** Sales knows sales. The negotiation happens one level up — how much bandwidth each list gets.

### 2. Theme and bandwidth are set on a rolling three-sprint window

Instead of negotiating capacity fresh every sprint (a political knife-fight with a two-week timer), we allocate across the next three sprints at once — heavier commitment to the nearest sprint, lighter to the two after. Each planning session starts from what's already committed and just fills the gaps.

| | Sprint N | Sprint N+1 | Sprint N+2 |
|---|---|---|---|
| Committed when we sit down | ~80% | ~50% | ~20% |
| Negotiated in this session | ~20% | ~30% | ~30% |
| Temperature of the room | ☕ calm | ☕ calm | 🤷 "future us" problem |

Nobody negotiates under time pressure anymore. The negotiation didn't disappear — it just stopped being an ambush.

### 3. Contention is designed out, not process-ed out

Most engineers map to a single product, so "two departments need the same specialist this sprint" — the scenario that looks terrifying on paper — almost never occurs. When it does (usually shared platform components), it's resolved explicitly at theme-setting. Escalation chain: theme-setting → me → founders, anchored to company vision. Two hops, on purpose.

### 4. Selection is mechanical; the long tail is a named judgment call

Engineering sizes work against the agreed bandwidth, and each bucket fills from the top of the owning department's list. No re-litigation. The honest limitation: a genuinely niche item that never collides with anyone else's list can sit at the bottom indefinitely. We handle that with department-head judgment, not an automatic safeguard — a real trade-off I'd rather name than hide.

## Is it worth the attention?

The reason "spend attention once, upstream" works is the same math as automating a repeated task — you're amortizing a fixed cost across every sprint that no longer needs a crisis meeting:

![xkcd 1205: Is It Worth the Time?](https://imgs.xkcd.com/comics/is_it_worth_the_time.png)

*Swap "time saved" for "attention saved" and the table still works. A weekly 90-minute fire-drill, eliminated, buys you ~10 working days a year — per fire-drill. ([xkcd #1205](https://xkcd.com/1205/), CC BY-NC 2.5)*

A worked example of the lens itself. The question is never "is this valuable?" — it's "what does this pay back on the attention it consumes, and how often will we have to pay attention to it *again*?"

| Ask | Attention cost | Return profile | ROA verdict |
|---|---|---|---|
| One-off custom dashboard for one account | High (design reviews, edge cases, forever-maintenance) | Pays out once, for one client | Defer; solve via config/services |
| Bulk-upload validation for onboarding | Medium, once | Pays out on *every* future implementation | Top of the theme |
| "Rewrite it in Rust" | Enormous | Emotional; recurring | Lovingly declined |
| Deleting the 3 a.m.-pager service | Medium, once | Returns engineer sleep, forever | Funded — sleep compounds |
| Excel-2007-compatible export | Low | Pays out exactly once, in six weeks | Scheduled, calmly, in Sprint N+1 — no fire required |

## The results (same org, before vs. after)

| Metric | Before ROA | After ROA |
|---|---|---|
| "Urgent-critical" roadmap resets | 3–4 per sprint | **0** per sprint |
| Where prioritization conflict happened | Every sprint boundary, under deadline | Rolling theme-setting, spread across the quarter |
| Who could answer "why are we building this?" | Me, on a good day | Any pod, because the "why" was settled upstream |
| Escalations needed | Constant, ad-hoc | Rare; two-hop chain when needed |
| Scope it runs at | — | 6 products, 4 PMs, 100+ enterprise accounts |

The urgent asks didn't stop arriving — customers still have emergencies. What changed is that most of what used to arrive as a *fire* already had a home in someone's ranked list. It needed a bandwidth slot, not a crisis meeting.

## What ROA is not

- **Not a scoring formula.** There's no ROA number to compute. If you're multiplying columns in a spreadsheet, you're doing the other thing.
- **Not a promise that the long tail gets served.** It makes the tail a *conscious trade-off* instead of an accident (see rule 4).
- **Not portable as-is.** It fits Increff's shape: multi-product, B2B, engineers mapped to products. Steal the reasoning — attention is the constraint; negotiate upstream, on a rolling window — and rebuild the mechanics for your own org. That loop is the transferable part.

*Full narrative version, including everything that broke before this worked: [The Day I Stopped Prioritizing Features](/blog/return-on-attention).*
