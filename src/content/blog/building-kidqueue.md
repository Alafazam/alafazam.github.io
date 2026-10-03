---
draft: true
title: "Building KidQueue: safety by curation, not moderation"
date: 2026-05-17
description: "Why I'm building a parent-first video app that replaces the recommendation algorithm with a hand-picked queue."
tags: [side-project, consumer, product-design]
---

The default video experience for kids optimizes for watch time. Autoplay chains one video into the next, recommendations chase engagement, and "kids mode" mostly means moderation — filtering the worst content out of an infinite feed rather than choosing what's actually in it.

As a parent, I want the opposite default. So I'm building **KidQueue**: a parent-first app where the library is intentional and hand-picked, and the algorithm is simply out of the loop.

## Safety by design, not by filter

The core idea is that curation beats moderation. Moderation asks "is this bad enough to block?" — an unwinnable game against an infinite catalog. Curation asks "is this good enough to include?" — a game a parent can actually win in ten minutes a week.

What it does:

- **Parents build and order a personal watchlist.** Exactly what their kids can watch, queued up in advance.
- **Kids get a simple, distraction-free player.** No thumbnails competing for a tap, no rabbit holes.
- **No recommendations, no autoplay.** When the queue ends, it ends — which is a feature, not a bug.

Building this as a side project has been a useful mirror for my day job: it's the same product argument I make in enterprise software — that defaults are the real product, and whoever controls the default controls the outcome. Here the default shifts from "the platform decides what plays next" to "the parent already decided."

Progress notes and the longer write-up are in [my work section](/projects/kidqueue). More on the build as it ships.
