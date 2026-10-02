---
title: "Feature flags are a product tool, not an engineering tool"
description: "The flag system is really a client-communication system wearing an engineering costume."
tags: [feature-flags, delivery, product-management]
status: idea
---

<!-- Draft idea — to be refined. Spin-off of the Two Clocks post's closing argument. -->

Working notes:

- Thesis: which flag turns on, for which client, in which release, is a product decision — so PMs should own the flag lifecycle, not just consume it.
- The maturity ladder: flags as merge-safety → flags as release trains → flags as per-client packaging → flags as pricing/tiering surface.
- Anti-patterns: flag graveyards, "temporary" flags older than the PM who added them, engineering-owned flags nobody dares remove.
- Operating rules we use: every flag has an owner, an intended lifespan, and a client-facing name; flag review is part of release review.
- Tie back to the two-clock model: the slow clock is really a flag-flip schedule.
